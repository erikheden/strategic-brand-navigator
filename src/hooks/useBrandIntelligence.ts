import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HistoricalScore {
  year: number;
  score: number;
  industry: string;
  country: string;
}

export interface AwarenessAttitude {
  year: number;
  awareness: number;
  attitude: number;
  industry: string;
}

export interface CompetitorRanking {
  brand: string;
  rankingPosition: number;
  overallRanking: number;
  industry: string;
}

export interface BrandIntelligence {
  historicalScores: HistoricalScore[];
  awarenessAttitude: AwarenessAttitude[];
  competitors: CompetitorRanking[];
  currentData: {
    score: number;
    volatility: number;
    trendSlope: number;
    inflationPerformance: number | null;
    industry: string;
  } | null;
}

export function useBrandIntelligence(brandName: string, country: string) {
  const [data, setData] = useState<BrandIntelligence>({
    historicalScores: [],
    awarenessAttitude: [],
    competitors: [],
    currentData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!brandName || !country) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [historicalRes, awarenessRes, currentRes] = await Promise.all([
          // Historical scores 2011-2025
          supabase
            .from('SBI Ranking Scores 2011-2025')
            .select('Year, Score, industry, Country, Brand')
            .eq('Brand', brandName)
            .eq('Country', country)
            .order('Year', { ascending: true }),

          // Awareness & Attitude data
          supabase
            .from('Awareness_Attitude_2019-2024')
            .select('year, awareness_level, brand_attitude, industry')
            .eq('brand', brandName)
            .eq('country', country)
            .order('year', { ascending: true }),

          // Current inflation/stability data
          supabase
            .from('SBI_Inflation_Stability_2025')
            .select('*')
            .eq('Brand', brandName)
            .eq('Country', country)
            .single(),
        ]);

        // Get industry from current data for competitor lookup
        const industry = currentRes.data?.Industry;

        // Fetch competitors (same industry, same country)
        let competitorsData: CompetitorRanking[] = [];
        if (industry) {
          const competitorRes = await supabase
            .from('SBI Ranking Positions 2025 only')
            .select('Brand, "Ranking Position", "Overall Country Ranking", industry')
            .eq('Country', country)
            .eq('industry', industry)
            .order('Ranking Position', { ascending: true });

          if (competitorRes.data) {
            competitorsData = competitorRes.data.map((c) => ({
              brand: c.Brand || '',
              rankingPosition: c['Ranking Position'] || 0,
              overallRanking: c['Overall Country Ranking'] || 0,
              industry: c.industry || '',
            }));
          }
        }

        // Process historical scores
        const historicalScores: HistoricalScore[] = (historicalRes.data || []).map((row) => ({
          year: row.Year || 0,
          score: row.Score || 0,
          industry: row.industry || '',
          country: row.Country || '',
        }));

        // Process awareness/attitude
        const awarenessAttitude: AwarenessAttitude[] = (awarenessRes.data || []).map((row) => ({
          year: row.year || 0,
          awareness: row.awareness_level || 0,
          attitude: row.brand_attitude || 0,
          industry: row.industry || '',
        }));

        // Current data
        const currentData = currentRes.data
          ? {
              score: currentRes.data.Current_Score || 0,
              volatility: currentRes.data.Volatility || 0,
              trendSlope: currentRes.data.Trend_Slope || 0,
              inflationPerformance: currentRes.data.Inflation_Performance
                ? parseFloat(currentRes.data.Inflation_Performance)
                : null,
              industry: currentRes.data.Industry || '',
            }
          : null;

        setData({
          historicalScores,
          awarenessAttitude,
          competitors: competitorsData,
          currentData,
        });
      } catch (err) {
        console.error('Error fetching brand intelligence:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandName, country]);

  // Calculate insights
  const insights = useMemo((): {
    trajectory: 'rising' | 'declining' | 'stable';
    trajectoryChange: number;
    peakYear: HistoricalScore | null;
    lowYear: HistoricalScore | null;
    volatilityLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    opportunities: string[];
  } => {
    const { historicalScores, currentData } = data;

    if (historicalScores.length < 2) {
      return {
        trajectory: 'stable',
        trajectoryChange: 0,
        peakYear: null,
        lowYear: null,
        volatilityLevel: 'medium',
        riskFactors: [],
        opportunities: [],
      };
    }

    // Calculate trajectory
    const recentScores = historicalScores.slice(-3);
    const oldScores = historicalScores.slice(-6, -3);
    const recentAvg = recentScores.reduce((a, b) => a + b.score, 0) / recentScores.length;
    const oldAvg = oldScores.length > 0 
      ? oldScores.reduce((a, b) => a + b.score, 0) / oldScores.length 
      : recentAvg;
    const trajectoryChange = recentAvg - oldAvg;

    const trajectory: 'rising' | 'declining' | 'stable' = trajectoryChange > 2 ? 'rising' : trajectoryChange < -2 ? 'declining' : 'stable';

    // Peak and low years
    const peak = historicalScores.reduce((a, b) => (a.score > b.score ? a : b));
    const low = historicalScores.reduce((a, b) => (a.score < b.score ? a : b));

    // Volatility level
    const volatilityLevel: 'low' | 'medium' | 'high' = currentData
      ? currentData.volatility < 3 ? 'low' : currentData.volatility > 6 ? 'high' : 'medium'
      : 'medium';

    // Risk factors
    const riskFactors: string[] = [];
    if (trajectory === 'declining') riskFactors.push('Declining score trajectory over past 3 years');
    if (volatilityLevel === 'high') riskFactors.push('High score volatility indicates inconsistent performance');
    if (currentData?.inflationPerformance && currentData.inflationPerformance < 0) {
      riskFactors.push('Negative inflation performance suggests brand struggling during economic uncertainty');
    }

    // Opportunities
    const opportunities: string[] = [];
    if (trajectory === 'rising') opportunities.push('Strong upward momentum - capitalize on growth');
    if (volatilityLevel === 'low') opportunities.push('Stable brand perception - good foundation for expansion');
    if (currentData?.inflationPerformance && currentData.inflationPerformance > 5) {
      opportunities.push('Outperforming during inflation - position as value leader');
    }

    return {
      trajectory,
      trajectoryChange,
      peakYear: peak,
      lowYear: low,
      volatilityLevel,
      riskFactors,
      opportunities,
    };
  }, [data]);

  return { data, loading, error, insights };
}
