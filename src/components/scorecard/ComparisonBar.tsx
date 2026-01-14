interface ComparisonBarProps {
  brandScore: number;
  marketAverage: number;
  label?: string;
}

export function ComparisonBar({ brandScore, marketAverage, label = "vs. Market Average" }: ComparisonBarProps) {
  const difference = brandScore - marketAverage;
  const maxScore = Math.max(brandScore, marketAverage, 80);
  const brandPercent = (brandScore / maxScore) * 100;
  const marketPercent = (marketAverage / maxScore) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label} ({marketAverage.toFixed(1)})</span>
        <span className={`font-medium ${difference >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
          {difference >= 0 ? '+' : ''}{difference.toFixed(1)} points
        </span>
      </div>
      
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        {/* Market average marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
          style={{ left: `${marketPercent}%` }}
        />
        
        {/* Brand score bar */}
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${
            difference >= 0 ? 'bg-chart-2' : 'bg-amber-500'
          }`}
          style={{ width: `${brandPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-chart-2" /> Brand
          <span className="mx-2">|</span>
          <span className="w-2 h-0.5 bg-muted-foreground/50" /> Market Avg
        </span>
        <span>{maxScore.toFixed(0)}</span>
      </div>
    </div>
  );
}
