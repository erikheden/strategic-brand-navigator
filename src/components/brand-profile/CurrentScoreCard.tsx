import { TrendingUp, TrendingDown, Activity, Flame } from 'lucide-react';

interface CurrentScoreCardProps {
  data: {
    score: number;
    volatility: number;
    trendSlope: number;
    inflationPerformance: number | null;
  };
}

export function CurrentScoreCard({ data }: CurrentScoreCardProps) {
  const trendIcon = data.trendSlope > 0 ? TrendingUp : data.trendSlope < 0 ? TrendingDown : Activity;
  const trendColor = data.trendSlope > 0 ? 'text-[hsl(var(--fortress))]' : data.trendSlope < 0 ? 'text-[hsl(var(--danger))]' : 'text-muted-foreground';
  const TrendIconComponent = trendIcon;

  return (
    <div className="flex items-center gap-6 bg-muted/50 rounded-lg px-6 py-4">
      {/* Current Score */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Current Score</p>
        <p className="text-3xl font-bold text-foreground">{data.score.toFixed(1)}</p>
      </div>

      <div className="h-12 w-px bg-border" />

      {/* Trend */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Trend</p>
        <div className={`flex items-center gap-1 justify-center ${trendColor}`}>
          <TrendIconComponent className="h-5 w-5" />
          <span className="font-semibold">{data.trendSlope > 0 ? '+' : ''}{data.trendSlope.toFixed(2)}</span>
        </div>
      </div>

      <div className="h-12 w-px bg-border" />

      {/* Volatility */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Volatility</p>
        <div className="flex items-center gap-1 justify-center text-muted-foreground">
          <Activity className="h-5 w-5" />
          <span className="font-semibold">{data.volatility.toFixed(2)}</span>
        </div>
      </div>

      {data.inflationPerformance !== null && (
        <>
          <div className="h-12 w-px bg-border" />
          
          {/* Inflation Performance */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Inflation Perf.</p>
            <div className={`flex items-center gap-1 justify-center ${data.inflationPerformance > 0 ? 'text-[hsl(var(--fortress))]' : 'text-[hsl(var(--danger))]'}`}>
              <Flame className="h-5 w-5" />
              <span className="font-semibold">{data.inflationPerformance > 0 ? '+' : ''}{data.inflationPerformance.toFixed(1)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
