import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Brand } from '@/types/brand';

export function useBrandData() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/src/data/brand-data.csv');
        const csvText = await response.text();
        
        Papa.parse<Brand>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const validBrands = results.data
              .filter(brand => brand.Brand && brand.Volatility !== null)
              .map(brand => ({
                ...brand,
                Current_Score: Number(brand.Current_Score) || 0,
                Volatility: Number(brand.Volatility) || 0,
                Trend_Slope: Number(brand.Trend_Slope) || 0,
                Inflation_Performance: brand.Inflation_Performance !== null && String(brand.Inflation_Performance) !== '' 
                  ? Number(brand.Inflation_Performance) 
                  : null,
              }));
            setBrands(validBrands);
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          },
        });
      } catch (err) {
        setError('Failed to load brand data');
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
