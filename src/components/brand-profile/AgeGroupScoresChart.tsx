import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';

interface AgeScoreItem {
  age: string;
  score: number;
  social: number;
  environment: number;
  year: number;
}

interface AgeGroupScoresChartProps {
  data: AgeScoreItem[];
  brandName: string;
}

export function AgeGroupScoresChart({ data, brandName }: AgeGroupScoresChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          SBI Score & Pillars by Age
        </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No age group score data available for {brandName}.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year
  const latestYear = Math.max(...data.map(d => d.year));
  const latestData = data
    .filter(d => d.year === latestYear)
    .map(d => ({
      age: d.age.replace(' years', ''),
      score: Math.round(d.score * 10) / 10,
      social: Math.round(d.social * 10) / 10,
      environment: Math.round(d.environment * 10) / 10,
    }))
    .sort((a, b) => {
      // Sort by age order
      const ageOrder = ['16-29', '30-44', '45-59', '60+'];
      return ageOrder.indexOf(a.age) - ageOrder.indexOf(b.age);
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          SBI Score & Pillars by Age
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          How different age groups perceive {brandName}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={latestData} margin={{ left: 0, right: 20 }}>
            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="score" name="Overall Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="social" name="Social" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="environment" name="Environment" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
