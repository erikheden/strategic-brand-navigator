import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Brand } from '@/types/brand';

export function useBrandData() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all brands using pagination to bypass 1000 row limit
        const PAGE_SIZE = 1000;
        let allData: any[] = [];
        let page = 0;
        let hasMore = true;

        while (hasMore) {
          const start = page * PAGE_SIZE;
          const end = start + PAGE_SIZE - 1;

          const { data, error: queryError } = await supabase
            .from('SBI_Inflation_Stability_2025')
            .select('*')
            .range(start, end);

          if (queryError) {
            throw queryError;
          }

          allData = [...allData, ...(data || [])];
          hasMore = (data?.length || 0) === PAGE_SIZE;
          page++;
        }

        const validBrands: Brand[] = allData
          .filter(row => row.Brand && row.Volatility !== null)
          .map(row => ({
            Brand: row.Brand || '',
            Country: row.Country || '',
            Industry: row.Industry || '',
            Current_Score: Number(row.Current_Score) || 0,
            Volatility: Number(row.Volatility) || 0,
            Trend_Slope: Number(row.Trend_Slope) || 0,
            Inflation_Performance: row.Inflation_Performance !== null && row.Inflation_Performance !== ''
              ? Number(row.Inflation_Performance)
              : null,
          }));

        setBrands(validBrands);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = useMemo(() => {
    if (brands.length === 0) return { medianVolatility: 0, medianInflation: 0 };
    
    const volatilities = brands.map(b => b.Volatility).sort((a, b) => a - b);
    const inflations = brands
      .filter(b => b.Inflation_Performance !== null)
      .map(b => b.Inflation_Performance as number)
      .sort((a, b) => a - b);
    
    const medianVolatility = volatilities[Math.floor(volatilities.length / 2)] || 0;
    const medianInflation = inflations.length > 0 
      ? inflations[Math.floor(inflations.length / 2)] 
      : 0;
    
    return { medianVolatility, medianInflation };
  }, [brands]);

  return { brands, loading, error, stats };
}
