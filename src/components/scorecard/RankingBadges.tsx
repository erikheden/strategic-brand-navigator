import { Trophy, Award, TrendingUp } from 'lucide-react';

interface RankingBadgesProps {
  industryRank: number | null;
  countryRank: number | null;
  totalInIndustry: number;
  totalInCountry: number;
  percentile: number;
}

export function RankingBadges({
  industryRank,
  countryRank,
  totalInIndustry,
  totalInCountry,
  percentile,
}: RankingBadgesProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-muted/50 rounded-lg p-3 text-center">
        <div className="flex justify-center mb-1">
          <Award className="h-5 w-5 text-amber-500" />
        </div>
        <div className="text-lg font-bold text-foreground">
          #{industryRank || '-'}
        </div>
        <div className="text-xs text-muted-foreground">
          of {totalInIndustry} in Industry
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-3 text-center">
        <div className="flex justify-center mb-1">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div className="text-lg font-bold text-foreground">
          #{countryRank || '-'}
        </div>
        <div className="text-xs text-muted-foreground">
          of {totalInCountry} in Country
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-3 text-center">
        <div className="flex justify-center mb-1">
          <TrendingUp className="h-5 w-5 text-chart-2" />
        </div>
        <div className="text-lg font-bold text-foreground">
          Top {100 - percentile}%
        </div>
        <div className="text-xs text-muted-foreground">
          Percentile
        </div>
      </div>
    </div>
  );
}
