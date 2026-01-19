import { useState, useEffect, useMemo } from 'react';
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
  [key: string]: number; // brand deviation values
}

// Map country codes to full names
const countryCodeMap: Record<string, string> = {
  'SE': 'Sweden',
  'DK': 'Denmark',
  'NO': 'Norway',
  'FI': 'Finland',
};

const countryNameToCode: Record<string, string> = {
  'Sweden': 'SE',
  'Denmark': 'DK',
  'Norway': 'NO',
  'Finland': 'FI',
};

export const useMarketDeviationData = () => {
  const [marketAverages, setMarketAverages] = useState<MarketAverage[]>([]);
  const [brandScores, setBrandScores] = useState<BrandScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch market averages
        const { data: avgData, error: avgError } = await supabase
          .from('SBI Average Scores')
          .select('country, year, score')
          .not('country', 'is', null)
          .not('year', 'is', null)
          .not('score', 'is', null);

        if (avgError) throw avgError;

        // Fetch all brand scores using pagination to get complete dataset
        const allBrandScores: any[] = [];
        const pageSize = 1000;
        let from = 0;
        let hasMore = true;

        while (hasMore) {
          const { data: brandData, error: brandError } = await supabase
            .from('SBI Ranking Scores 2011-2025')
            .select('Brand, Country, Year, Score, industry')
            .not('Brand', 'is', null)
            .not('Country', 'is', null)
            .not('Year', 'is', null)
            .not('Score', 'is', null)
            .range(from, from + pageSize - 1);

          if (brandError) throw brandError;

          if (brandData && brandData.length > 0) {
            allBrandScores.push(...brandData);
            from += pageSize;
            hasMore = brandData.length === pageSize;
          } else {
            hasMore = false;
          }
        }

        // Transform market averages
        const transformedAverages: MarketAverage[] = (avgData || []).map(row => ({
          country: countryCodeMap[row.country] || row.country,
          year: row.year,
          score: row.score,
        }));

        // Transform brand scores
        const transformedBrands: BrandScore[] = allBrandScores.map(row => ({
          brand: row.Brand,
          country: row.Country,
          year: row.Year,
          score: row.Score,
          industry: row.industry || 'Unknown',
        }));

        setMarketAverages(transformedAverages);
        setBrandScores(transformedBrands);
      } catch (err) {
        console.error('Error fetching market deviation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique countries and brands
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(marketAverages.map(a => a.country))];
    return uniqueCountries.sort();
  }, [marketAverages]);

  const getBrandsForCountry = (country: string) => {
    const brands = brandScores
      .filter(b => b.country === country)
      .map(b => b.brand);
    return [...new Set(brands)].sort();
  };

  const getIndustriesForCountry = (country: string) => {
    const industries = brandScores
      .filter(b => b.country === country)
      .map(b => b.industry);
    return [...new Set(industries)].sort();
  };

  const getDeviationData = (country: string, selectedBrands: string[]): DeviationDataPoint[] => {
    // Get market averages for this country
    const countryAverages = marketAverages
      .filter(a => a.country === country)
      .sort((a, b) => a.year - b.year);

    if (countryAverages.length === 0) return [];

    // Get brand scores for selected brands in this country
    const relevantBrandScores = brandScores.filter(
      b => b.country === country && selectedBrands.includes(b.brand)
    );

    // Build deviation data by year
    const years = [...new Set(countryAverages.map(a => a.year))].sort();
    
    return years.map(year => {
      const avgForYear = countryAverages.find(a => a.year === year);
      const marketAverage = avgForYear?.score || 0;

      const dataPoint: DeviationDataPoint = {
        year,
        marketAverage,
      };

      // Calculate deviation for each selected brand
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
  };

  return {
    loading,
    error,
    countries,
    getBrandsForCountry,
    getIndustriesForCountry,
    getDeviationData,
    brandScores,
  };
};
