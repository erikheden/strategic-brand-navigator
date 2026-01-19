import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketDeviationData } from '@/hooks/useMarketDeviationData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import sbIndexLogo from '@/assets/sb-index-logo.png';

// Color palette for brand lines
const BRAND_COLORS = [
  'hsl(var(--primary))',
  'hsl(215, 70%, 50%)',
  'hsl(280, 60%, 55%)',
  'hsl(25, 85%, 55%)',
  'hsl(170, 60%, 45%)',
  'hsl(340, 70%, 55%)',
  'hsl(45, 80%, 50%)',
  'hsl(190, 70%, 45%)',
];

interface MarketDeviationChartProps {
  className?: string;
}

export const MarketDeviationChart = ({ className }: MarketDeviationChartProps) => {
  const { 
    loading, 
    loadingCountry,
    error, 
    countries, 
    fetchBrandScoresForCountry,
    getBrandsForCountry, 
    getDeviationData 
  } = useMarketDeviationData();
  
  const [selectedCountry, setSelectedCountry] = useState<string>('Sweden');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');

  // Fetch brand scores when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchBrandScoresForCountry(selectedCountry);
    }
  }, [selectedCountry, fetchBrandScoresForCountry]);

  const availableBrands = useMemo(() => {
    if (!selectedCountry) return [];
    return getBrandsForCountry(selectedCountry);
  }, [selectedCountry, getBrandsForCountry]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return availableBrands.slice(0, 20);
    return availableBrands
      .filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
      .slice(0, 20);
  }, [availableBrands, brandSearch]);

  const chartData = useMemo(() => {
    if (!selectedCountry || selectedBrands.length === 0) return [];
    return getDeviationData(selectedCountry, selectedBrands);
  }, [selectedCountry, selectedBrands, getDeviationData]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedBrands([]);
    setBrandSearch('');
  };

  const handleAddBrand = (brand: string) => {
    if (!selectedBrands.includes(brand) && selectedBrands.length < 8) {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setBrandSearch('');
  };

  const handleRemoveBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter(b => b !== brand));
  };

  // Calculate min/max for Y axis
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [-10, 10];
    
    let min = 0;
    let max = 0;
    
    chartData.forEach(point => {
      selectedBrands.forEach(brand => {
        const value = point[brand] as number;
        if (value !== undefined) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    const padding = Math.max(Math.abs(min), Math.abs(max)) * 0.2;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [chartData, selectedBrands]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Market Deviation Analysis</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Brand performance relative to market average over time
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>Above market</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              <span>Below market</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Country Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Market</label>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Search & Add */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground">
              Add brands to compare (max 8)
            </label>
            <Select
              value=""
              onValueChange={handleAddBrand}
              disabled={selectedBrands.length >= 8 || loadingCountry === selectedCountry}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingCountry === selectedCountry ? "Loading brands..." : "Search and add brands..."} />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border rounded-md bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {filteredBrands
                  .filter(b => !selectedBrands.includes(b))
                  .map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Brands */}
        {selectedBrands.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedBrands.map((brand, index) => (
              <Badge
                key={brand}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
                style={{ 
                  borderLeftColor: BRAND_COLORS[index % BRAND_COLORS.length],
                  borderLeftWidth: 3,
                }}
              >
                {brand}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-destructive/20"
                  onClick={() => handleRemoveBrand(brand)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="relative h-[400px]">
          {/* Watermark */}
          <div className="absolute top-2 right-2 z-10 opacity-40">
            <img src={sbIndexLogo} alt="SB Index" className="h-6" />
          </div>

          {selectedBrands.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select brands to compare their performance against market average</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                
                {/* Shaded areas for above/below market */}
                <ReferenceArea 
                  y1={0} 
                  y2={yDomain[1]} 
                  fill="hsl(142, 70%, 45%)" 
                  fillOpacity={0.05} 
                />
                <ReferenceArea 
                  y1={yDomain[0]} 
                  y2={0} 
                  fill="hsl(0, 70%, 50%)" 
                  fillOpacity={0.05} 
                />
                
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ className: 'stroke-muted' }}
                />
                <YAxis 
                  domain={yDomain}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ className: 'stroke-muted' }}
                  tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(0)}`}
                  label={{ 
                    value: 'Deviation from Market Average', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
                  }}
                />
                
                {/* Zero reference line (market average) */}
                <ReferenceLine 
                  y={0} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{ 
                    value: 'Market Avg', 
                    position: 'right',
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 11
                  }}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    
                    const marketAvg = payload[0]?.payload?.marketAverage;
                    
                    return (
                      <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                        <p className="font-semibold mb-2">{label}</p>
                        <p className="text-muted-foreground mb-2">
                          Market Average: <span className="font-medium text-foreground">{marketAvg?.toFixed(1)}</span>
                        </p>
                        <div className="space-y-1">
                          {payload.map((entry: any, index: number) => {
                            const deviation = entry.value as number;
                            const brandScore = marketAvg + deviation;
                            return (
                              <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-2.5 h-2.5 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>{entry.dataKey}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-medium">{brandScore.toFixed(1)}</span>
                                  <span className={`ml-1 text-xs ${deviation >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    ({deviation >= 0 ? '+' : ''}{deviation.toFixed(1)})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />

                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />

                {/* Brand deviation lines */}
                {selectedBrands.map((brand, index) => (
                  <Line
                    key={brand}
                    type="monotone"
                    dataKey={brand}
                    stroke={BRAND_COLORS[index % BRAND_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4, fill: BRAND_COLORS[index % BRAND_COLORS.length] }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
