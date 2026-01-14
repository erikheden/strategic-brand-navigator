import { Lightbulb } from 'lucide-react';
import { QuadrantType, QUADRANT_CONFIG } from '@/types/brand';

interface StrategicSummaryProps {
  quadrant: QuadrantType;
  brandName: string;
  trendSlope: number;
  percentile: number;
  inflationPerformance: number | null;
}

export function StrategicSummary({
  quadrant,
  brandName,
  trendSlope,
  percentile,
  inflationPerformance,
}: StrategicSummaryProps) {
  const config = QUADRANT_CONFIG[quadrant];

  // Generate dynamic insights based on data
  const getInsights = () => {
    const insights: string[] = [];

    // Trend-based insight
    if (trendSlope > 2) {
      insights.push(`${brandName} shows strong upward momentum in sustainability perception.`);
    } else if (trendSlope > 0) {
      insights.push(`${brandName} demonstrates steady improvement in sustainability standing.`);
    } else if (trendSlope < -2) {
      insights.push(`${brandName}'s sustainability perception has declined recently, requiring attention.`);
    } else if (trendSlope < 0) {
      insights.push(`${brandName} shows slight decline in sustainability metrics.`);
    }

    // Percentile-based insight
    if (percentile >= 90) {
      insights.push(`Ranking in the top ${100 - percentile}% positions ${brandName} as a sustainability leader.`);
    } else if (percentile >= 70) {
      insights.push(`With strong market positioning, there's opportunity to reach top-tier status.`);
    } else if (percentile < 30) {
      insights.push(`Significant improvement potential exists to strengthen market position.`);
    }

    // Inflation performance insight
    if (inflationPerformance !== null) {
      if (inflationPerformance > 5) {
        insights.push(`Exceptional resilience during inflationary periods demonstrates brand strength.`);
      } else if (inflationPerformance < -5) {
        insights.push(`Economic pressures have impacted sustainability perception—consider messaging adjustments.`);
      }
    }

    return insights.length > 0 ? insights.join(' ') : config.description;
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">Strategic Insight</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getInsights()}
          </p>
          <p className="text-sm text-foreground font-medium mt-2">
            {config.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
