interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, maxScore = 100, size = 'lg' }: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'hsl(var(--chart-2))'; // Green
    if (score >= 40) return 'hsl(var(--chart-4))'; // Yellow/Orange
    return 'hsl(var(--destructive))'; // Red
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${textSizes[size]} text-foreground`}>
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          SBI Score
        </span>
      </div>
    </div>
  );
}
