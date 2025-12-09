import { useMemo, useCallback } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label,
} from 'recharts';
import { Brand } from '@/types/brand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface BrandMomentumChartProps {
  brands: Brand[];
  searchQuery: string;
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand | null) => void;
}

interface ChartDataPoint {
  brand: Brand;
  x: number; // Current_Score
  y: number; // Trend_Slope
  z: number; // Volatility for sizing
  momentum: 'rising-star' | 'steady-leader' | 'fading' | 'struggling';
}

const MOMENTUM_CONFIG = {
  'rising-star': {
    name: 'Rising Star',
    emoji: '🚀',
    color: '#22c55e',
    bgColor: '#22c55e10',
    description: 'Strong performance with positive momentum',
  },
  'steady-leader': {
    name: 'Steady Leader',
    emoji: '👑',
    color: '#3b82f6',
    bgColor: '#3b82f610',
    description: 'Strong performance but slowing momentum',
  },
  'fading': {
    name: 'Fading',
    emoji: '📉',
    color: '#f97316',
    bgColor: '#f9731610',
    description: 'Lower performance but still growing',
  },
  'struggling': {
    name: 'Struggling',
    emoji: '⚠️',
    color: '#ef4444',
    bgColor: '#ef444410',
    description: 'Lower performance with declining momentum',
  },
} as const;

type MomentumType = keyof typeof MOMENTUM_CONFIG;

const getMomentum = (score: number, trendSlope: number, medianScore: number, medianSlope: number): MomentumType => {
  const isHighScore = score >= medianScore;
  const isPositiveTrend = trendSlope >= medianSlope;

  if (isHighScore && isPositiveTrend) return 'rising-star';
  if (isHighScore && !isPositiveTrend) return 'steady-leader';
  if (!isHighScore && isPositiveTrend) return 'fading';
  return 'struggling';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    const { brand, momentum } = data;
    const config = MOMENTUM_CONFIG[momentum];

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs z-50">
        <p className="font-semibold text-foreground">{brand.Brand}</p>
        <p className="text-sm text-muted-foreground">{brand.Country}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="text-muted-foreground">Score:</span> <span className="font-medium">{brand.Current_Score.toFixed(1)}</span></p>
          <p><span className="text-muted-foreground">Trend Slope:</span> <span className="font-medium">{brand.Trend_Slope.toFixed(2)}</span></p>
          <p><span className="text-muted-foreground">Volatility:</span> <span className="font-medium">{brand.Volatility.toFixed(2)}</span></p>
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs font-medium" style={{ color: config.color }}>
            {config.emoji} {config.name}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function BrandMomentumChart({
  brands,
  searchQuery,
  selectedBrand,
  onSelectBrand,
}: BrandMomentumChartProps) {
  const stats = useMemo(() => {
    const scores = brands.map(b => b.Current_Score).sort((a, b) => a - b);
    const slopes = brands.map(b => b.Trend_Slope).sort((a, b) => a - b);
    const volatilities = brands.map(b => b.Volatility);
    
    const medianScore = scores[Math.floor(scores.length / 2)] || 0;
    const medianSlope = slopes[Math.floor(slopes.length / 2)] || 0;
    
    return {
      medianScore,
      medianSlope,
      minVolatility: Math.min(...volatilities),
      maxVolatility: Math.max(...volatilities),
    };
  }, [brands]);

  const chartData = useMemo(() => {
    return brands
      .filter(b => 
        searchQuery === '' || 
        b.Brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.Country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(brand => ({
        brand,
        x: brand.Current_Score,
        y: brand.Trend_Slope,
        z: brand.Volatility,
        momentum: getMomentum(brand.Current_Score, brand.Trend_Slope, stats.medianScore, stats.medianSlope),
      }));
  }, [brands, searchQuery, stats]);

  const domain = useMemo(() => {
    if (chartData.length === 0) return { xDomain: [0, 150] as [number, number], yDomain: [-10, 10] as [number, number] };
    
    const xValues = chartData.map(d => d.x);
    const yValues = chartData.map(d => d.y);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xPadding = (xMax - xMin) * 0.1;
    const yPadding = (yMax - yMin) * 0.1;
    
    return {
      xDomain: [xMin - xPadding, xMax + xPadding] as [number, number],
      yDomain: [yMin - yPadding, yMax + yPadding] as [number, number],
    };
  }, [chartData]);

  const getPointColor = useCallback((momentum: MomentumType) => {
    return MOMENTUM_CONFIG[momentum].color;
  }, []);

  const handleClick = useCallback((data: any) => {
    if (data && data.payload) {
      onSelectBrand(data.payload.brand);
    }
  }, [onSelectBrand]);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 text-primary" />
          Brand Momentum Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 40, right: 40, bottom: 60, left: 60 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--chart-grid))" 
                opacity={0.5}
              />
              
              <XAxis
                type="number"
                dataKey="x"
                domain={domain.xDomain}
                stroke="hsl(var(--chart-axis))"
                fontSize={12}
                tickLine={false}
              >
                <Label
                  value="← Lower Score          Higher Score →"
                  position="bottom"
                  offset={35}
                  style={{ 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--foreground))',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
              </XAxis>

              <YAxis
                type="number"
                dataKey="y"
                domain={domain.yDomain}
                stroke="hsl(var(--chart-axis))"
                fontSize={12}
                tickLine={false}
              >
                <Label
                  value="Trend Slope (Momentum)"
                  angle={-90}
                  position="insideLeft"
                  offset={-45}
                  style={{ 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--foreground))',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
              </YAxis>

              {/* Size based on volatility (inverted - lower volatility = larger dot for stability) */}
              <ZAxis 
                type="number" 
                dataKey="z" 
                domain={[stats.maxVolatility, stats.minVolatility]} 
                range={[40, 300]} 
              />

              {/* Quadrant dividers */}
              <ReferenceLine 
                x={stats.medianScore} 
                stroke="hsl(var(--border))" 
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <ReferenceLine 
                y={stats.medianSlope} 
                stroke="hsl(var(--border))" 
                strokeWidth={2}
                strokeDasharray="4 4"
              />

              <Tooltip content={<CustomTooltip />} />

              <Scatter
                data={chartData}
                onClick={handleClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => {
                  const isSelected = selectedBrand?.Brand === entry.brand.Brand;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={getPointColor(entry.momentum)}
                      fillOpacity={isSelected ? 1 : 0.7}
                      stroke={isSelected ? 'hsl(var(--foreground))' : 'none'}
                      strokeWidth={isSelected ? 3 : 0}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Size Legend */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Size = Stability (inverse volatility):</span>
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-foreground/40" />
              <span>Less stable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-foreground/60" />
              <span>More stable</span>
            </div>
          </div>
        </div>

        {/* Momentum Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(MOMENTUM_CONFIG) as [MomentumType, typeof MOMENTUM_CONFIG[MomentumType]][]).map(([key, config]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{ 
                backgroundColor: config.bgColor,
                borderColor: `${config.color}30`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs font-medium" style={{ color: config.color }}>
                {config.emoji} {config.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}