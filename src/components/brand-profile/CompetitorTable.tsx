import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CompetitorRanking } from '@/hooks/useBrandIntelligence';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompetitorTableProps {
  competitors: CompetitorRanking[];
  currentBrand: string;
  industry: string;
}

export function CompetitorTable({ competitors, currentBrand, industry }: CompetitorTableProps) {
  if (competitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Industry Competitors</CardTitle>
          <CardDescription>Ranking comparison within {industry || 'industry'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No competitor data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentBrandRank = competitors.find(
    (c) => c.brand.toLowerCase() === currentBrand.toLowerCase()
  );
  const topCompetitors = competitors.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Industry Competitors</CardTitle>
            <CardDescription>
              Top 10 brands in {industry} 
              {currentBrandRank && (
                <span className="ml-2 font-medium text-foreground">
                  ({currentBrand} is #{currentBrandRank.rankingPosition})
                </span>
              )}
            </CardDescription>
          </div>
          {currentBrandRank && currentBrandRank.rankingPosition <= 3 && (
            <Badge className="bg-[hsl(var(--fortress))] text-white">
              <Crown className="h-3 w-3 mr-1" />
              Top 3
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Industry Rank</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="text-right">Country Rank</TableHead>
              <TableHead className="w-[120px]">Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCompetitors.map((competitor) => {
              const isCurrentBrand = competitor.brand.toLowerCase() === currentBrand.toLowerCase();
              const positionVsOverall = competitor.overallRanking - competitor.rankingPosition;

              return (
                <TableRow
                  key={competitor.brand}
                  className={isCurrentBrand ? 'bg-primary/5 font-medium' : ''}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {competitor.rankingPosition === 1 && (
                        <Crown className="h-4 w-4 text-[hsl(var(--challenger))]" />
                      )}
                      <span className="font-mono">#{competitor.rankingPosition}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isCurrentBrand ? (
                      <span className="font-semibold text-primary">{competitor.brand}</span>
                    ) : (
                      <Link 
                        to={`/brand/${encodeURIComponent(competitor.brand)}/${encodeURIComponent(competitor.country || 'Unknown')}`}
                        className="text-muted-foreground hover:text-primary hover:underline"
                      >
                        {competitor.brand}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    #{competitor.overallRanking}
                  </TableCell>
                  <TableCell>
                    {positionVsOverall !== 0 && (
                      <div className={`flex items-center gap-1 text-xs ${positionVsOverall > 0 ? 'text-[hsl(var(--fortress))]' : 'text-[hsl(var(--danger))]'}`}>
                        {positionVsOverall > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                          {positionVsOverall > 0 ? 'Outperforms' : 'Underperforms'} in industry
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
