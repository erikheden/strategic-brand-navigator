import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles, Calendar, Activity } from 'lucide-react';
import { HistoricalScore } from '@/hooks/useBrandIntelligence';

interface InsightsPanelProps {
  insights: {
    trajectory: 'rising' | 'declining' | 'stable';
    trajectoryChange: number;
    peakYear: HistoricalScore | null;
    lowYear: HistoricalScore | null;
    volatilityLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    opportunities: string[];
  };
  brandName: string;
}

export function InsightsPanel({ insights, brandName }: InsightsPanelProps) {
  const trajectoryConfig = {
    rising: {
      icon: TrendingUp,
      label: 'Rising',
      color: 'text-[hsl(var(--fortress))]',
      bgColor: 'bg-[hsl(var(--fortress-bg))]',
      borderColor: 'border-[hsl(var(--fortress))/20]',
    },
    declining: {
      icon: TrendingDown,
      label: 'Declining',
      color: 'text-[hsl(var(--danger))]',
      bgColor: 'bg-[hsl(var(--danger-bg))]',
      borderColor: 'border-[hsl(var(--danger))/20]',
    },
    stable: {
      icon: Minus,
      label: 'Stable',
      color: 'text-[hsl(var(--sleeper))]',
      bgColor: 'bg-[hsl(var(--sleeper-bg))]',
      borderColor: 'border-[hsl(var(--sleeper))/20]',
    },
  };

  const volatilityConfig = {
    low: { label: 'Low', color: 'text-[hsl(var(--fortress))]' },
    medium: { label: 'Medium', color: 'text-[hsl(var(--sleeper))]' },
    high: { label: 'High', color: 'text-[hsl(var(--danger))]' },
  };

  const config = trajectoryConfig[insights.trajectory];
  const volatility = volatilityConfig[insights.volatilityLevel];
  const TrajectoryIcon = config.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Trajectory Card */}
      <Card className={`${config.bgColor} ${config.borderColor} border`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            3-Year Trajectory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.bgColor}`}>
              <TrajectoryIcon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
              <p className="text-sm text-muted-foreground">
                {insights.trajectoryChange > 0 ? '+' : ''}
                {insights.trajectoryChange.toFixed(1)} pts avg change
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak & Low Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Historical Extremes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.peakYear && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Peak:</span>
                <span className="font-semibold text-[hsl(var(--fortress))]">
                  {insights.peakYear.year} ({insights.peakYear.score.toFixed(1)})
                </span>
              </div>
            )}
            {insights.lowYear && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low:</span>
                <span className="font-semibold text-[hsl(var(--danger))]">
                  {insights.lowYear.year} ({insights.lowYear.score.toFixed(1)})
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Volatility Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Score Volatility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-xl font-bold ${volatility.color}`}>{volatility.label}</p>
          <p className="text-sm text-muted-foreground">
            {insights.volatilityLevel === 'low' && 'Consistent brand perception'}
            {insights.volatilityLevel === 'medium' && 'Some fluctuation over time'}
            {insights.volatilityLevel === 'high' && 'Significant score swings'}
          </p>
        </CardContent>
      </Card>

      {/* Risks */}
      {insights.riskFactors.length > 0 && (
        <Card className="md:col-span-1 border-[hsl(var(--danger))/20] bg-[hsl(var(--danger-bg))]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--danger))] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {insights.riskFactors.map((risk, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-[hsl(var(--danger))]">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      {insights.opportunities.length > 0 && (
        <Card className="md:col-span-2 border-[hsl(var(--fortress))/20] bg-[hsl(var(--fortress-bg))]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--fortress))] flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {insights.opportunities.map((opp, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-[hsl(var(--fortress))]">•</span>
                  {opp}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
