import { useMemo, useCallback } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label,
} from 'recharts';
import { Brand, getQuadrant, QUADRANT_CONFIG, QuadrantType } from '@/types/brand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar } from 'lucide-react';

interface BrandRadarChartProps {
  brands: Brand[];
  searchQuery: string;
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand | null) => void;
  medianVolatility: number;
  medianInflation: number;
}

interface ChartDataPoint {
  brand: Brand;
  x: number; // Inverted volatility (stability)
  y: number;
  quadrant: QuadrantType;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    const { brand, quadrant } = data;
    const config = QUADRANT_CONFIG[quadrant];

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs">
        <p className="font-semibold text-foreground">{brand.Brand}</p>
        <p className="text-sm text-muted-foreground">{brand.Country}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="text-muted-foreground">Score:</span> <span className="font-medium">{brand.Current_Score.toFixed(1)}</span></p>
          <p><span className="text-muted-foreground">Volatility:</span> <span className="font-medium">{brand.Volatility.toFixed(2)}</span></p>
          <p><span className="text-muted-foreground">Inflation Perf:</span> <span className="font-medium">{brand.Inflation_Performance?.toFixed(2) ?? 'N/A'}</span></p>
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

export function BrandRadarChart({
  brands,
  searchQuery,
  selectedBrand,
  onSelectBrand,
  medianVolatility,
  medianInflation,
}: BrandRadarChartProps) {
  const chartData = useMemo(() => {
    return brands
      .filter(b => b.Inflation_Performance !== null)
      .filter(b => 
        searchQuery === '' || 
        b.Brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.Country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(brand => ({
        brand,
        x: -brand.Volatility, // Invert for stability axis
        y: brand.Inflation_Performance as number,
        quadrant: getQuadrant(brand.Volatility, brand.Inflation_Performance, medianVolatility, medianInflation),
      }));
  }, [brands, searchQuery, medianVolatility, medianInflation]);

  const { xDomain, yDomain } = useMemo(() => {
    if (chartData.length === 0) return { xDomain: [-50, 0] as [number, number], yDomain: [-20, 40] as [number, number] };
    
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

  const getPointColor = useCallback((quadrant: QuadrantType) => {
    return QUADRANT_CONFIG[quadrant].color;
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
          <Radar className="h-5 w-5 text-primary" />
          SBI Strategic Brand Radar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--chart-grid))" 
                opacity={0.5}
              />
              
              {/* X Axis - Inverted Volatility (Stability) */}
              <XAxis
                type="number"
                dataKey="x"
                domain={xDomain}
                tickFormatter={(value) => Math.abs(value).toFixed(0)}
                stroke="hsl(var(--chart-axis))"
                fontSize={12}
                tickLine={false}
              >
                <Label
                  value="← Low Stability          High Stability →"
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

              {/* Y Axis - Inflation Performance (Growth Velocity) */}
              <YAxis
                type="number"
                dataKey="y"
                domain={yDomain}
                stroke="hsl(var(--chart-axis))"
                fontSize={12}
                tickLine={false}
              >
                <Label
                  value="Growth Velocity"
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

              {/* Quadrant dividers */}
              <ReferenceLine 
                x={-medianVolatility} 
                stroke="hsl(var(--border))" 
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <ReferenceLine 
                y={medianInflation} 
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
                      fill={getPointColor(entry.quadrant)}
                      fillOpacity={isSelected ? 1 : 0.7}
                      stroke={isSelected ? 'hsl(var(--foreground))' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                      r={isSelected ? 8 : 5}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(QUADRANT_CONFIG) as [QuadrantType, typeof QUADRANT_CONFIG[QuadrantType]][]).map(([key, config]) => (
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
