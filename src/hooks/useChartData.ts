import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ChartConfiguration, AvailableTable } from '@/types/chart-maker';
import type Highcharts from 'highcharts';
import { CHART_COLOR_SEQUENCES } from '@/lib/chart-theme';

// Type guard for table names - we need to use a more flexible approach
// since Supabase types don't include all our tables
function isValidTable(table: string): table is AvailableTable {
  const validTables: string[] = [
    'SBI_Discussion_Topics',
    'SBI Average Scores',
    'SBI_Priorities_Age_Groups',
    'SBI Ranking Positions 2025 only',
    'SBI_Discussion_Topics_Geography',
    'SBI Ranking Scores 2011-2025',
    'age_groups',
    'SBI_Inflation_Stability_2025',
    'SBI_Knowledge',
    'SBI_purchasing_decision_industries',
    'materiality_areas__age_sbi',
    'materiality_areas_general_sbi',
    'SBI SBA 2011-2025',
    'SBI SBQ 2011-2025',
    'SBI_VHO_2021-2024',
    'SBI_behaviour_groups',
    'SBI_influences',
    'SB Ranking Scores 2019-2025 BY AGE',
  ];
  return validTables.includes(table);
}

export function useChartData(config: ChartConfiguration | null) {
  const [data, setData] = useState<Highcharts.SeriesOptionsType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!config) {
      setData([]);
      setCategories([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { table, columns, filters, orderBy, limit } = config.dataQuery;

      if (!isValidTable(table)) {
        throw new Error(`Invalid table: ${table}`);
      }

      // Build query using type assertion since not all tables are in generated types
      let query = supabase
        .from(table as any)
        .select(columns.join(', '));

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: rawData, error: queryError } = await query;

      if (queryError) throw queryError;

      if (!rawData || rawData.length === 0) {
        setData([]);
        setCategories([]);
        return;
      }

      // Transform data based on chart type
      const transformedData = transformDataForChart(config, rawData);
      setData(transformedData.series);
      setCategories(transformedData.categories);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, categories, isLoading, error, refetch: fetchData };
}

// Transform raw data into Highcharts series format
function transformDataForChart(
  config: ChartConfiguration,
  rawData: any[]
): { series: Highcharts.SeriesOptionsType[]; categories: string[] } {
  const { chartType, xAxisField, yAxisField, seriesField, colorSequence = 'primary' } = config;
  const colors = CHART_COLOR_SEQUENCES[colorSequence];

  // Handle pie/donut charts
  if (chartType === 'pie' || chartType === 'donut') {
    const pieData = rawData.map((row, index) => ({
      name: String(row[xAxisField]),
      y: Number(row[yAxisField as string]) || 0,
      color: colors[index % colors.length],
    }));

    return {
      series: [{
        type: 'pie',
        name: config.title,
        data: pieData,
      }] as Highcharts.SeriesOptionsType[],
      categories: [],
    };
  }

  // Handle scatter/bubble charts
  if (chartType === 'scatter' || chartType === 'bubble') {
    const yFields = Array.isArray(yAxisField) ? yAxisField : [yAxisField];
    const scatterData = rawData.map(row => ({
      x: Number(row[xAxisField]) || 0,
      y: Number(row[yFields[0]]) || 0,
      ...(chartType === 'bubble' && yFields[1] ? { z: Number(row[yFields[1]]) || 0 } : {}),
      name: row.Brand || row.brand || row[xAxisField],
    }));

    return {
      series: [{
        type: chartType,
        name: config.title,
        data: scatterData,
        color: colors[0],
      }] as Highcharts.SeriesOptionsType[],
      categories: [],
    };
  }

  // Handle grouped series (e.g., multiple brands over time)
  if (seriesField) {
    const categories = [...new Set(rawData.map(row => String(row[xAxisField])))].sort();
    const groups = [...new Set(rawData.map(row => String(row[seriesField])))];
    
    const series: Highcharts.SeriesOptionsType[] = groups.map((group, index) => ({
      type: chartType as any,
      name: group,
      color: colors[index % colors.length],
      data: categories.map(cat => {
        const match = rawData.find(
          row => String(row[xAxisField]) === cat && String(row[seriesField]) === group
        );
        return match ? Number(match[yAxisField as string]) || 0 : null;
      }),
    }));

    return { series, categories };
  }

  // Handle simple series (single line/bar)
  const categories = rawData.map(row => String(row[xAxisField]));
  const yFields = Array.isArray(yAxisField) ? yAxisField : [yAxisField];

  const series: Highcharts.SeriesOptionsType[] = yFields.map((field, index) => ({
    type: chartType as any,
    name: field,
    color: colors[index % colors.length],
    data: rawData.map(row => Number(row[field]) || 0),
  }));

  return { series, categories };
}
