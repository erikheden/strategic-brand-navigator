import { Brand, getQuadrant, QUADRANT_CONFIG, QuadrantType } from '@/types/brand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Lightbulb, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StrategicInsightProps {
  brand: Brand | null;
  medianVolatility: number;
  medianInflation: number;
}

export function StrategicInsight({ brand, medianVolatility, medianInflation }: StrategicInsightProps) {
  if (!brand) {
    return (
      <Card className="shadow-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            Strategic Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a brand from the chart or table to view strategic recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const quadrant = getQuadrant(
    brand.Volatility,
    brand.Inflation_Performance,
    medianVolatility,
    medianInflation
  );
  const config = QUADRANT_CONFIG[quadrant];

  const quadrantStyles: Record<QuadrantType, string> = {
    fortress: 'bg-fortress-bg text-fortress border-fortress/20',
    challenger: 'bg-challenger-bg text-challenger border-challenger/20',
    sleeper: 'bg-sleeper-bg text-sleeper border-sleeper/20',
    danger: 'bg-danger-bg text-danger border-danger/20',
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          Strategic Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-xl">{brand.Brand}</h3>
            <p className="text-sm text-muted-foreground">{brand.Country} • {brand.Industry}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${quadrantStyles[quadrant]}`}>
            {config.emoji} {config.name}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Target className="h-3.5 w-3.5" />
              Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-xs">The brand's current overall performance score based on key brand health metrics.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="font-semibold text-lg">{brand.Current_Score.toFixed(1)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Volatility
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-xs">Measures how much the brand's score fluctuates over time. Lower volatility indicates more stable performance.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="font-semibold text-lg">{brand.Volatility.toFixed(1)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Inflation Perf.
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-xs">Indicates how well the brand maintains or grows value during inflationary periods. Higher values suggest stronger pricing power.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="font-semibold text-lg">
              {brand.Inflation_Performance !== null ? brand.Inflation_Performance.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
          <p className="text-sm leading-relaxed">
            <span className="font-medium">Recommendation:</span> {config.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
