import { TrendingUp, TrendingDown, Activity, Flame, Shield } from 'lucide-react';

interface MetricsGridProps {
  trendSlope: number;
  volatility: number;
  inflationPerformance: number | null;
  medianVolatility: number;
}

export function MetricsGrid({
  trendSlope,
  volatility,
  inflationPerformance,
  medianVolatility,
}: MetricsGridProps) {
  const isRising = trendSlope > 0;
  const isLowVolatility = volatility < medianVolatility;
  const stabilityPercent = Math.max(0, Math.min(100, Math.round((1 - volatility / 20) * 100)));

  const metrics = [
    {
      icon: isRising ? TrendingUp : TrendingDown,
      label: 'Trend',
      value: `${isRising ? '+' : ''}${trendSlope.toFixed(1)}`,
      sublabel: isRising ? 'Rising' : trendSlope < 0 ? 'Declining' : 'Stable',
      color: isRising ? 'text-chart-2' : trendSlope < 0 ? 'text-destructive' : 'text-muted-foreground',
    },
    {
      icon: Activity,
      label: 'Volatility',
      value: volatility.toFixed(1),
      sublabel: isLowVolatility ? 'Low' : 'High',
      color: isLowVolatility ? 'text-chart-2' : 'text-amber-500',
    },
    {
      icon: Flame,
      label: 'Inflation Perf.',
      value: inflationPerformance !== null ? `${inflationPerformance > 0 ? '+' : ''}${inflationPerformance.toFixed(1)}%` : 'N/A',
      sublabel: inflationPerformance !== null 
        ? (inflationPerformance > 0 ? 'Positive' : inflationPerformance < 0 ? 'Negative' : 'Neutral')
        : 'No data',
      color: inflationPerformance !== null 
        ? (inflationPerformance > 0 ? 'text-chart-2' : inflationPerformance < 0 ? 'text-destructive' : 'text-muted-foreground')
        : 'text-muted-foreground',
    },
    {
      icon: Shield,
      label: 'Stability',
      value: `${stabilityPercent}%`,
      sublabel: stabilityPercent >= 70 ? 'High' : stabilityPercent >= 40 ? 'Medium' : 'Low',
      color: stabilityPercent >= 70 ? 'text-chart-2' : stabilityPercent >= 40 ? 'text-amber-500' : 'text-destructive',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-muted/30 rounded-lg p-3 text-center">
          <metric.icon className={`h-4 w-4 mx-auto mb-1 ${metric.color}`} />
          <div className="text-xs text-muted-foreground mb-0.5">{metric.label}</div>
          <div className={`text-base font-semibold ${metric.color}`}>{metric.value}</div>
          <div className="text-xs text-muted-foreground">{metric.sublabel}</div>
        </div>
      ))}
    </div>
  );
}
