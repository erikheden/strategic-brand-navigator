import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HistoricalScore {
  year: number;
  score: number;
  industry: string;
  country: string;
}

export interface AwarenessAttitude {
  year: number;
  awareness: number;
  attitude: number;
  industry: string;
}

export interface CompetitorRanking {
  brand: string;
  rankingPosition: number;
  overallRanking: number;
  industry: string;
  country: string;
}

export interface DiscussionTopic {
  discussion_topic: string;
  percentage: number;
  year: number;
}

export interface KnowledgeItem {
  term: string;
  percentage: number;
  year: number;
}

export interface PurchasingItem {
  category: string;
  impact_level: string;
  percentage: number;
  year: number;
}

export interface InfluenceItem {
  medium: string;
  percentage: number;
  year: number;
}

export interface AgeScoreItem {
  age: string;
  score: number;
  social: number;
  environment: number;
  year: number;
}

export interface PriorityItem {
  age: string;
  english_label_short: string;
  percentage: number;
  year: number;
}

export interface MaterialityItem {
  materiality_area: string;
  percentage: number;
  year: number;
}

export interface BehaviourItem {
  behaviour_group: string;
  percentage: number;
  year: number;
}

export interface BrandIntelligence {
  historicalScores: HistoricalScore[];
  awarenessAttitude: AwarenessAttitude[];
  competitors: CompetitorRanking[];
  discussionTopics: DiscussionTopic[];
  knowledgeLevels: KnowledgeItem[];
  purchasingImpact: PurchasingItem[];
  influenceChannels: InfluenceItem[];
  ageGroupScores: AgeScoreItem[];
  prioritiesByAge: PriorityItem[];
  materialityAreas: MaterialityItem[];
  behaviourGroups: BehaviourItem[];
  currentData: {
    score: number;
    volatility: number;
    trendSlope: number;
    inflationPerformance: number | null;
    industry: string;
  } | null;
}

// Country code to full name mapping
const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  'FI': 'Finland',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'NL': 'Netherlands',
  'EE': 'Estonia',
  'LV': 'Latvia',
  'LT': 'Lithuania',
};

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'Finland': 'FI',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Netherlands': 'NL',
  'The Netherlands': 'NL',
  'Estonia': 'EE',
  'Latvia': 'LV',
  'Lithuania': 'LT',
};

function getFullCountryName(code: string): string {
  return COUNTRY_CODE_TO_NAME[code] || code;
}

function getCountryCode(nameOrCode: string): string {
  return COUNTRY_NAME_TO_CODE[nameOrCode] || nameOrCode;
}

