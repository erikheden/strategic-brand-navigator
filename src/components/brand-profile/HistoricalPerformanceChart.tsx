import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricalScore } from '@/hooks/useBrandIntelligence';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

interface HistoricalPerformanceChartProps {
  data: HistoricalScore[];
  brandName: string;
  country?: string;
}

export function HistoricalPerformanceChart({ data, brandName, country }: HistoricalPerformanceChartProps) {
  const [marketAverages, setMarketAverages] = useState<{ year: number; score: number }[]>([]);

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

  const { chartData, avgScore, minScore, maxScore } = useMemo(() => {
    if (data.length === 0) {
      return { chartData: [], avgScore: 0, minScore: 0, maxScore: 0 };
    }

    const avgScore = data.reduce((a, b) => a + b.score, 0) / data.length;
    const allScores = [
      ...data.map((d) => d.score),
      ...marketAverages.map((m) => m.score),
    ];
    const minScore = Math.min(...allScores);
    const maxScore = Math.max(...allScores);

    // Merge brand data with market averages
    const mergedData = data.map((d, i) => {
      const prevScore = i > 0 ? data[i - 1].score : d.score;
      const change = d.score - prevScore;
      const percentChange = (change / prevScore) * 100;
      const marketAvg = marketAverages.find((m) => m.year === d.year);
      
      return {
        ...d,
        change,
        significant: Math.abs(percentChange) > 5,
        marketAverage: marketAvg?.score || null,
      };
    });

    return {
      chartData: mergedData,
      avgScore,
      minScore,
      maxScore,
    };
  }, [data, marketAverages]);

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
        <CardTitle className="text-lg">Historical Performance</CardTitle>
        <CardDescription>
          SBI score trajectory {data[0]?.year} - {data[data.length - 1]?.year}
          <span className="ml-2 text-foreground font-medium">
            (Avg: {avgScore.toFixed(1)})
          </span>
        </CardDescription>
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
              formatter={(value: number, name: string) => [
                value?.toFixed(1) ?? 'N/A',
                name === 'score' ? brandName : name === 'marketAverage' ? 'Market Average' : name,
              ]}
            />
            <ReferenceLine
              y={avgScore}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{
                value: `Brand Avg: ${avgScore.toFixed(1)}`,
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
              />
            )}
            {/* Brand Score Line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="score"
              dot={(props) => {
                const { cx, cy, payload } = props;
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
