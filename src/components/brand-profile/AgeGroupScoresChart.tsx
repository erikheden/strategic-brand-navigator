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
          SBI Score & Pillars
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
    .map(d => {
      // Normalize age format to include "years"
      let ageLabel = d.age.replace(' years', '');
      if (!ageLabel.includes('years')) {
        ageLabel = `${ageLabel} years`;
      }
      return {
        age: ageLabel,
        score: Math.round(d.score * 10) / 10,
        social: Math.round(d.social * 10) / 10,
        environment: Math.round(d.environment * 10) / 10,
      };
    })
    .sort((a, b) => {
      const ageOrder = ['16-29 years', '30-44 years', '45-59 years', '60+ years'];
      return ageOrder.indexOf(a.age) - ageOrder.indexOf(b.age);
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          SBI Score & Pillars
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Total SBI score = Environmental + Social pillars
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
              formatter={(value: number, name: string) => {
                return [`${value}`, name];
              }}
            />
            <Legend />
            <Bar dataKey="environment" name="Environment" stackId="pillars" fill="hsl(142 71% 45%)" />
            <Bar dataKey="social" name="Social" stackId="pillars" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
