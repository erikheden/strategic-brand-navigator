import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Brain } from 'lucide-react';

interface KnowledgeItem {
  term: string;
  percentage: number;
  year: number;
}

interface KnowledgeLevelsChartProps {
  data: KnowledgeItem[];
  country: string;
}

export function KnowledgeLevelsChart({ data, country }: KnowledgeLevelsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Sustainability Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No knowledge data available for {country}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year and sort by percentage
  const latestYear = Math.max(...data.map(d => d.year));
  const latestData = data
    .filter(d => d.year === latestYear)
    .map(d => ({
      term: d.term,
      value: Math.round(d.percentage * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Color scale from high knowledge (green) to low knowledge (muted)
  const getColor = (index: number, total: number) => {
    const ratio = index / total;
    if (ratio < 0.3) return 'hsl(var(--chart-2))';
    if (ratio < 0.6) return 'hsl(var(--chart-4))';
    return 'hsl(var(--muted-foreground))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Sustainability Knowledge
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          % of consumers who understand each term
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={latestData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              type="category" 
              dataKey="term" 
              width={140} 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Understanding']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {latestData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index, latestData.length)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
