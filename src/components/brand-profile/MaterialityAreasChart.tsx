import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Leaf } from 'lucide-react';

interface MaterialityItem {
  materiality_area: string;
  percentage: number;
  year: number;
}

interface MaterialityAreasChartProps {
  data: MaterialityItem[];
  country: string;
}

const COLORS = [
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--muted-foreground))',
];

export function MaterialityAreasChart({ data, country }: MaterialityAreasChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="h-5 w-5 text-primary" />
            Materiality Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No materiality data available for {country}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year
  const latestYear = Math.max(...data.map(d => d.year));
  const chartData = data
    .filter(d => d.year === latestYear)
    .map(d => ({
      area: d.materiality_area,
      value: Math.round(d.percentage * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Leaf className="h-5 w-5 text-primary" />
          Materiality Areas
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          What sustainability topics matter most to consumers
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" domain={[0, 50]} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              type="category" 
              dataKey="area" 
              width={150} 
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Importance']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
