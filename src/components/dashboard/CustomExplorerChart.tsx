import { useState, useMemo, useCallback } from 'react';
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
  LabelList,
} from 'recharts';
import { Brand } from '@/types/brand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Tag, Sparkles, ZoomIn, RotateCcw } from 'lucide-react';
import sbIndexLogo from '@/assets/sb-index-logo.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartFilters } from './ChartFilters';

type ParameterKey = 'Current_Score' | 'Volatility' | 'Trend_Slope' | 'Inflation_Performance';
type QuadrantKey = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft' | null;

interface ParameterConfig {
  label: string;
  shortLabel: string;
  invert: boolean;
  format: (value: number) => string;
}

const PARAMETER_CONFIG: Record<ParameterKey, ParameterConfig> = {
  Current_Score: {
    label: 'Brand Score',
    shortLabel: 'Score',
    invert: false,
    format: (v) => v.toFixed(0),
  },
  Volatility: {
    label: 'Stability (Inverted Volatility)',
    shortLabel: 'Stability',
    invert: true,
    format: (v) => Math.abs(v).toFixed(1),
  },
  Trend_Slope: {
    label: 'Momentum (Trend Slope)',
    shortLabel: 'Momentum',
    invert: false,
    format: (v) => v.toFixed(2),
  },
  Inflation_Performance: {
    label: 'Inflation Performance',
    shortLabel: 'Inflation Perf.',
    invert: false,
    format: (v) => v.toFixed(1),
  },
};

interface PresetStory {
  id: string;
  name: string;
  description: string;
  xParam: ParameterKey;
  yParam: ParameterKey;
}

const PRESET_STORIES: PresetStory[] = [
  {
    id: 'inflation-survivors',
    name: 'Inflation Survivors',
    description: 'Brands that maintained performance during inflation',
    xParam: 'Volatility',
    yParam: 'Inflation_Performance',
  },
  {
    id: 'growth-at-what-cost',
    name: 'Growth at What Cost?',
    description: 'High momentum brands vs. their stability',
    xParam: 'Volatility',
    yParam: 'Trend_Slope',
  },
  {
    id: 'steady-climbers',
    name: 'Steady Climbers',
    description: 'Strong brands with positive momentum',
    xParam: 'Current_Score',
    yParam: 'Trend_Slope',
  },
  {
    id: 'resilience-test',
    name: 'Resilience Test',
    description: 'Brand strength vs. inflation resilience',
    xParam: 'Current_Score',
    yParam: 'Inflation_Performance',
  },
];

// Colors for the 4 quadrants based on position relative to medians
const QUADRANT_COLORS = {
  topRight: 'hsl(142, 76%, 36%)',    // Green - best in both
  topLeft: 'hsl(25, 95%, 53%)',      // Orange - good Y, bad X
  bottomRight: 'hsl(220, 14%, 46%)', // Grey - good X, bad Y
  bottomLeft: 'hsl(0, 84%, 60%)',    // Red - bad in both
};

const QUADRANT_LABELS = {
  topRight: { emoji: '👑', name: 'High X, High Y' },
  topLeft: { emoji: '🚀', name: 'Low X, High Y' },
  bottomRight: { emoji: '🐢', name: 'High X, Low Y' },
  bottomLeft: { emoji: '🚩', name: 'Low X, Low Y' },
};

interface CustomExplorerChartProps {
  brands: Brand[];
  searchQuery: string;
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand | null) => void;
}

interface ChartDataPoint {
  brand: Brand;
  x: number;
  y: number;
  z: number;
  quadrantColor: string;
  quadrant: QuadrantKey;
}

