export interface Brand {
  Brand: string;
  Country: string;
  Industry: string;
  Current_Score: number;
  Volatility: number;
  Trend_Slope: number;
  Inflation_Performance: number | null;
  Cluster_Name?: string;
}

export type QuadrantType = 'fortress' | 'challenger' | 'sleeper' | 'danger';

export interface QuadrantInfo {
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  recommendation: string;
}

export const QUADRANT_CONFIG: Record<QuadrantType, QuadrantInfo> = {
  fortress: {
    name: 'The Fortress',
    emoji: '👑',
    color: 'hsl(152, 69%, 31%)',
    bgColor: 'hsl(152, 69%, 95%)',
    description: 'Brands with high stability and strong inflation performance. These market leaders demonstrate consistent performance and resilience against market fluctuations.',
    recommendation: 'Maintain your market leadership through continuous innovation and brand reinforcement.',
  },
  challenger: {
    name: 'The Challenger',
    emoji: '🚀',
    color: 'hsl(25, 95%, 53%)',
    bgColor: 'hsl(25, 95%, 95%)',
    description: 'Brands with high growth potential but variable performance. These dynamic players show strong inflation performance but need to work on operational consistency.',
    recommendation: 'Focus on operational consistency to reduce volatility while maintaining growth momentum.',
  },
  sleeper: {
    name: 'The Sleeper',
    emoji: '🐢',
    color: 'hsl(215, 16%, 47%)',
    bgColor: 'hsl(215, 16%, 95%)',
    description: 'Brands with stable operations but underperforming growth. These consistent performers have untapped potential and may benefit from strategic repositioning.',
    recommendation: 'Identify untapped growth opportunities and consider strategic repositioning to accelerate performance.',
  },
  danger: {
    name: 'Danger Zone',
    emoji: '🚩',
    color: 'hsl(0, 72%, 51%)',
    bgColor: 'hsl(0, 72%, 96%)',
    description: 'Brands with both high volatility and weak inflation performance. These brands require immediate attention to stabilize operations and improve market positioning.',
    recommendation: 'Urgent action required: Stabilize operations and reassess market positioning immediately.',
  },
};

export function getQuadrant(volatility: number, inflationPerformance: number | null, medianVolatility: number, medianInflation: number): QuadrantType {
  const hasHighStability = volatility < medianVolatility;
  const hasHighGrowth = (inflationPerformance ?? 0) > medianInflation;

  if (hasHighStability && hasHighGrowth) return 'fortress';
  if (!hasHighStability && hasHighGrowth) return 'challenger';
  if (hasHighStability && !hasHighGrowth) return 'sleeper';
  return 'danger';
}
