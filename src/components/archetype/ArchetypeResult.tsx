import { Brand, getQuadrant, QUADRANT_CONFIG } from '@/types/brand';
import { TrendingUp, Activity, Flame, Target } from 'lucide-react';

interface ArchetypeResultProps {
  brand: Brand;
  medianVolatility: number;
  medianInflation: number;
}

export function ArchetypeResult({ brand, medianVolatility, medianInflation }: ArchetypeResultProps) {
  const quadrant = getQuadrant(
    brand.Volatility,
    brand.Inflation_Performance,
    medianVolatility,
    medianInflation
  );
  const config = QUADRANT_CONFIG[quadrant];

  const stability = 100 - brand.Volatility;

  return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        {/* Archetype Header */}
        <div 
          className="p-8 text-center"
          style={{ backgroundColor: `${config.bgColor}` }}
        >
          <span className="text-6xl mb-4 block">{config.emoji}</span>
          <h2 
            className="text-3xl font-semibold mb-2"
            style={{ color: config.color }}
          >
            {config.name}
          </h2>
          <p className="text-lg text-foreground/80">{brand.Brand}</p>
          <p className="text-sm text-muted-foreground">{brand.Country} • {brand.Industry}</p>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-border">
          <p className="text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            icon={<Target className="h-4 w-4" />}
            label="SBI Score"
            value={brand.Current_Score.toFixed(1)}
            sublabel="Current"
          />
          <MetricCard 
            icon={<Activity className="h-4 w-4" />}
            label="Stability"
            value={`${stability.toFixed(0)}%`}
            sublabel={stability > 50 ? "Stable" : "Volatile"}
          />
          <MetricCard 
            icon={<TrendingUp className="h-4 w-4" />}
            label="Trend"
            value={brand.Trend_Slope > 0 ? "↑" : brand.Trend_Slope < 0 ? "↓" : "→"}
            sublabel={brand.Trend_Slope > 0 ? "Growing" : brand.Trend_Slope < 0 ? "Declining" : "Stable"}
          />
          <MetricCard 
            icon={<Flame className="h-4 w-4" />}
            label="Inflation"
            value={brand.Inflation_Performance !== null ? `${brand.Inflation_Performance.toFixed(1)}%` : "N/A"}
            sublabel="Performance"
          />
        </div>

        {/* Strategic Recommendation */}
        <div className="p-6 bg-muted/30 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">Strategic Insight</h3>
          <p className="text-sm text-muted-foreground">
            {config.recommendation}
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  sublabel 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  sublabel: string;
}) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/30">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  );
}
