import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MessageCircle } from 'lucide-react';

interface DiscussionTopic {
  discussion_topic: string;
  percentage: number;
  year: number;
}

interface DiscussionTopicsChartProps {
  data: DiscussionTopic[];
  country: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function DiscussionTopicsChart({ data, country }: DiscussionTopicsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
            Trending Discussion Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No discussion topic data available for {country}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year and sort by percentage
  const latestYear = Math.max(...data.map(d => d.year));
  const latestData = data
    .filter(d => d.year === latestYear)
    .map(d => ({
      topic: d.discussion_topic,
      value: Math.round(d.percentage * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5 text-primary" />
          Trending Discussion Topics
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={latestData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              type="category" 
              dataKey="topic" 
              width={140} 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Discussion Share']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {latestData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
