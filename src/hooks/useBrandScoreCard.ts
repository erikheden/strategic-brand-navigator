import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Brand, getQuadrant, QuadrantType } from '@/types/brand';

interface RankingData {
  industryRank: number | null;
  countryRank: number | null;
  totalInIndustry: number;
  totalInCountry: number;
}

interface HistoricalScore {
  year: number;
  score: number;
}

interface MarketAverage {
  year: number;
  score: number;
}

export interface BrandScoreCardData {
  brand: Brand;
  ranking: RankingData;
  historicalScores: HistoricalScore[];
  marketAverages: MarketAverage[];
  percentileInCountry: number;
  percentileInIndustry: number;
  quadrant: QuadrantType;
  medianVolatility: number;
  medianInflation: number;
}

export function useBrandScoreCard() {
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [scoreCardData, setScoreCardData] = useState<BrandScoreCardData | null>(null);
  const [loadingScoreCard, setLoadingScoreCard] = useState(false);

  // Fetch all brands for selection
  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const allData: Brand[] = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase
            .from('SBI_Inflation_Stability_2025')
            .select('*')
            .range(from, from + pageSize - 1);

          if (error) throw error;

          if (data && data.length > 0) {
            const mapped = data
              .filter(row => row.Brand && row.Country && row.Current_Score !== null)
              .map(row => ({
                Brand: row.Brand!,
                Country: row.Country!,
                Industry: row.Industry || 'Unknown',
                Current_Score: row.Current_Score!,
                Volatility: row.Volatility || 0,
                Trend_Slope: row.Trend_Slope || 0,
                Inflation_Performance: row.Inflation_Performance ? parseFloat(row.Inflation_Performance) : null,
              }));
            allData.push(...mapped);
            from += pageSize;
            hasMore = data.length === pageSize;
          } else {
            hasMore = false;
          }
        }

        setAllBrands(allData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  // Calculate medians
  const stats = useMemo(() => {
    if (allBrands.length === 0) return { medianVolatility: 0, medianInflation: 0 };

    const sortedVolatility = [...allBrands].sort((a, b) => a.Volatility - b.Volatility);
    const sortedInflation = [...allBrands]
      .filter(b => b.Inflation_Performance !== null)
      .sort((a, b) => (a.Inflation_Performance ?? 0) - (b.Inflation_Performance ?? 0));

    const medianVolatility = sortedVolatility[Math.floor(sortedVolatility.length / 2)]?.Volatility || 0;
    const medianInflation = sortedInflation[Math.floor(sortedInflation.length / 2)]?.Inflation_Performance || 0;

    return { medianVolatility, medianInflation };
  }, [allBrands]);

  // Get unique countries
  const countries = useMemo(() => {
    return [...new Set(allBrands.map(b => b.Country))].filter(Boolean).sort();
  }, [allBrands]);

  // Get brands for a specific country
  const getBrandsForCountry = (country: string) => {
    return allBrands
      .filter(b => b.Country === country)
      .sort((a, b) => a.Brand.localeCompare(b.Brand));
  };

  // Fetch detailed score card data for selected brand
  const fetchScoreCardData = async (brand: Brand) => {
    try {
      setLoadingScoreCard(true);
      setSelectedBrand(brand);

      // Fetch ranking data
      const { data: rankingData } = await supabase
        .from('SBI Ranking Positions 2025 only')
        .select('*')
        .eq('Brand', brand.Brand)
        .eq('Country', brand.Country)
        .single();

      // Fetch historical scores (last 5 years)
      const { data: historicalData } = await supabase
        .from('SBI Ranking Scores 2011-2025')
        .select('Year, Score')
        .eq('Brand', brand.Brand)
        .eq('Country', brand.Country)
        .gte('Year', 2020)
        .order('Year', { ascending: true });

      // Fetch market averages
      const { data: marketData } = await supabase
        .from('SBI Average Scores')
        .select('year, score, country')
        .eq('country', brand.Country)
        .gte('year', 2020)
        .order('year', { ascending: true });

      // Calculate rankings within country and industry
      const brandsInCountry = allBrands.filter(b => b.Country === brand.Country);
      const brandsInIndustry = allBrands.filter(
        b => b.Country === brand.Country && b.Industry === brand.Industry
      );

      const sortedByScoreCountry = [...brandsInCountry].sort((a, b) => b.Current_Score - a.Current_Score);
      const sortedByScoreIndustry = [...brandsInIndustry].sort((a, b) => b.Current_Score - a.Current_Score);

      const countryRank = sortedByScoreCountry.findIndex(b => b.Brand === brand.Brand) + 1;
      const industryRank = sortedByScoreIndustry.findIndex(b => b.Brand === brand.Brand) + 1;

      const percentileInCountry = Math.round(((brandsInCountry.length - countryRank) / brandsInCountry.length) * 100);
      const percentileInIndustry = Math.round(((brandsInIndustry.length - industryRank) / brandsInIndustry.length) * 100);

      const quadrant = getQuadrant(
        brand.Volatility,
        brand.Inflation_Performance,
        stats.medianVolatility,
        stats.medianInflation
      );

      setScoreCardData({
        brand,
        ranking: {
          industryRank: rankingData?.['Ranking Position'] || industryRank,
          countryRank: rankingData?.['Overall Country Ranking'] || countryRank,
          totalInIndustry: brandsInIndustry.length,
          totalInCountry: brandsInCountry.length,
        },
        historicalScores: (historicalData || [])
          .filter(h => h.Score !== null)
          .map(h => ({ year: h.Year!, score: h.Score! })),
        marketAverages: (marketData || [])
          .filter(m => m.score !== null)
          .map(m => ({ year: m.year!, score: m.score! })),
        percentileInCountry,
        percentileInIndustry,
        quadrant,
        medianVolatility: stats.medianVolatility,
        medianInflation: stats.medianInflation,
      });
    } catch (err) {
      console.error('Error fetching score card data:', err);
    } finally {
      setLoadingScoreCard(false);
    }
  };

  const clearSelection = () => {
    setSelectedBrand(null);
    setScoreCardData(null);
  };

  return {
    allBrands,
    loading,
    error,
    countries,
    getBrandsForCountry,
    selectedBrand,
    scoreCardData,
    loadingScoreCard,
    fetchScoreCardData,
    clearSelection,
    stats,
  };
}
