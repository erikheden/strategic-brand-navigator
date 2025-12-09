import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QUADRANT_CONFIG, QuadrantType } from '@/types/brand';

export function MethodologyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Info className="h-4 w-4" />
          Methodology
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">SBI Strategic Brand Radar Framework</DialogTitle>
          <DialogDescription>
            A comprehensive methodology for analyzing brand resilience and growth potential
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overview */}
          <section>
            <h3 className="font-semibold text-foreground mb-2">Overview</h3>
            <p className="text-sm text-muted-foreground">
              The SBI Strategic Brand Radar is a proprietary framework that positions brands across 
              two critical dimensions: operational stability and growth performance during inflationary 
              periods. This analysis helps identify strategic opportunities and risks for brand portfolios.
            </p>
          </section>

          {/* Metrics */}
          <section>
            <h3 className="font-semibold text-foreground mb-3">Key Metrics</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground text-sm">Current Score</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The brand's overall performance index on a 0-100 scale, calculated from multiple 
                  brand health indicators including awareness, consideration, and loyalty metrics.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground text-sm">Volatility</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Measures the standard deviation of brand performance over time. Lower volatility 
                  indicates more stable, predictable brand performance. Used as the X-axis (inverted 
                  to show stability).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground text-sm">Trend Slope</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The directional momentum of brand performance over the analysis period. Positive 
                  values indicate upward trends, negative values indicate declining performance.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground text-sm">Inflation Performance</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Measures how well the brand maintained or grew its position during inflationary 
                  periods compared to baseline. Positive values indicate resilience; negative values 
                  indicate vulnerability to economic pressures. Used as the Y-axis.
                </p>
              </div>
            </div>
          </section>

          {/* Quadrant Calculation */}
          <section>
            <h3 className="font-semibold text-foreground mb-3">Quadrant Calculation</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Brands are positioned using median splits on both axes:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">X-Axis (Stability):</span>
                Brands with volatility below the median are placed on the right (high stability); 
                above median on the left (low stability).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">Y-Axis (Growth):</span>
                Brands with inflation performance above the median are placed in the top half 
                (high growth); below median in the bottom half (low growth).
              </li>
            </ul>
          </section>

          {/* Quadrants */}
          <section>
            <h3 className="font-semibold text-foreground mb-3">Strategic Quadrants</h3>
            <div className="grid gap-3">
              {(Object.entries(QUADRANT_CONFIG) as [QuadrantType, typeof QUADRANT_CONFIG[QuadrantType]][]).map(([key, config]) => (
                <div 
                  key={key}
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: config.bgColor,
                    borderColor: config.color,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{config.emoji}</span>
                    <h4 className="font-medium" style={{ color: config.color }}>
                      {config.name}
                    </h4>
                  </div>
                  <p className="text-sm" style={{ color: config.color }}>
                    {config.description}
                  </p>
                  <p className="text-xs mt-2 opacity-80" style={{ color: config.color }}>
                    <strong>Recommendation:</strong> {config.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Data Sources */}
          <section>
            <h3 className="font-semibold text-foreground mb-2">Data & Methodology Notes</h3>
            <p className="text-sm text-muted-foreground">
              Brand data is sourced from the Global Brand Resilience Index dataset, incorporating 
              multi-year performance tracking across global markets. Median thresholds are calculated 
              dynamically from the current dataset to ensure relative positioning accuracy.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}