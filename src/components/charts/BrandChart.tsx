import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getChartOptions, CHART_TYPE_DEFAULTS } from '@/lib/chart-theme';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Track if modules are initialized
let modulesInitialized = false;

// Initialize additional Highcharts modules
function initHighchartsModules() {
  if (modulesInitialized) return;
  
  try {
    // These modules auto-register when imported
    require('highcharts/highcharts-more')(Highcharts);
    require('highcharts/modules/sankey')(Highcharts);
    require('highcharts/modules/funnel')(Highcharts);
    require('highcharts/modules/treemap')(Highcharts);
    require('highcharts/modules/heatmap')(Highcharts);
    require('highcharts/modules/solid-gauge')(Highcharts);
    modulesInitialized = true;
  } catch (e) {
    // Modules may already be initialized or not needed for basic charts
    console.warn('Highcharts modules initialization:', e);
    modulesInitialized = true;
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initHighchartsModules();
}

export type ChartType = keyof typeof CHART_TYPE_DEFAULTS;

export interface BrandChartProps {
  /** Chart type */
  type: ChartType;
  /** Chart title */
  title?: string;
  /** Chart subtitle/description */
  subtitle?: string;
  /** Series data */
  series: Highcharts.SeriesOptionsType[];
  /** X-axis categories (for bar/column/line) */
  categories?: string[];
  /** Custom Highcharts options (merged with theme) */
  options?: Partial<Highcharts.Options>;
  /** Chart height in pixels */
  height?: number;
  /** Dark mode */
  isDarkMode?: boolean;
  /** Additional className */
  className?: string;
  /** Show in card wrapper */
  showCard?: boolean;
  /** Icon to display in card header */
  icon?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Callback when chart is rendered */
  onChartReady?: (chart: Highcharts.Chart) => void;
}

export function BrandChart({
  type,
  title,
  subtitle,
  series,
  categories,
  options = {},
  height = 400,
  isDarkMode = false,
  className,
  showCard = true,
  icon,
  isLoading = false,
  onChartReady,
}: BrandChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Build merged options
  const chartOptions = getChartOptions(type, {
    ...options,
    chart: {
      ...options.chart,
      height,
    },
    title: title ? { text: title, ...options.title } : { text: undefined },
    subtitle: subtitle ? { text: subtitle, ...options.subtitle } : { text: undefined },
    xAxis: categories 
      ? { categories, ...options.xAxis } 
      : options.xAxis,
    series,
  }, isDarkMode);

  // Remove title/subtitle from chart if using card wrapper
  if (showCard && (title || subtitle)) {
    chartOptions.title = { text: undefined };
    chartOptions.subtitle = { text: undefined };
  }

  useEffect(() => {
    if (chartRef.current?.chart && onChartReady) {
      onChartReady(chartRef.current.chart);
    }
  }, [onChartReady]);

  const chartElement = (
    <div className={cn('w-full', !showCard && className)}>
      {isLoading ? (
        <div 
          className="flex items-center justify-center bg-muted/30 rounded-lg animate-pulse"
          style={{ height }}
        >
          <span className="text-muted-foreground">Loading chart...</span>
        </div>
      ) : (
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ className: 'w-full' }}
        />
      )}
    </div>
  );

  if (!showCard) {
    return chartElement;
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {(title || subtitle) && (
        <CardHeader className="pb-2">
          {title && (
            <CardTitle className="flex items-center gap-2 text-lg">
              {icon}
              {title}
            </CardTitle>
          )}
          {subtitle && (
            <CardDescription>{subtitle}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={!title && !subtitle ? 'pt-4' : ''}>
        {chartElement}
      </CardContent>
    </Card>
  );
}

// Convenience components for common chart types
export function LineChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="line" {...props} />;
}

export function BarChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="bar" {...props} />;
}

export function ColumnChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="column" {...props} />;
}

export function PieChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="pie" {...props} />;
}

export function DonutChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="donut" {...props} />;
}

export function AreaChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="area" {...props} />;
}

export function ScatterChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="scatter" {...props} />;
}

export function RadarChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="radar" {...props} />;
}

export function TreemapChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="treemap" {...props} />;
}

export function HeatmapChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="heatmap" {...props} />;
}

export function FunnelChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="funnel" {...props} />;
}

export function GaugeChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="gauge" {...props} />;
}

export function BubbleChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="bubble" {...props} />;
}

export function WaterfallChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="waterfall" {...props} />;
}

export function SankeyChart(props: Omit<BrandChartProps, 'type'>) {
  return <BrandChart type="sankey" {...props} />;
}