export function CustomExplorerChart({
  brands,
  searchQuery,
  selectedBrand,
  onSelectBrand,
}: CustomExplorerChartProps) {
  const [xParam, setXParam] = useState<ParameterKey>('Volatility');
  const [yParam, setYParam] = useState<ParameterKey>('Inflation_Performance');
  const [showLabels, setShowLabels] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>('inflation-survivors');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [zoomedQuadrant, setZoomedQuadrant] = useState<QuadrantKey>(null);

  // Filter brands by country/industry
  const filteredBrands = useMemo(() => {
    let result = brands;
    if (selectedCountry) {
      result = result.filter(b => b.Country === selectedCountry);
    }
    if (selectedIndustry) {
      result = result.filter(b => b.Industry === selectedIndustry);
    }
    return result;
  }, [brands, selectedCountry, selectedIndustry]);

  const handlePresetClick = useCallback((preset: PresetStory) => {
    setXParam(preset.xParam);
    setYParam(preset.yParam);
    setActivePreset(preset.id);
  }, []);

  // Clear active preset when manually changing axes
  const handleXParamChange = useCallback((value: ParameterKey) => {
    setXParam(value);
    setActivePreset(null);
  }, []);

  const handleYParamChange = useCallback((value: ParameterKey) => {
    setYParam(value);
    setActivePreset(null);
  }, []);

  // Get available options for each axis (exclude the other's selection)
  const xOptions = Object.keys(PARAMETER_CONFIG).filter(k => k !== yParam) as ParameterKey[];
  const yOptions = Object.keys(PARAMETER_CONFIG).filter(k => k !== xParam) as ParameterKey[];

  // Calculate medians for the selected parameters
  const { medianX, medianY, scoreRange } = useMemo(() => {
    const validBrands = filteredBrands.filter(b => {
      const xVal = b[xParam];
      const yVal = b[yParam];
      return xVal !== null && yVal !== null;
    });

    const xValues = validBrands.map(b => {
      const val = b[xParam] as number;
      return PARAMETER_CONFIG[xParam].invert ? -val : val;
    }).sort((a, b) => a - b);

    const yValues = validBrands.map(b => {
      const val = b[yParam] as number;
      return PARAMETER_CONFIG[yParam].invert ? -val : val;
    }).sort((a, b) => a - b);

    const scores = filteredBrands.map(b => b.Current_Score);

    return {
      medianX: xValues.length > 0 ? xValues[Math.floor(xValues.length / 2)] : 0,
      medianY: yValues.length > 0 ? yValues[Math.floor(yValues.length / 2)] : 0,
      scoreRange: { min: Math.min(...scores), max: Math.max(...scores) },
    };
  }, [filteredBrands, xParam, yParam]);

  const chartData = useMemo(() => {
    return filteredBrands
      .filter(b => {
        const xVal = b[xParam];
        const yVal = b[yParam];
        return xVal !== null && yVal !== null;
      })
      .filter(b =>
        searchQuery === '' ||
        b.Brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.Country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(brand => {
        const rawX = brand[xParam] as number;
        const rawY = brand[yParam] as number;
        const x = PARAMETER_CONFIG[xParam].invert ? -rawX : rawX;
        const y = PARAMETER_CONFIG[yParam].invert ? -rawY : rawY;

        // Determine quadrant based on position relative to medians
        let quadrant: QuadrantKey;
        let quadrantColor: string;
        if (x >= medianX && y >= medianY) {
          quadrant = 'topRight';
          quadrantColor = QUADRANT_COLORS.topRight;
        } else if (x < medianX && y >= medianY) {
          quadrant = 'topLeft';
          quadrantColor = QUADRANT_COLORS.topLeft;
        } else if (x >= medianX && y < medianY) {
          quadrant = 'bottomRight';
          quadrantColor = QUADRANT_COLORS.bottomRight;
        } else {
          quadrant = 'bottomLeft';
          quadrantColor = QUADRANT_COLORS.bottomLeft;
        }

        return {
          brand,
          x,
          y,
          z: brand.Current_Score,
          quadrantColor,
          quadrant,
        };
      });
  }, [filteredBrands, searchQuery, xParam, yParam, medianX, medianY]);

  // Filter data by zoomed quadrant
  const displayData = useMemo(() => {
    if (!zoomedQuadrant) return chartData;
    return chartData.filter(d => d.quadrant === zoomedQuadrant);
  }, [chartData, zoomedQuadrant]);

  // Calculate domain based on displayed data (for zoom)
  const { xDomain, yDomain } = useMemo(() => {
    if (displayData.length === 0) {
      return {
        xDomain: [-50, 50] as [number, number],
        yDomain: [-20, 40] as [number, number],
      };
    }

    const xValues = displayData.map(d => d.x);
    const yValues = displayData.map(d => d.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xPadding = (xMax - xMin) * 0.1 || 5;
    const yPadding = (yMax - yMin) * 0.1 || 5;

    return {
      xDomain: [xMin - xPadding, xMax + xPadding] as [number, number],
      yDomain: [yMin - yPadding, yMax + yPadding] as [number, number],
    };
  }, [displayData]);

  const handleClick = useCallback((data: any) => {
    if (data && data.payload) {
      const clickedBrand = data.payload.brand as Brand;
      const clickedKey = `${clickedBrand.Brand}-${clickedBrand.Country}`;
      const selectedKey = selectedBrand ? `${selectedBrand.Brand}-${selectedBrand.Country}` : null;
      
      // Toggle selection: deselect if already selected, otherwise select
      if (selectedKey === clickedKey) {
        onSelectBrand(null);
      } else {
        onSelectBrand(clickedBrand);
      }
    }
  }, [onSelectBrand, selectedBrand]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      const { brand } = data;

      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs z-50">
          <p className="font-semibold text-foreground">{brand.Brand}</p>
          <p className="text-sm text-muted-foreground">{brand.Country}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">{PARAMETER_CONFIG[xParam].shortLabel}:</span>{' '}
              <span className="font-medium">{PARAMETER_CONFIG[xParam].format(brand[xParam] as number)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">{PARAMETER_CONFIG[yParam].shortLabel}:</span>{' '}
              <span className="font-medium">{PARAMETER_CONFIG[yParam].format(brand[yParam] as number)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Score:</span>{' '}
              <span className="font-medium">{brand.Current_Score.toFixed(1)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getXAxisLabel = () => {
    const config = PARAMETER_CONFIG[xParam];
    if (config.invert) {
      return `← Low ${config.shortLabel}          High ${config.shortLabel} →`;
    }
    return `← Low ${config.shortLabel}          High ${config.shortLabel} →`;
  };

  const getYAxisLabel = () => {
    return PARAMETER_CONFIG[yParam].label;
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Custom Parameter Explorer
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <ChartFilters
                brands={brands}
                selectedCountry={selectedCountry}
                selectedIndustry={selectedIndustry}
                onCountryChange={setSelectedCountry}
                onIndustryChange={setSelectedIndustry}
              />
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Labels</span>
                <Switch checked={showLabels} onCheckedChange={setShowLabels} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">X-Axis:</span>
                <Select value={xParam} onValueChange={(v) => handleXParamChange(v as ParameterKey)}>
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {xOptions.map(key => (
                      <SelectItem key={key} value={key}>
                        {PARAMETER_CONFIG[key].shortLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Y-Axis:</span>
                <Select value={yParam} onValueChange={(v) => handleYParamChange(v as ParameterKey)}>
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yOptions.map(key => (
                      <SelectItem key={key} value={key}>
                        {PARAMETER_CONFIG[key].shortLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Preset Story Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground mr-1">Quick views:</span>
            {PRESET_STORIES.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="h-7 text-xs"
                title={preset.description}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full relative">
          <img 
            src={sbIndexLogo} 
            alt="Sustainable Brand Index" 
            className="absolute top-2 right-2 h-8 opacity-40 z-10 pointer-events-none"
          />
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                opacity={0.5}
              />

              <XAxis
                type="number"
                dataKey="x"
                domain={xDomain}
                tickFormatter={(value) => PARAMETER_CONFIG[xParam].format(value)}
                stroke="hsl(var(--chart-axis))"
                fontSize={12}
                tickLine={false}
              >
                <Label
                  value={getXAxisLabel()}
                  position="bottom"
                  offset={40}
                  style={{
                    textAnchor: 'middle',
                    fill: 'hsl(var(--foreground))',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />
              </XAxis>

              <YAxis
                type="number"
                dataKey="y"
                domain={yDomain}
                stroke="hsl(var(--chart-axis))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => PARAMETER_CONFIG[yParam].format(value)}
              >
                <Label
                  value={getYAxisLabel()}
                  angle={-90}
                  position="insideLeft"
                  offset={-50}
                  style={{
                    textAnchor: 'middle',
                    fill: 'hsl(var(--foreground))',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />
              </YAxis>

              <ZAxis
                type="number"
                dataKey="z"
                domain={[scoreRange.min, scoreRange.max]}
                range={[40, 400]}
              />

              {/* Quadrant dividers at medians */}
              <ReferenceLine
                x={medianX}
                stroke="hsl(var(--border))"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={medianY}
                stroke="hsl(var(--border))"
                strokeWidth={2}
                strokeDasharray="4 4"
              />

              <Tooltip content={<CustomTooltip />} />

              <Scatter
                data={displayData}
                onClick={handleClick}
                cursor="pointer"
              >
                {displayData.map((entry, index) => {
                  const isSelected = selectedBrand?.Brand === entry.brand.Brand;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.quadrantColor}
                      fillOpacity={isSelected ? 1 : 0.7}
                      stroke={isSelected ? 'hsl(var(--foreground))' : 'none'}
                      strokeWidth={isSelected ? 3 : 0}
                    />
                  );
                })}
                {showLabels && (
                  <LabelList
                    dataKey="brand.Brand"
                    position="top"
                    offset={8}
                    style={{
                      fontSize: 10,
                      fill: 'hsl(var(--foreground))',
                      fontWeight: 500,
                    }}
                  />
                )}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Size Legend */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Size = Brand Score:</span>
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-foreground/40" />
              <span>{scoreRange.min.toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-foreground/50" />
              <span>{((scoreRange.min + scoreRange.max) / 2).toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-foreground/60" />
              <span>{scoreRange.max.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Brand Count & Quadrant Zoom Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{displayData.length}</span> of{' '}
            <span className="font-semibold text-foreground">{chartData.length}</span> brands
            {zoomedQuadrant && (
              <span className="ml-2 text-primary">(zoomed to {QUADRANT_LABELS[zoomedQuadrant].name})</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-1">Zoom:</span>
            {(Object.keys(QUADRANT_COLORS) as Array<keyof typeof QUADRANT_COLORS>).map((quadrant) => (
              <Button
                key={quadrant}
                variant={zoomedQuadrant === quadrant ? "default" : "outline"}
                size="sm"
                onClick={() => setZoomedQuadrant(zoomedQuadrant === quadrant ? null : quadrant)}
                className="h-7 text-xs gap-1"
                style={{
                  borderColor: QUADRANT_COLORS[quadrant],
                  backgroundColor: zoomedQuadrant === quadrant ? QUADRANT_COLORS[quadrant] : 'transparent',
                  color: zoomedQuadrant === quadrant ? 'white' : QUADRANT_COLORS[quadrant],
                }}
              >
                {QUADRANT_LABELS[quadrant].emoji} {QUADRANT_LABELS[quadrant].name}
              </Button>
            ))}
            {zoomedQuadrant && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomedQuadrant(null)}
                className="h-7 text-xs gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
