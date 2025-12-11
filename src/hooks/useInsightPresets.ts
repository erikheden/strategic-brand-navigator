import { useState, useMemo } from 'react';
import { Brand } from '@/types/brand';

export interface InsightPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  query: (brands: Brand[]) => InsightResult[];
}

export interface InsightResult {
  brand: string;
  country: string;
  industry: string;
  currentScore: number;
  volatility: number;
  trendSlope: number;
  inflationPerformance: number | null;
  highlight?: string;
  value?: number;
}

export const useInsightPresets = (brands: Brand[]) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [results, setResults] = useState<InsightResult[]>([]);
  const [loading, setLoading] = useState(false);

  const presets: InsightPreset[] = useMemo(() => [
    {
      id: 'cross-market-variance',
      name: 'Cross-Market Variance',
      description: 'Brands with biggest score differences across countries',
      icon: '🌍',
      query: (brands) => {
        const brandGroups: Record<string, Brand[]> = {};
        brands.forEach(b => {
          if (!brandGroups[b.Brand]) brandGroups[b.Brand] = [];
          brandGroups[b.Brand].push(b);
        });

        const variances = Object.entries(brandGroups)
          .filter(([_, group]) => group.length > 1)
          .map(([name, group]) => {
            const scores = group.map(b => b.Current_Score);
            const min = Math.min(...scores);
            const max = Math.max(...scores);
            const variance = max - min;
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            return {
              brand: name,
              country: group.map(b => b.Country).join(', '),
              industry: group[0].Industry,
              currentScore: avgScore,
              volatility: group.reduce((a, b) => a + b.Volatility, 0) / group.length,
              trendSlope: group.reduce((a, b) => a + b.Trend_Slope, 0) / group.length,
              inflationPerformance: null,
              highlight: `Score range: ${min.toFixed(1)} - ${max.toFixed(1)}`,
              value: variance,
            };
          })
          .sort((a, b) => (b.value || 0) - (a.value || 0))
          .slice(0, 15);

        return variances;
      },
    },
    {
      id: 'stability-champions',
      name: 'Stability Champions',
      description: 'Lowest volatility brands per country',
      icon: '🏆',
      query: (brands) => {
        const byCountry: Record<string, Brand[]> = {};
        brands.forEach(b => {
          if (!byCountry[b.Country]) byCountry[b.Country] = [];
          byCountry[b.Country].push(b);
        });

        const champions = Object.entries(byCountry)
          .map(([country, countryBrands]) => {
            const sorted = [...countryBrands].sort((a, b) => a.Volatility - b.Volatility);
            return sorted.slice(0, 3);
          })
          .flat()
          .map(b => ({
            brand: b.Brand,
            country: b.Country,
            industry: b.Industry,
            currentScore: b.Current_Score,
            volatility: b.Volatility,
            trendSlope: b.Trend_Slope,
            inflationPerformance: b.Inflation_Performance,
            highlight: `Volatility: ${b.Volatility.toFixed(3)}`,
            value: b.Volatility,
          }))
          .sort((a, b) => a.volatility - b.volatility);

        return champions;
      },
    },
    {
      id: 'rising-stars',
      name: 'Rising Stars',
      description: 'Highest positive trend by industry',
      icon: '🚀',
      query: (brands) => {
        return [...brands]
          .filter(b => b.Trend_Slope > 0)
          .sort((a, b) => b.Trend_Slope - a.Trend_Slope)
          .slice(0, 20)
          .map(b => ({
            brand: b.Brand,
            country: b.Country,
            industry: b.Industry,
            currentScore: b.Current_Score,
            volatility: b.Volatility,
            trendSlope: b.Trend_Slope,
            inflationPerformance: b.Inflation_Performance,
            highlight: `Trend: +${b.Trend_Slope.toFixed(3)}`,
            value: b.Trend_Slope,
          }));
      },
    },
    {
      id: 'at-risk-brands',
      name: 'At-Risk Brands',
      description: 'High volatility + negative trend (Danger Zone)',
      icon: '🚩',
      query: (brands) => {
        const medianVolatility = [...brands].sort((a, b) => a.Volatility - b.Volatility)[Math.floor(brands.length / 2)]?.Volatility || 0;
        
        return [...brands]
          .filter(b => b.Volatility > medianVolatility && b.Trend_Slope < 0)
          .sort((a, b) => a.Trend_Slope - b.Trend_Slope)
          .slice(0, 20)
          .map(b => ({
            brand: b.Brand,
            country: b.Country,
            industry: b.Industry,
            currentScore: b.Current_Score,
            volatility: b.Volatility,
            trendSlope: b.Trend_Slope,
            inflationPerformance: b.Inflation_Performance,
            highlight: `Risk Score: ${(b.Volatility * Math.abs(b.Trend_Slope) * 100).toFixed(1)}`,
            value: b.Volatility * Math.abs(b.Trend_Slope),
          }));
      },
    },
    {
      id: 'industry-outliers',
      name: 'Industry Outliers',
      description: 'Brands significantly above/below industry average',
      icon: '📊',
      query: (brands) => {
        const byIndustry: Record<string, Brand[]> = {};
        brands.forEach(b => {
          if (!byIndustry[b.Industry]) byIndustry[b.Industry] = [];
          byIndustry[b.Industry].push(b);
        });

        const industryAvgs: Record<string, number> = {};
        Object.entries(byIndustry).forEach(([industry, indBrands]) => {
          industryAvgs[industry] = indBrands.reduce((a, b) => a + b.Current_Score, 0) / indBrands.length;
        });

        return [...brands]
          .map(b => ({
            ...b,
            deviation: b.Current_Score - (industryAvgs[b.Industry] || 0),
          }))
          .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))
          .slice(0, 20)
          .map(b => ({
            brand: b.Brand,
            country: b.Country,
            industry: b.Industry,
            currentScore: b.Current_Score,
            volatility: b.Volatility,
            trendSlope: b.Trend_Slope,
            inflationPerformance: b.Inflation_Performance,
            highlight: `${b.deviation > 0 ? '+' : ''}${b.deviation.toFixed(1)} vs industry avg`,
            value: Math.abs(b.deviation),
          }));
      },
    },
    {
      id: 'inflation-survivors',
      name: 'Inflation Survivors',
      description: 'Brands with highest inflation performance',
      icon: '💪',
      query: (brands) => {
        return [...brands]
          .filter(b => b.Inflation_Performance !== null && b.Inflation_Performance > 0)
          .sort((a, b) => (b.Inflation_Performance || 0) - (a.Inflation_Performance || 0))
          .slice(0, 20)
          .map(b => ({
            brand: b.Brand,
            country: b.Country,
            industry: b.Industry,
            currentScore: b.Current_Score,
            volatility: b.Volatility,
            trendSlope: b.Trend_Slope,
            inflationPerformance: b.Inflation_Performance,
            highlight: `Inflation Perf: ${b.Inflation_Performance?.toFixed(2) || 'N/A'}`,
            value: b.Inflation_Performance || 0,
          }));
      },
    },
  ], []);

  const runPreset = (presetId: string) => {
    setLoading(true);
    setActivePreset(presetId);
    
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      const queryResults = preset.query(brands);
      setResults(queryResults);
    }
    
    setLoading(false);
  };

  const clearResults = () => {
    setActivePreset(null);
    setResults([]);
  };

  return {
    presets,
    activePreset,
    results,
    loading,
    runPreset,
    clearResults,
  };
};
