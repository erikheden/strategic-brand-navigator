import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Crown,
  Users,
  BarChart3
} from 'lucide-react';
import { HistoricalScore, AwarenessAttitude, CompetitorRanking } from '@/hooks/useBrandIntelligence';

interface SwotPanelProps {
  brandName: string;
  currentData: {
    score: number;
    volatility: number;
    trendSlope: number;
    inflationPerformance: number | null;
    industry: string;
  } | null;
  historicalScores: HistoricalScore[];
  awarenessAttitude: AwarenessAttitude[];
  competitors: CompetitorRanking[];
  insights: {
    trajectory: 'rising' | 'declining' | 'stable';
    trajectoryChange: number;
    peakYear: HistoricalScore | null;
    lowYear: HistoricalScore | null;
    volatilityLevel: 'low' | 'medium' | 'high';
  };
}

interface SwotItem {
  text: string;
  severity: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  dataPoint?: string;
}

export function SwotPanel({ 
  brandName, 
  currentData, 
  historicalScores, 
  awarenessAttitude, 
  competitors,
  insights 
}: SwotPanelProps) {
  const swotAnalysis = useMemo(() => {
    const strengths: SwotItem[] = [];
    const weaknesses: SwotItem[] = [];
    const opportunities: SwotItem[] = [];
    const threats: SwotItem[] = [];

    if (!currentData) {
      return { strengths, weaknesses, opportunities, threats };
    }

    // Find brand's position in competitors
    const brandRank = competitors.find(c => c.brand.toLowerCase() === brandName.toLowerCase());
    const totalCompetitors = competitors.length;

    // === STRENGTHS ===
    
    // High score
    if (currentData.score > 50) {
      strengths.push({
        text: 'Above-average sustainability perception',
        severity: currentData.score > 60 ? 'high' : 'medium',
        icon: <Crown className="h-4 w-4" />,
        dataPoint: `Score: ${currentData.score.toFixed(1)}`
      });
    }

    // Low volatility
    if (insights.volatilityLevel === 'low') {
      strengths.push({
        text: 'Consistent brand perception over time',
        severity: 'high',
        icon: <Shield className="h-4 w-4" />,
        dataPoint: `Volatility: ${currentData.volatility.toFixed(2)}`
      });
    }

    // Positive trajectory
    if (insights.trajectory === 'rising') {
      strengths.push({
        text: 'Strong upward momentum in recent years',
        severity: 'high',
        icon: <TrendingUp className="h-4 w-4" />,
        dataPoint: `+${insights.trajectoryChange.toFixed(1)} pts (3yr avg)`
      });
    }

    // Top industry position
    if (brandRank && brandRank.rankingPosition <= 3) {
      strengths.push({
        text: `Industry leader - #${brandRank.rankingPosition} in ${currentData.industry}`,
        severity: 'high',
        icon: <Crown className="h-4 w-4" />,
        dataPoint: `Top ${Math.round((brandRank.rankingPosition / totalCompetitors) * 100)}%`
      });
    }

    // Inflation outperformance
    if (currentData.inflationPerformance && currentData.inflationPerformance > 3) {
      strengths.push({
        text: 'Resilient during economic uncertainty',
        severity: currentData.inflationPerformance > 5 ? 'high' : 'medium',
        icon: <Zap className="h-4 w-4" />,
        dataPoint: `+${currentData.inflationPerformance.toFixed(1)} inflation perf.`
      });
    }

    // === WEAKNESSES ===

    // Low score
    if (currentData.score < 40) {
      weaknesses.push({
        text: 'Below-average sustainability perception',
        severity: currentData.score < 30 ? 'high' : 'medium',
        icon: <BarChart3 className="h-4 w-4" />,
        dataPoint: `Score: ${currentData.score.toFixed(1)}`
      });
    }

    // High volatility
    if (insights.volatilityLevel === 'high') {
      weaknesses.push({
        text: 'Inconsistent brand perception - score fluctuates significantly',
        severity: 'high',
        icon: <AlertTriangle className="h-4 w-4" />,
        dataPoint: `Volatility: ${currentData.volatility.toFixed(2)}`
      });
    }

    // Declining trajectory
    if (insights.trajectory === 'declining') {
      weaknesses.push({
        text: 'Downward trend in sustainability perception',
        severity: 'high',
        icon: <TrendingDown className="h-4 w-4" />,
        dataPoint: `${insights.trajectoryChange.toFixed(1)} pts (3yr avg)`
      });
    }

    // Poor industry position
    if (brandRank && brandRank.rankingPosition > totalCompetitors / 2) {
      weaknesses.push({
        text: `Below median in industry ranking (#${brandRank.rankingPosition}/${totalCompetitors})`,
        severity: brandRank.rankingPosition > (totalCompetitors * 0.75) ? 'high' : 'medium',
        icon: <Users className="h-4 w-4" />,
        dataPoint: `Bottom ${Math.round(((totalCompetitors - brandRank.rankingPosition + 1) / totalCompetitors) * 100)}%`
      });
    }

    // Negative inflation performance
    if (currentData.inflationPerformance && currentData.inflationPerformance < -3) {
      weaknesses.push({
        text: 'Struggling during economic uncertainty',
        severity: currentData.inflationPerformance < -5 ? 'high' : 'medium',
        icon: <Zap className="h-4 w-4" />,
        dataPoint: `${currentData.inflationPerformance.toFixed(1)} inflation perf.`
      });
    }

    // Awareness-attitude gap
    if (awarenessAttitude.length > 0) {
      const latest = awarenessAttitude[awarenessAttitude.length - 1];
      const gap = latest.awareness - latest.attitude;
      if (gap > 15) {
        weaknesses.push({
          text: 'High awareness but lower attitude - perception gap exists',
          severity: gap > 25 ? 'high' : 'medium',
          icon: <Target className="h-4 w-4" />,
          dataPoint: `Gap: ${gap.toFixed(0)} pts`
        });
      }
    }

    // === OPPORTUNITIES ===

    // Rising trajectory - accelerate
    if (insights.trajectory === 'rising') {
      opportunities.push({
        text: 'Capitalize on momentum with increased sustainability communications',
        severity: 'high',
        icon: <TrendingUp className="h-4 w-4" />
      });
    }

    // Stable performer - expand
    if (insights.volatilityLevel === 'low' && currentData.score > 45) {
      opportunities.push({
        text: 'Stable foundation supports expansion into new sustainability initiatives',
        severity: 'medium',
        icon: <Shield className="h-4 w-4" />
      });
    }

    // Close to next rank
    if (brandRank && brandRank.rankingPosition > 1) {
      const nextCompetitor = competitors[competitors.findIndex(c => c.brand === brandName) - 1];
      if (nextCompetitor) {
        opportunities.push({
          text: `Close gap to industry leader position`,
          severity: brandRank.rankingPosition <= 5 ? 'high' : 'medium',
          icon: <Crown className="h-4 w-4" />,
          dataPoint: `Currently #${brandRank.rankingPosition}`
        });
      }
    }

    // Positive trend slope
    if (currentData.trendSlope > 1) {
      opportunities.push({
        text: 'Leverage positive momentum in sales conversations',
        severity: 'medium',
        icon: <Lightbulb className="h-4 w-4" />,
        dataPoint: `Trend: +${currentData.trendSlope.toFixed(2)}/yr`
      });
    }

    // === THREATS ===

    // Declining trajectory
    if (insights.trajectory === 'declining') {
      threats.push({
        text: 'Continued decline may impact brand value and market position',
        severity: 'high',
        icon: <TrendingDown className="h-4 w-4" />
      });
    }

    // High volatility
    if (insights.volatilityLevel === 'high') {
      threats.push({
        text: 'Unpredictable perception makes long-term planning difficult',
        severity: 'medium',
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    // Strong competitors
    if (brandRank && brandRank.rankingPosition > 5 && totalCompetitors > 10) {
      threats.push({
        text: 'Multiple stronger competitors in industry',
        severity: totalCompetitors - brandRank.rankingPosition < 5 ? 'high' : 'medium',
        icon: <Users className="h-4 w-4" />,
        dataPoint: `${brandRank.rankingPosition - 1} brands ahead`
      });
    }

    // Negative inflation performance
    if (currentData.inflationPerformance && currentData.inflationPerformance < 0) {
      threats.push({
        text: 'Economic pressures may further impact brand perception',
        severity: currentData.inflationPerformance < -5 ? 'high' : 'medium',
        icon: <Zap className="h-4 w-4" />
      });
    }

    return { strengths, weaknesses, opportunities, threats };
  }, [brandName, currentData, historicalScores, awarenessAttitude, competitors, insights]);

  const severityColors = {
    high: 'bg-primary text-primary-foreground',
    medium: 'bg-muted text-muted-foreground',
    low: 'bg-secondary text-secondary-foreground'
  };

  const SwotCard = ({ 
    title, 
    items, 
    bgColor, 
    borderColor, 
    iconColor,
    icon: Icon
  }: { 
    title: string; 
    items: SwotItem[]; 
    bgColor: string;
    borderColor: string;
    iconColor: string;
    icon: React.ElementType;
  }) => (
    <Card className={`${bgColor} ${borderColor} border`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${iconColor}`}>
          <Icon className="h-4 w-4" />
          {title}
          <Badge variant="outline" className="ml-auto text-xs">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No significant factors identified</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <div className={`p-1 rounded ${severityColors[item.severity]} shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground leading-snug">{item.text}</p>
                {item.dataPoint && (
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{item.dataPoint}</p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Strategic SWOT Analysis
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            High Impact
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            Medium
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SwotCard
          title="Strengths"
          items={swotAnalysis.strengths}
          bgColor="bg-[hsl(var(--fortress-bg))]"
          borderColor="border-[hsl(var(--fortress))/20]"
          iconColor="text-[hsl(var(--fortress))]"
          icon={Shield}
        />
        <SwotCard
          title="Weaknesses"
          items={swotAnalysis.weaknesses}
          bgColor="bg-[hsl(var(--danger-bg))]"
          borderColor="border-[hsl(var(--danger))/20]"
          iconColor="text-[hsl(var(--danger))]"
          icon={AlertTriangle}
        />
        <SwotCard
          title="Opportunities"
          items={swotAnalysis.opportunities}
          bgColor="bg-[hsl(var(--challenger-bg))]"
          borderColor="border-[hsl(var(--challenger))/20]"
          iconColor="text-[hsl(var(--challenger))]"
          icon={Lightbulb}
        />
        <SwotCard
          title="Threats"
          items={swotAnalysis.threats}
          bgColor="bg-[hsl(var(--sleeper-bg))]"
          borderColor="border-[hsl(var(--sleeper))/20]"
          iconColor="text-[hsl(var(--sleeper))]"
          icon={AlertTriangle}
        />
      </div>
    </div>
  );
}
