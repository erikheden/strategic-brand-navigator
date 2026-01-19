import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MarketAverage {
  country: string;
  year: number;
  score: number;
}

interface BrandScore {
  brand: string;
  country: string;
  year: number;
  score: number;
  industry: string;
}

interface DeviationDataPoint {
  year: number;
  marketAverage: number;
  [key: string]: number;
}

// Map country codes to full names
const countryCodeMap: Record<string, string> = {
  'SE': 'Sweden',
  'DK': 'Denmark',
  'NO': 'Norway',
  'FI': 'Finland',
};

export const useMarketDeviationData = () => {
  const [marketAverages, setMarketAverages] = useState<MarketAverage[]>([]);
  const [brandScoresByCountry, setBrandScoresByCountry] = useState<Record<string, BrandScore[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingCountry, setLoadingCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch only market averages on initial load (small dataset)
  useEffect(() => {
    const fetchMarketAverages = async () => {
      try {
        setLoading(true);
        
        const { data: avgData, error: avgError } = await supabase
          .from('SBI Average Scores')
          .select('country, year, score')
          .not('country', 'is', null)
          .not('year', 'is', null)
          .not('score', 'is', null);

        if (avgError) throw avgError;

        const transformedAverages: MarketAverage[] = (avgData || []).map(row => ({
          country: countryCodeMap[row.country] || row.country,
          year: row.year,
          score: row.score,
        }));

        setMarketAverages(transformedAverages);
      } catch (err) {
        console.error('Error fetching market averages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketAverages();
  }, []);

  // Fetch brand scores for a specific country on-demand
  const fetchBrandScoresForCountry = useCallback(async (country: string) => {
    if (brandScoresByCountry[country]) return; // Already fetched
    
    try {
      setLoadingCountry(country);
      setError(null);
      
      const { data: brandData, error: brandError } = await supabase
        .from('SBI Ranking Scores 2011-2025')
        .select('Brand, Country, Year, Score, industry')
        .eq('Country', country)
        .not('Brand', 'is', null)
        .not('Year', 'is', null)
        .not('Score', 'is', null);

      if (brandError) throw brandError;

      const transformedBrands: BrandScore[] = (brandData || []).map(row => ({
        brand: row.Brand,
        country: row.Country,
        year: row.Year,
        score: row.Score,
        industry: row.industry || 'Unknown',
      }));

      setBrandScoresByCountry(prev => ({
        ...prev,
        [country]: transformedBrands,
      }));
    } catch (err) {
      console.error(`Error fetching brand scores for ${country}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load brand data');
    } finally {
      setLoadingCountry(null);
    }
  }, [brandScoresByCountry]);

  // Get unique countries
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(marketAverages.map(a => a.country))];
    return uniqueCountries.sort();
  }, [marketAverages]);

  // Get brands for a specific country (from cached data)
  const getBrandsForCountry = useCallback((country: string) => {
    const countryBrands = brandScoresByCountry[country] || [];
    const brands = countryBrands.map(b => b.brand);
    return [...new Set(brands)].sort();
  }, [brandScoresByCountry]);

  // Get industries for a specific country
  const getIndustriesForCountry = useCallback((country: string) => {
    const countryBrands = brandScoresByCountry[country] || [];
    const industries = countryBrands.map(b => b.industry);
    return [...new Set(industries)].sort();
  }, [brandScoresByCountry]);

  // Calculate deviation data for selected brands
  const getDeviationData = useCallback((country: string, selectedBrands: string[]): DeviationDataPoint[] => {
    const countryAverages = marketAverages
      .filter(a => a.country === country)
      .sort((a, b) => a.year - b.year);

    if (countryAverages.length === 0) return [];

    const countryBrandScores = brandScoresByCountry[country] || [];
    const relevantBrandScores = countryBrandScores.filter(
      b => selectedBrands.includes(b.brand)
    );

    const years = [...new Set(countryAverages.map(a => a.year))].sort();
    
    return years.map(year => {
      const avgForYear = countryAverages.find(a => a.year === year);
      const marketAverage = avgForYear?.score || 0;

      const dataPoint: DeviationDataPoint = {
        year,
        marketAverage,
      };

      selectedBrands.forEach(brand => {
        const brandScore = relevantBrandScores.find(
          b => b.brand === brand && b.year === year
        );
        if (brandScore) {
          dataPoint[brand] = brandScore.score - marketAverage;
        }
      });

      return dataPoint;
    });
  }, [marketAverages, brandScoresByCountry]);

  // Get all brand scores for current country (for compatibility)
  const brandScores = useMemo(() => {
    return Object.values(brandScoresByCountry).flat();
  }, [brandScoresByCountry]);

  return {
    loading,
    loadingCountry,
    error,
    countries,
    fetchBrandScoresForCountry,
    getBrandsForCountry,
    getIndustriesForCountry,
    getDeviationData,
    brandScores,
  };
};
