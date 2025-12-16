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
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Tag, Sparkles, ZoomIn, RotateCcw, Search, X, Eye } from 'lucide-react';
import sbIndexLogo from '@/assets/sb-index-logo.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// Colors for highlighted brands
const BRAND_COLORS = [
  'hsl(221, 83%, 53%)', // Blue
  'hsl(262, 83%, 58%)', // Purple
  'hsl(330, 81%, 60%)', // Pink
  'hsl(173, 80%, 40%)', // Teal
  'hsl(43, 96%, 56%)',  // Yellow
  'hsl(280, 87%, 65%)', // Violet
  'hsl(190, 95%, 39%)', // Cyan
  'hsl(350, 89%, 60%)', // Rose
];

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
  const [hideOutliers, setHideOutliers] = useState(false);
  const [focusedBrands, setFocusedBrands] = useState<string[]>([]);
  const [showGhostLayer, setShowGhostLayer] = useState(true);
  const [brandSearchOpen, setBrandSearchOpen] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

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

  // Brand selection handlers
  const handleAddBrand = useCallback((brandKey: string) => {
    if (focusedBrands.length < 8 && !focusedBrands.includes(brandKey)) {
      setFocusedBrands(prev => [...prev, brandKey]);
    }
    setBrandSearchOpen(false);
  }, [focusedBrands]);

  const handleRemoveBrand = useCallback((brandKey: string) => {
    setFocusedBrands(prev => prev.filter(b => b !== brandKey));
  }, []);

  const handleClearAllBrands = useCallback(() => {
    setFocusedBrands([]);
  }, []);

  // Get available options for each axis (exclude the other's selection)
  const xOptions = Object.keys(PARAMETER_CONFIG).filter(k => k !== yParam) as ParameterKey[];
  const yOptions = Object.keys(PARAMETER_CONFIG).filter(k => k !== xParam) as ParameterKey[];

  // Available brands for selection (all brands, not filtered by country/industry)
  const availableBrandsForSelection = useMemo(() => {
    return brands
      .filter(b => b[xParam] !== null && b[yParam] !== null)
      .map(b => ({
        key: `${b.Brand}-${b.Country}`,
        brand: b.Brand,
        country: b.Country,
        industry: b.Industry,
      }))
      .sort((a, b) => a.brand.localeCompare(b.brand));
  }, [brands, xParam, yParam]);

  // Filter brands for dropdown based on search query
  const filteredBrandsForDropdown = useMemo(() => {
    const query = brandSearchQuery.toLowerCase().trim();
    const available = availableBrandsForSelection.filter(b => !focusedBrands.includes(b.key));
    
    if (!query) {
      return available.slice(0, 100); // Show first 100 when no search
    }
    
    return available
      .filter(b => 
        b.brand.toLowerCase().includes(query) || 
        b.country.toLowerCase().includes(query) ||
        b.industry.toLowerCase().includes(query)
      )
      .slice(0, 100); // Show up to 100 matching results
  }, [availableBrandsForSelection, focusedBrands, brandSearchQuery]);

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

  // Filter outliers using IQR method
  const dataWithoutOutliers = useMemo(() => {
    if (!hideOutliers || chartData.length < 4) return chartData;

    const xValues = chartData.map(d => d.x).sort((a, b) => a - b);
    const yValues = chartData.map(d => d.y).sort((a, b) => a - b);

    const q1X = xValues[Math.floor(xValues.length * 0.25)];
    const q3X = xValues[Math.floor(xValues.length * 0.75)];
    const iqrX = q3X - q1X;
    const lowerX = q1X - 1.5 * iqrX;
    const upperX = q3X + 1.5 * iqrX;

    const q1Y = yValues[Math.floor(yValues.length * 0.25)];
    const q3Y = yValues[Math.floor(yValues.length * 0.75)];
    const iqrY = q3Y - q1Y;
    const lowerY = q1Y - 1.5 * iqrY;
    const upperY = q3Y + 1.5 * iqrY;

    return chartData.filter(d => 
      d.x >= lowerX && d.x <= upperX && 
      d.y >= lowerY && d.y <= upperY
    );
  }, [chartData, hideOutliers]);

  // Filter data by zoomed quadrant
  const displayData = useMemo(() => {
    if (!zoomedQuadrant) return dataWithoutOutliers;
    return dataWithoutOutliers.filter(d => d.quadrant === zoomedQuadrant);
  }, [dataWithoutOutliers, zoomedQuadrant]);

  // Split data into ghost layer and focused layer
  const { ghostData, focusedData } = useMemo(() => {
    if (focusedBrands.length === 0) {
      return { ghostData: [], focusedData: displayData };
    }
    
    const focused = displayData.filter(d => {
      const key = `${d.brand.Brand}-${d.brand.Country}`;
      return focusedBrands.includes(key);
    });
    
    const ghost = displayData.filter(d => {
      const key = `${d.brand.Brand}-${d.brand.Country}`;
      return !focusedBrands.includes(key);
    });
    
    return { ghostData: ghost, focusedData: focused };
  }, [displayData, focusedBrands]);

  // Get color for a focused brand
  const getBrandColor = useCallback((brandKey: string) => {
    const index = focusedBrands.indexOf(brandKey);
    return BRAND_COLORS[index % BRAND_COLORS.length];
  }, [focusedBrands]);

  // Calculate domain based on ALL displayed data (for market context)
  // Always use full data for domains to maintain market position
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
                <span className="text-sm text-muted-foreground">Hide Outliers</span>
                <Switch checked={hideOutliers} onCheckedChange={setHideOutliers} />
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

          {/* Brand Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground mr-1">Focus brands:</span>
            
            <Popover open={brandSearchOpen} onOpenChange={(open) => {
              setBrandSearchOpen(open);
              if (!open) setBrandSearchQuery('');
            }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  disabled={focusedBrands.length >= 8}
                >
                  <Search className="h-3 w-3" />
                  Add brand ({focusedBrands.length}/8)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search brands by name, country, or industry..." 
                    value={brandSearchQuery}
                    onValueChange={setBrandSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {brandSearchQuery ? 'No brands found matching your search.' : 'Type to search brands...'}
                    </CommandEmpty>
                    <CommandGroup heading={`${filteredBrandsForDropdown.length} brands${brandSearchQuery ? ' found' : ''}`}>
                      {filteredBrandsForDropdown.map(b => (
                          <CommandItem
                            key={b.key}
                            value={b.key}
                            onSelect={() => {
                              handleAddBrand(b.key);
                              setBrandSearchQuery('');
                            }}
                          >
                            <span className="font-medium">{b.brand}</span>
                            <span className="text-muted-foreground ml-2 text-xs">
                              {b.country} • {b.industry}
                            </span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected brand chips */}
            {focusedBrands.map((brandKey, index) => {
              const brandInfo = availableBrandsForSelection.find(b => b.key === brandKey);
              return (
                <Badge
                  key={brandKey}
                  variant="secondary"
                  className="h-7 gap-1 pl-2 pr-1"
                  style={{ 
                    backgroundColor: `${BRAND_COLORS[index % BRAND_COLORS.length]}20`,
                    borderColor: BRAND_COLORS[index % BRAND_COLORS.length],
                    color: BRAND_COLORS[index % BRAND_COLORS.length],
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS[index % BRAND_COLORS.length] }} />
                  {brandInfo?.brand || brandKey.split('-')[0]}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveBrand(brandKey)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}

            {focusedBrands.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleClearAllBrands}
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear all
                </Button>
                <div className="flex items-center gap-2 ml-2 border-l pl-2">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Ghost</span>
                  <Switch checked={showGhostLayer} onCheckedChange={setShowGhostLayer} />
                </div>
              </>
            )}
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

              {/* Ghost Layer - all other brands (rendered first, behind) */}
              {focusedBrands.length > 0 && showGhostLayer && ghostData.length > 0 && (
                <Scatter
                  data={ghostData}
                  onClick={handleClick}
                  cursor="pointer"
                  shape="circle"
                >
                  {ghostData.map((entry, index) => (
                    <Cell
                      key={`ghost-${index}`}
                      fill="hsl(var(--muted-foreground))"
                      fillOpacity={0.15}
                      r={3}
                    />
                  ))}
                </Scatter>
              )}

              {/* Main Layer - focused brands (or all brands if no selection) */}
              <Scatter
                data={focusedData}
                onClick={handleClick}
                cursor="pointer"
                shape="circle"
              >
                {focusedData.map((entry, index) => {
                  const brandKey = `${entry.brand.Brand}-${entry.brand.Country}`;
                  const isSelected = selectedBrand?.Brand === entry.brand.Brand;
                  const isFocused = focusedBrands.includes(brandKey);
                  const color = isFocused && focusedBrands.length > 0 
                    ? getBrandColor(brandKey) 
                    : entry.quadrantColor;
                  
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      fillOpacity={isSelected ? 1 : (focusedBrands.length > 0 ? 0.9 : 0.7)}
                      stroke={isSelected ? 'hsl(var(--foreground))' : (focusedBrands.length > 0 ? color : 'none')}
                      strokeWidth={isSelected ? 3 : (focusedBrands.length > 0 ? 2 : 0)}
                    />
                  );
                })}
                {(showLabels || focusedBrands.length > 0) && (
                  <LabelList
                    dataKey="brand.Brand"
                    position="top"
                    offset={10}
                    style={{
                      fontSize: focusedBrands.length > 0 ? 11 : 10,
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 400,
                      textShadow: '0 0 3px hsl(var(--background)), 0 0 6px hsl(var(--background))',
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
            {focusedBrands.length > 0 ? (
              <>
                <span className="font-semibold text-foreground">{focusedData.length}</span> focused brands
                {showGhostLayer && <span className="ml-1">(+ {ghostData.length} in background)</span>}
              </>
            ) : (
              <>
                Showing <span className="font-semibold text-foreground">{displayData.length}</span> of{' '}
                <span className="font-semibold text-foreground">{chartData.length}</span> brands
              </>
            )}
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
