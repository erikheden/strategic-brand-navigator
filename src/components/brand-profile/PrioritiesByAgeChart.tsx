import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target } from 'lucide-react';

interface PriorityItem {
  age: string;
  english_label_short: string;
  percentage: number;
  year: number;
}

interface PrioritiesByAgeChartProps {
  data: PriorityItem[];
  country: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function PrioritiesByAgeChart({ data, country }: PrioritiesByAgeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Priorities by Age
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No priority data available for {country}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year
  const latestYear = Math.max(...data.map(d => d.year));
  
  // Aggregate across all ages to get top priorities
  const priorityMap = new Map<string, number>();
  data
    .filter(d => d.year === latestYear)
    .forEach(d => {
      const current = priorityMap.get(d.english_label_short) || 0;
      priorityMap.set(d.english_label_short, current + d.percentage);
    });

  // Get top priorities
  const chartData = Array.from(priorityMap.entries())
    .map(([priority, total]) => ({
      priority,
      value: Math.round(total / 4 * 100) / 100, // Average across 4 age groups
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Consumer Priorities
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Top sustainability priorities (averaged across age groups)
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" domain={[0, 50]} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              type="category" 
              dataKey="priority" 
              width={140} 
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Priority Score']}
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
