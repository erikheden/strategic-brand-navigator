import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShoppingCart } from 'lucide-react';

interface PurchasingItem {
  category: string;
  impact_level: string;
  percentage: number;
  year: number;
}

interface PurchasingImpactChartProps {
  data: PurchasingItem[];
  industry: string;
  country: string;
}

export function PurchasingImpactChart({ data, industry, country }: PurchasingImpactChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Sustainability Impact on Purchasing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No purchasing decision data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Get latest year
  const latestYear = Math.max(...data.map(d => d.year));
  const latestData = data.filter(d => d.year === latestYear);

  // Pivot data: group by category, with impact levels as separate values
  const categories = [...new Set(latestData.map(d => d.category))];
  const chartData = categories.map(category => {
    const categoryData = latestData.filter(d => d.category === category);
    const result: Record<string, string | number> = { category };
    categoryData.forEach(d => {
      result[d.impact_level] = Math.round(d.percentage * 100);
    });
    return result;
  }).sort((a, b) => {
    const aTotal = (Number(a.Acting) || 0) + (Number(a.Concerned) || 0);
    const bTotal = (Number(b.Acting) || 0) + (Number(b.Concerned) || 0);
    return bTotal - aTotal;
  }).slice(0, 8);

  // Highlight the brand's industry
  const isRelevantIndustry = (category: string) => {
    return industry.toLowerCase().includes(category.toLowerCase()) ||
           category.toLowerCase().includes(industry.toLowerCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Sustainability Impact on Purchasing
          <span className="text-sm font-normal text-muted-foreground ml-auto">{latestYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Consumer engagement levels by industry in {country}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis 
              type="category" 
              dataKey="category" 
              width={100} 
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend />
            <Bar dataKey="Acting" stackId="a" fill="hsl(var(--chart-2))" name="Acting" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Concerned" stackId="a" fill="hsl(var(--chart-4))" name="Concerned" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Aware" stackId="a" fill="hsl(var(--muted))" name="Aware" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
