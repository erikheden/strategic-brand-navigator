import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AwarenessAttitude } from '@/hooks/useBrandIntelligence';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AwarenessAttitudeChartProps {
  data: AwarenessAttitude[];
  brandName: string;
}

export function AwarenessAttitudeChart({ data, brandName }: AwarenessAttitudeChartProps) {
  const { chartData, latestGap } = useMemo(() => {
    if (data.length === 0) {
      return { chartData: [], latestGap: 0 };
    }

    const chartData = data.map((d) => ({
      ...d,
      gap: d.awareness - d.attitude,
    }));

    const latest = chartData[chartData.length - 1];
    const latestGap = latest ? latest.gap : 0;

    return { chartData, latestGap };
  }, [data]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Awareness vs Attitude</CardTitle>
          <CardDescription>Brand perception over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No awareness/attitude data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Awareness vs Attitude</CardTitle>
        <CardDescription>
          Brand perception gap analysis
          <span className={`ml-2 font-medium ${latestGap > 10 ? 'text-[hsl(var(--challenger))]' : 'text-[hsl(var(--fortress))]'}`}>
            (Gap: {latestGap.toFixed(1)} pts)
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
              domain={[0, 100]}
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
                `${value.toFixed(1)}%`,
                name === 'awareness' ? 'Awareness' : name === 'attitude' ? 'Attitude' : 'Gap',
              ]}
            />
            <Legend 
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => value === 'awareness' ? 'Awareness' : value === 'attitude' ? 'Attitude' : value}
            />
            <Line
              type="monotone"
              dataKey="awareness"
              name="awareness"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="attitude"
              name="attitude"
              stroke="hsl(var(--fortress))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--fortress))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Insight */}
        {latestGap > 10 && (
          <div className="mt-4 p-3 rounded-lg bg-[hsl(var(--challenger-bg))] border border-[hsl(var(--challenger))/20]">
            <p className="text-sm text-[hsl(var(--challenger))]">
              <strong>Awareness-Attitude Gap:</strong> High awareness but lower attitude suggests 
              the brand is well-known but perception could be improved. Focus on building 
              deeper emotional connections.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
