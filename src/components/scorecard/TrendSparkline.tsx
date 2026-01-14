import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TrendSparklineProps {
  historicalScores: { year: number; score: number }[];
  marketAverages?: { year: number; score: number }[];
}

export function TrendSparkline({ historicalScores, marketAverages = [] }: TrendSparklineProps) {
  if (historicalScores.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
        No historical data available
      </div>
    );
  }

  // Merge data for the chart
  const chartData = historicalScores.map(h => {
    const marketAvg = marketAverages.find(m => m.year === h.year);
    return {
      year: h.year,
      score: h.score,
      market: marketAvg?.score || null,
    };
  });

  const allScores = [...historicalScores.map(h => h.score), ...marketAverages.map(m => m.score)];
  const minScore = Math.min(...allScores) - 5;
  const maxScore = Math.max(...allScores) + 5;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">5-Year Trend</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[minScore, maxScore]} 
              hide 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                value.toFixed(1),
                name === 'score' ? 'Brand Score' : 'Market Avg'
              ]}
            />
            {marketAverages.length > 0 && (
              <Line
                type="monotone"
                dataKey="market"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-primary rounded" /> Brand
        </span>
        {marketAverages.length > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-muted-foreground rounded border-dashed" style={{ borderTop: '1px dashed' }} /> Market
          </span>
        )}
      </div>
    </div>
  );
}
