import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Table schemas for AI context
const TABLE_SCHEMAS = {
  'SBI_Discussion_Topics': {
    columns: ['discussion_topic', 'percentage', 'year', 'country'],
    description: 'Trending discussion topics by percentage share per country and year',
  },
  'SBI Average Scores': {
    columns: ['country', 'year', 'score'],
    description: 'Market average SBI scores by country and year',
  },
  'SBI_Priorities_Age_Groups': {
    columns: ['age', 'english_label_short', 'percentage', 'year', 'country'],
    description: 'Consumer priorities by age group, country and year',
  },
  'SBI Ranking Positions 2025 only': {
    columns: ['Brand', 'Country', 'Industry', 'Rank', 'Score'],
    description: '2025 brand rankings with industry and position',
  },
  'SBI Ranking Scores 2011-2025': {
    columns: ['Brand', 'Country', 'Industry', 'Year', 'Score'],
    description: 'Historical brand scores from 2011-2025',
  },
  'SBI_Inflation_Stability_2025': {
    columns: ['brand', 'country', 'industry', 'score', 'rank', 'yoy_change', 'score_volatility'],
    description: 'Brand stability metrics including YoY change and volatility',
  },
  'SBI_Knowledge': {
    columns: ['term', 'percentage', 'year', 'country'],
    description: 'Consumer knowledge levels of sustainability terms',
  },
  'SBI_purchasing_decision_industries': {
    columns: ['category', 'impact', 'percentage', 'year', 'country', 'industry'],
    description: 'Sustainability impact on purchasing decisions by industry',
  },
  'materiality_areas__age_sbi': {
    columns: ['age', 'materiality_area', 'percentage', 'year', 'country'],
    description: 'Materiality areas importance by age group',
  },
  'materiality_areas_general_sbi': {
    columns: ['materiality_area', 'percentage', 'year', 'country'],
    description: 'General materiality areas importance',
  },
  'SBI_behaviour_groups': {
    columns: ['behaviour_group', 'percentage', 'year', 'country'],
    description: 'Consumer behaviour group segmentation',
  },
  'SBI_influences': {
    columns: ['medium', 'percentage', 'year', 'country'],
    description: 'Media influence channels for sustainability information',
  },
  'SB Ranking Scores 2019-2025 BY AGE': {
    columns: ['Brand', 'Country', 'age', 'Year', 'Score', 'Social', 'Environment'],
    description: 'Brand scores broken down by age group with social and environmental pillars',
  },
};

// Chart type recommendations based on data patterns
const CHART_RECOMMENDATIONS = {
  timeSeries: ['line', 'area'],
  comparison: ['bar', 'column'],
  distribution: ['pie', 'donut'],
  ranking: ['bar', 'column', 'funnel'],
  correlation: ['scatter', 'bubble'],
  composition: ['treemap', 'pie', 'stacked bar'],
  flow: ['sankey', 'funnel'],
  geographic: ['heatmap'],
  multiMetric: ['radar'],
};

interface ChartRequest {
  userMessage: string;
  context?: {
    selectedCountry?: string;
    selectedBrand?: string;
    selectedIndustry?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, context }: ChartRequest = await req.json();

    // Build schema context for AI
    const schemaContext = Object.entries(TABLE_SCHEMAS)
      .map(([table, info]) => `- ${table}: ${info.description}\n  Columns: ${info.columns.join(', ')}`)
      .join('\n');

    const chartTypesContext = Object.entries(CHART_RECOMMENDATIONS)
      .map(([pattern, types]) => `- ${pattern}: ${types.join(', ')}`)
      .join('\n');

    // Get OpenAI API key from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert data visualization assistant for the SB Index Brand Intelligence platform. Your job is to analyze user requests and generate chart configurations that visualize sustainability brand data.

Available database tables:
${schemaContext}

Chart type recommendations by data pattern:
${chartTypesContext}

User context:
- Selected Country: ${context?.selectedCountry || 'Not specified'}
- Selected Brand: ${context?.selectedBrand || 'Not specified'}
- Selected Industry: ${context?.selectedIndustry || 'Not specified'}

IMPORTANT RULES:
1. Only use tables and columns that exist in the schema above
2. Choose chart types appropriate for the data pattern
3. For time series data, use line or area charts
4. For comparisons, use bar or column charts
5. For distributions, use pie or donut charts
6. Apply filters based on user context when relevant
7. Keep chart titles concise and descriptive
8. Return JSON only, no markdown or explanation

Respond with a JSON object in this exact format:
{
  "success": true,
  "configuration": {
    "chartType": "line|bar|column|pie|donut|area|scatter|radar|treemap|heatmap|funnel|bubble",
    "title": "Chart Title",
    "subtitle": "Optional subtitle",
    "dataQuery": {
      "table": "table_name",
      "columns": ["column1", "column2"],
      "filters": {"column": "value"},
      "orderBy": {"column": "column_name", "ascending": true},
      "limit": 10
    },
    "xAxisField": "column_for_x",
    "yAxisField": "column_for_y",
    "seriesField": "optional_grouping_column",
    "colorSequence": "primary|sequential|diverging|categorical",
    "options": {
      "showLegend": true,
      "stacked": false,
      "xAxisTitle": "X Axis Label",
      "yAxisTitle": "Y Axis Label"
    }
  },
  "explanation": "Brief explanation of what the chart shows",
  "suggestedFollowups": ["Follow-up question 1", "Follow-up question 2"]
}

If the request is unclear or cannot be fulfilled, respond with:
{
  "success": false,
  "error": "Explanation of why the request cannot be fulfilled",
  "suggestedFollowups": ["Alternative question suggestions"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const aiResponse = await response.json();
    const chartConfig = JSON.parse(aiResponse.choices[0].message.content);

    return new Response(JSON.stringify(chartConfig), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Chart generator error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate chart configuration';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
