import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Radio } from 'lucide-react';

interface InfluenceItem {
  medium: string;
  percentage: number;
  year: number;
}

interface InfluenceChannelsChartProps {
  data: InfluenceItem[];
  country: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--muted-foreground))',
];

export function InfluenceChannelsChart({ data, country }: InfluenceChannelsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Radio className="h-5 w-5 text-primary" />
            Influence Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No influence channel data available for {country}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year and prepare data
  const latestYear = Math.max(...data.map(d => d.year));
  const latestData = data
    .filter(d => d.year === latestYear && d.medium !== 'Other')
    .map(d => ({
      name: d.medium,
      value: Math.round(d.percentage * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Radio className="h-5 w-5 text-primary" />
          Influence Channels
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Where consumers learn about sustainability
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={latestData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${value}%`}
              labelLine={false}
            >
              {latestData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Influence']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
