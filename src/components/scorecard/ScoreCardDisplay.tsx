import { Building2, MapPin, Factory, X, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUADRANT_CONFIG } from '@/types/brand';
import { BrandScoreCardData } from '@/hooks/useBrandScoreCard';
import { ScoreGauge } from './ScoreGauge';
import { RankingBadges } from './RankingBadges';
import { MetricsGrid } from './MetricsGrid';
import { ComparisonBar } from './ComparisonBar';
import { TrendSparkline } from './TrendSparkline';
import { StrategicSummary } from './StrategicSummary';

interface ScoreCardDisplayProps {
  data: BrandScoreCardData;
  onClose: () => void;
}

export function ScoreCardDisplay({ data, onClose }: ScoreCardDisplayProps) {
  const { brand, ranking, historicalScores, marketAverages, percentileInCountry, quadrant } = data;
  const quadrantConfig = QUADRANT_CONFIG[quadrant];

  // Get the most recent market average
  const latestMarketAvg = marketAverages.length > 0 
    ? marketAverages[marketAverages.length - 1].score 
    : 40;

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden" id="score-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-background shadow-sm">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{brand.Brand}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {brand.Country}
                </span>
                <span className="flex items-center gap-1">
                  <Factory className="h-3.5 w-3.5" />
                  {brand.Industry}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Score and Archetype Row */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreGauge score={brand.Current_Score} />
          
          <div className="flex-1 text-center sm:text-left">
            <Badge 
              className="text-sm px-3 py-1 mb-2"
              style={{ 
                backgroundColor: quadrantConfig.bgColor,
                color: quadrantConfig.color,
              }}
            >
              {quadrantConfig.emoji} {quadrantConfig.name}
            </Badge>
            <p className="text-sm text-muted-foreground max-w-md">
              {quadrantConfig.description}
            </p>
          </div>
        </div>

        {/* Rankings */}
        <RankingBadges
          industryRank={ranking.industryRank}
          countryRank={ranking.countryRank}
          totalInIndustry={ranking.totalInIndustry}
          totalInCountry={ranking.totalInCountry}
          percentile={percentileInCountry}
        />

        {/* Metrics Grid */}
        <MetricsGrid
          trendSlope={brand.Trend_Slope}
          volatility={brand.Volatility}
          inflationPerformance={brand.Inflation_Performance}
          medianVolatility={data.medianVolatility}
        />

        {/* Comparison Bar */}
        <ComparisonBar
          brandScore={brand.Current_Score}
          marketAverage={latestMarketAvg}
        />

        {/* Trend Chart */}
        <TrendSparkline
          historicalScores={historicalScores}
          marketAverages={marketAverages}
        />

        {/* Strategic Summary */}
        <StrategicSummary
          quadrant={quadrant}
          brandName={brand.Brand}
          trendSlope={brand.Trend_Slope}
          percentile={percentileInCountry}
          inflationPerformance={brand.Inflation_Performance}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="flex-1" variant="default">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button className="flex-1" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/30 px-6 py-3 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          Data from Sustainable Brand Index™ • Updated 2025
        </p>
      </div>
    </div>
  );
}