export function useBrandIntelligence(brandName: string, country: string) {
  const [data, setData] = useState<BrandIntelligence>({
    historicalScores: [],
    awarenessAttitude: [],
    competitors: [],
    discussionTopics: [],
    knowledgeLevels: [],
    purchasingImpact: [],
    influenceChannels: [],
    ageGroupScores: [],
    prioritiesByAge: [],
    materialityAreas: [],
    behaviourGroups: [],
    currentData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!brandName || !country) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Get both country formats
      const countryCode = getCountryCode(country);
      const countryFullName = getFullCountryName(country);

      try {
        // Fetch all data in parallel
        const [
          historicalRes,
          awarenessRes,
          currentRes,
          discussionRes,
          knowledgeRes,
          purchasingRes,
          influenceRes,
          ageScoresRes,
          prioritiesRes,
          materialityRes,
          behaviourRes,
        ] = await Promise.all([
          // Historical scores 2011-2025 (uses full country names like "Finland")
          supabase
            .from('SBI Ranking Scores 2011-2025')
            .select('Year, Score, industry, Country, Brand')
            .ilike('Brand', brandName)
            .eq('Country', countryFullName)
            .order('Year', { ascending: true }),

          // Awareness & Attitude data (uses country codes like "FI")
          supabase
            .from('Awareness_Attitude_2019-2024')
            .select('year, awareness_level, brand_attitude, industry')
            .eq('brand', brandName)
            .eq('country', countryCode)
            .order('year', { ascending: true }),

          // Current inflation/stability data (uses country codes like "FI")
          supabase
            .from('SBI_Inflation_Stability_2025')
            .select('*')
            .eq('Brand', brandName)
            .eq('Country', countryCode)
            .single(),

          // Discussion topics (country-level data, uses codes)
          supabase
            .from('SBI_Discussion_Topics')
            .select('discussion_topic, percentage, year')
            .eq('country', countryCode)
            .order('year', { ascending: false }),

          // Knowledge levels (country-level data, uses codes)
          supabase
            .from('SBI_Knowledge')
            .select('term, percentage, year')
            .eq('country', countryCode)
            .order('year', { ascending: false }),

          // Purchasing decision impact (country-level data, uses codes)
          supabase
            .from('SBI_purchasing_decision_industries')
            .select('category, impact_level, percentage, year')
            .eq('country', countryCode)
            .order('year', { ascending: false }),

          // Influence channels (country-level data, uses codes)
          supabase
            .from('SBI_influences')
            .select('medium, percentage, year')
            .eq('country', countryCode)
            .order('year', { ascending: false }),

          // Age group scores (uses codes)
          supabase
            .from('SB Ranking Scores 2019-2025 BY AGE')
            .select('age, score, social, environment, year')
            .eq('Brand', brandName)
            .eq('country', countryCode)
            .order('year', { ascending: false }),

          // Priorities by age (uses codes)
          supabase
            .from('SBI_Priorities_Age_Groups')
            .select('age, english_label_short, percentage, year')
            .eq('country', countryCode)
            .order('year', { ascending: false }),

          // Materiality areas (uses FULL country names)
          supabase
            .from('materiality_areas_general_sbi')
            .select('materiality_area, percentage, year')
            .eq('country', countryFullName)
            .order('year', { ascending: false }),

          // Behaviour groups (uses codes)
          supabase
            .from('SBI_behaviour_groups')
            .select('behaviour_group, percentage, year')
            .eq('country', countryCode)
            .order('year', { ascending: false }),
        ]);

        // Get industry from current data for competitor lookup
        const industry = currentRes.data?.Industry;

        // Fetch competitors (same industry, same country) - uses FULL country names
        let competitorsData: CompetitorRanking[] = [];
        if (industry) {
          const competitorRes = await supabase
            .from('SBI Ranking Positions 2025 only')
            .select('Brand, "Ranking Position", "Overall Country Ranking", industry, Country')
            .eq('Country', countryFullName)
            .eq('industry', industry)
            .order('Ranking Position', { ascending: true });

          if (competitorRes.data) {
            competitorsData = competitorRes.data.map((c) => ({
              brand: c.Brand || '',
              rankingPosition: c['Ranking Position'] || 0,
              overallRanking: c['Overall Country Ranking'] || 0,
              industry: c.industry || '',
              country: c.Country || countryFullName,
            }));
          }
        }

        // Process historical scores
        const historicalScores: HistoricalScore[] = (historicalRes.data || []).map((row) => ({
          year: row.Year || 0,
          score: row.Score || 0,
          industry: row.industry || '',
          country: row.Country || '',
        }));

        // Process awareness/attitude
        const awarenessAttitude: AwarenessAttitude[] = (awarenessRes.data || []).map((row) => ({
          year: row.year || 0,
          awareness: row.awareness_level || 0,
          attitude: row.brand_attitude || 0,
          industry: row.industry || '',
        }));

        // Current data
        const currentData = currentRes.data
          ? {
              score: currentRes.data.Current_Score || 0,
              volatility: currentRes.data.Volatility || 0,
              trendSlope: currentRes.data.Trend_Slope || 0,
              inflationPerformance: currentRes.data.Inflation_Performance
                ? parseFloat(currentRes.data.Inflation_Performance)
                : null,
              industry: currentRes.data.Industry || '',
            }
          : null;

        // Process consumer context data
        const discussionTopics: DiscussionTopic[] = (discussionRes.data || []).map((row) => ({
          discussion_topic: row.discussion_topic || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        const knowledgeLevels: KnowledgeItem[] = (knowledgeRes.data || []).map((row) => ({
          term: row.term || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        const purchasingImpact: PurchasingItem[] = (purchasingRes.data || []).map((row) => ({
          category: row.category || '',
          impact_level: row.impact_level || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        const influenceChannels: InfluenceItem[] = (influenceRes.data || []).map((row) => ({
          medium: row.medium || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        // Process Phase 3 data
        const ageGroupScores: AgeScoreItem[] = (ageScoresRes.data || []).map((row) => ({
          age: row.age || '',
          score: row.score || 0,
          social: row.social || 0,
          environment: row.environment || 0,
          year: row.year || 0,
        }));

        const prioritiesByAge: PriorityItem[] = (prioritiesRes.data || []).map((row) => ({
          age: row.age || '',
          english_label_short: row.english_label_short || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        const materialityAreas: MaterialityItem[] = (materialityRes.data || []).map((row) => ({
          materiality_area: row.materiality_area || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        const behaviourGroups: BehaviourItem[] = (behaviourRes.data || []).map((row) => ({
          behaviour_group: row.behaviour_group || '',
          percentage: row.percentage || 0,
          year: row.year || 0,
        }));

        setData({
          historicalScores,
          awarenessAttitude,
          competitors: competitorsData,
          discussionTopics,
          knowledgeLevels,
          purchasingImpact,
          influenceChannels,
          ageGroupScores,
          prioritiesByAge,
          materialityAreas,
          behaviourGroups,
          currentData,
        });
      } catch (err) {
        console.error('Error fetching brand intelligence:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandName, country]);

  // Calculate insights
  const insights = useMemo((): {
    trajectory: 'rising' | 'declining' | 'stable';
    trajectoryChange: number;
    peakYear: HistoricalScore | null;
    lowYear: HistoricalScore | null;
    volatilityLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    opportunities: string[];
  } => {
    const { historicalScores, currentData } = data;

    if (historicalScores.length < 2) {
      return {
        trajectory: 'stable',
        trajectoryChange: 0,
        peakYear: null,
        lowYear: null,
        volatilityLevel: 'medium',
        riskFactors: [],
        opportunities: [],
      };
    }

    // Calculate trajectory
    const recentScores = historicalScores.slice(-3);
    const oldScores = historicalScores.slice(-6, -3);
    const recentAvg = recentScores.reduce((a, b) => a + b.score, 0) / recentScores.length;
    const oldAvg = oldScores.length > 0 
      ? oldScores.reduce((a, b) => a + b.score, 0) / oldScores.length 
      : recentAvg;
    const trajectoryChange = recentAvg - oldAvg;

    const trajectory: 'rising' | 'declining' | 'stable' = trajectoryChange > 2 ? 'rising' : trajectoryChange < -2 ? 'declining' : 'stable';

    // Peak and low years
    const peak = historicalScores.reduce((a, b) => (a.score > b.score ? a : b));
    const low = historicalScores.reduce((a, b) => (a.score < b.score ? a : b));

    // Volatility level
    const volatilityLevel: 'low' | 'medium' | 'high' = currentData
      ? currentData.volatility < 3 ? 'low' : currentData.volatility > 6 ? 'high' : 'medium'
      : 'medium';

    // Risk factors
    const riskFactors: string[] = [];
    if (trajectory === 'declining') riskFactors.push('Declining score trajectory over past 3 years');
    if (volatilityLevel === 'high') riskFactors.push('High score volatility indicates inconsistent performance');
    if (currentData?.inflationPerformance && currentData.inflationPerformance < 0) {
      riskFactors.push('Negative inflation performance suggests brand struggling during economic uncertainty');
    }

    // Opportunities
    const opportunities: string[] = [];
    if (trajectory === 'rising') opportunities.push('Strong upward momentum - capitalize on growth');
    if (volatilityLevel === 'low') opportunities.push('Stable brand perception - good foundation for expansion');
    if (currentData?.inflationPerformance && currentData.inflationPerformance > 5) {
      opportunities.push('Outperforming during inflation - position as value leader');
    }

    return {
      trajectory,
      trajectoryChange,
      peakYear: peak,
      lowYear: low,
      volatilityLevel,
      riskFactors,
      opportunities,
    };
  }, [data]);

  return { data, loading, error, insights };
}
