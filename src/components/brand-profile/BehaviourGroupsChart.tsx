import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChartIcon } from 'lucide-react';

interface BehaviourItem {
  behaviour_group: string;
  percentage: number;
  year: number;
}

interface BehaviourGroupsChartProps {
  data: BehaviourItem[];
  country: string;
}

const COLORS = [
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--primary))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--muted-foreground))',
];

const BEHAVIOUR_DESCRIPTIONS: Record<string, string> = {
  'Dedicated': 'Highly committed to sustainability',
  'Open': 'Open to sustainable choices',
  'Skeptic': 'Skeptical of sustainability claims',
  'Passive': 'Low engagement with sustainability',
  'Active': 'Actively practicing sustainability',
  'Indifferent': 'No interest in sustainability',
};

export function BehaviourGroupsChart({ data, country }: BehaviourGroupsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Consumer Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No behaviour segment data available for {country}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year
  const latestYear = Math.max(...data.map(d => d.year));
  const chartData = data
    .filter(d => d.year === latestYear)
    .map(d => ({
      name: d.behaviour_group,
      value: Math.round(d.percentage * 100),
      description: BEHAVIOUR_DESCRIPTIONS[d.behaviour_group] || '',
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Consumer Segments
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Sustainability behaviour segmentation
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, _: string, props: any) => [
                `${value}%`, 
                props.payload.description || props.payload.name
              ]}
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
