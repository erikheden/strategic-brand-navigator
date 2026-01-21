import { useMemo, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricalScore } from '@/hooks/useBrandIntelligence';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface HistoricalPerformanceChartProps {
  data: HistoricalScore[];
  brandName: string;
  country?: string;
}

interface ComparisonBrand {
  name: string;
  data: { year: number; score: number }[];
  color: string;
}

const COMPARISON_COLORS = [
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function HistoricalPerformanceChart({ data, brandName, country }: HistoricalPerformanceChartProps) {
  const [marketAverages, setMarketAverages] = useState<{ year: number; score: number }[]>([]);
  const [comparisonBrands, setComparisonBrands] = useState<ComparisonBrand[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch available brands for comparison from database
  useEffect(() => {
    async function fetchAvailableBrands() {
      if (!country) return;

      const { data: brandsData, error } = await supabase
        .from('SBI Ranking Scores 2011-2025')
        .select('Brand')
        .eq('Country', country)
        .order('Brand');

      if (!error && brandsData) {
        const uniqueBrands = [...new Set(brandsData.map((b) => b.Brand).filter(Boolean))] as string[];
        setAvailableBrands(uniqueBrands.filter((b) => b !== brandName));
      }
    }

    fetchAvailableBrands();
  }, [country, brandName]);

  // Fetch market averages for the country
  useEffect(() => {
    async function fetchMarketAverages() {
      if (!country) return;

      const { data: avgData, error } = await supabase
        .from('SBI Average Scores')
        .select('year, score')
        .eq('country', country)
        .order('year', { ascending: true });

      if (!error && avgData) {
        setMarketAverages(
          avgData
            .filter((d) => d.year !== null && d.score !== null)
            .map((d) => ({ year: d.year!, score: d.score! }))
        );
      }
    }

    fetchMarketAverages();
  }, [country]);

  const addComparisonBrand = useCallback(async (brand: string) => {
    if (!country || comparisonBrands.some((b) => b.name === brand)) return;

    const { data: brandData, error } = await supabase
      .from('SBI Ranking Scores 2011-2025')
      .select('Year, Score')
      .eq('Brand', brand)
      .eq('Country', country)
      .order('Year', { ascending: true });

    if (!error && brandData) {
      const colorIndex = comparisonBrands.length % COMPARISON_COLORS.length;
      const processedData = brandData
        .filter((d) => d.Year !== null && d.Score !== null)
        .map((d) => ({ year: d.Year!, score: d.Score! }));
      
      setComparisonBrands((prev) => [
        ...prev,
        {
          name: brand,
          data: processedData,
          color: COMPARISON_COLORS[colorIndex],
        },
      ]);
    }
    setPopoverOpen(false);
    setSearchQuery('');
  }, [country, comparisonBrands]);

  const removeComparisonBrand = useCallback((brand: string) => {
    setComparisonBrands((prev) => prev.filter((b) => b.name !== brand));
  }, []);

  const { chartData, avgScore, minScore, maxScore } = useMemo(() => {
    if (data.length === 0) {
      return { chartData: [], avgScore: 0, minScore: 0, maxScore: 0 };
    }

    const avgScore = data.reduce((a, b) => a + b.score, 0) / data.length;
    const allScores = [
      ...data.map((d) => d.score),
      ...marketAverages.map((m) => m.score),
      ...comparisonBrands.flatMap((b) => b.data.map((d) => d.score)),
    ];
    const minScore = Math.min(...allScores);
    const maxScore = Math.max(...allScores);

    // Create a map of all years
    const yearMap = new Map<number, Record<string, number | null>>();
    
    // Add primary brand data
    data.forEach((d) => {
      const existing = yearMap.get(d.year) || {};
      yearMap.set(d.year, { ...existing, primaryScore: d.score });
    });

    // Add market averages
    marketAverages.forEach((m) => {
      const existing = yearMap.get(m.year) || {};
      yearMap.set(m.year, { ...existing, marketAverage: m.score });
    });

    // Add comparison brands
    comparisonBrands.forEach((brand) => {
      brand.data.forEach((d) => {
        const existing = yearMap.get(d.year) || {};
        yearMap.set(d.year, { ...existing, [brand.name]: d.score });
      });
    });

    // Convert to array and calculate changes for primary brand
    const mergedData = Array.from(yearMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, scores], i, arr) => {
        const primaryScore = scores.primaryScore ?? null;
        const prevScore = i > 0 ? (arr[i - 1][1].primaryScore ?? primaryScore) : primaryScore;
        const change = primaryScore && prevScore ? primaryScore - prevScore : 0;
        const percentChange = prevScore ? (change / prevScore) * 100 : 0;

        return {
          year,
          score: primaryScore,
          ...scores,
          change,
          significant: Math.abs(percentChange) > 5,
        };
      });

    return {
      chartData: mergedData,
      avgScore,
      minScore,
      maxScore,
    };
  }, [data, marketAverages, comparisonBrands]);

  const filteredBrands = useMemo(() => {
    const selectedNames = comparisonBrands.map((b) => b.name);
    return availableBrands
      .filter((b) => !selectedNames.includes(b))
      .filter((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 20);
  }, [availableBrands, comparisonBrands, searchQuery]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historical Performance</CardTitle>
          <CardDescription>SBI score trajectory 2011-2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No historical data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Historical Performance</CardTitle>
            <CardDescription>
              SBI score trajectory {data[0]?.year} - {data[data.length - 1]?.year}
              <span className="ml-2 text-foreground font-medium">
                (Avg: {avgScore.toFixed(1)})
              </span>
            </CardDescription>
          </div>
          
          {/* Brand Comparison Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {comparisonBrands.map((brand) => (
              <Badge
                key={brand.name}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
                style={{ borderColor: brand.color, borderWidth: 2 }}
              >
                {brand.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeComparisonBrand(brand.name)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            
            {comparisonBrands.length < 4 && (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <Plus className="h-3 w-3" />
                    Add Brand
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="end">
                  <Command>
                    <CommandInput 
                      placeholder="Search brands..." 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No brands found.</CommandEmpty>
                      <CommandGroup>
                        {filteredBrands.map((brand) => (
                          <CommandItem
                            key={brand}
                            value={brand}
                            onSelect={() => addComparisonBrand(brand)}
                          >
                            {brand}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: 'hsl(var(--chart-axis))' }}
              tickLine={{ stroke: 'hsl(var(--chart-axis))' }}
            />
            <YAxis
              domain={[Math.floor(minScore - 5), Math.ceil(maxScore + 5)]}
              tick={{ fontSize: 12, fill: 'hsl(var(--chart-axis))' }}
              tickLine={{ stroke: 'hsl(var(--chart-axis))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                if (value === null || value === undefined) return ['-', name];
                const displayName = name === 'score' ? brandName : name === 'marketAverage' ? 'Market Average' : name;
                return [value.toFixed(1), displayName];
              }}
            />
            <ReferenceLine
              y={avgScore}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{
                value: `${brandName} Avg: ${avgScore.toFixed(1)}`,
                position: 'right',
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))',
              }}
            />
            {/* Market Average Line */}
            {marketAverages.length > 0 && (
              <Line
                type="monotone"
                dataKey="marketAverage"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="marketAverage"
                connectNulls
              />
            )}
            {/* Comparison Brand Lines */}
            {comparisonBrands.map((brand) => (
              <Line
                key={brand.name}
                type="monotone"
                dataKey={brand.name}
                stroke={brand.color}
                strokeWidth={2}
                dot={{ r: 3, fill: brand.color }}
                name={brand.name}
                connectNulls
              />
            ))}
            {/* Primary Brand Score Line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="score"
              connectNulls
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy) return <></>;
                if (payload.significant) {
                  return (
                    <circle
                      key={payload.year}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={payload.change > 0 ? 'hsl(var(--fortress))' : 'hsl(var(--danger))'}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }
                return (
                  <circle
                    key={payload.year}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="hsl(var(--primary))"
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary rounded" />
            <span>{brandName}</span>
          </div>
          {comparisonBrands.map((brand) => (
            <div key={brand.name} className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded" style={{ backgroundColor: brand.color }} />
              <span>{brand.name}</span>
            </div>
          ))}
          {marketAverages.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-muted-foreground rounded" style={{ borderTop: '2px dashed' }} />
              <span>Market Average</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--fortress))]" />
            <span>Significant increase (&gt;5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--danger))]" />
            <span>Significant decrease (&gt;5%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
