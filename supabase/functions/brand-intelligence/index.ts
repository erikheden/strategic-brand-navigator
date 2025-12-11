import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert brand strategist and data analyst specializing in sustainability brand intelligence. You analyze brand performance data across multiple markets and provide actionable strategic insights.

You have access to brand data with these metrics:
- Current_Score: The brand's current sustainability perception score (0-100)
- Volatility: How much the brand's score fluctuates (lower = more stable)
- Trend_Slope: The direction and rate of score change (positive = improving, negative = declining)
- Inflation_Performance: How well the brand maintains perception during economic challenges

Strategic Quadrant Framework:
- "The Fortress" (High Stability + High Growth): Dominant brands with strong, improving reputation
- "The Challenger" (Low Stability + High Growth): Dynamic brands gaining ground but with inconsistent perception
- "The Sleeper" (High Stability + Low Growth): Stable but stagnant brands needing activation
- "Danger Zone" (Low Stability + Low Growth): At-risk brands requiring immediate attention

When analyzing data:
1. Look for patterns across markets and industries
2. Identify outliers and anomalies
3. Provide specific, actionable recommendations
4. Use data to support your insights
5. Be concise but thorough

Format your responses with clear headers, bullet points, and highlight key findings.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, brandData, analysisType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context based on analysis type
    let userPrompt = question;
    
    if (analysisType === 'preset' && brandData) {
      userPrompt = `Based on this brand data analysis:\n\n${JSON.stringify(brandData, null, 2)}\n\n${question}`;
    } else if (brandData) {
      // Include summary stats for context
      const stats = brandData.stats || {};
      const sampleBrands = brandData.sample || [];
      
      userPrompt = `Dataset Overview:
- Total brands: ${stats.totalBrands || 'N/A'}
- Countries: ${stats.countries?.join(', ') || 'N/A'}
- Industries: ${stats.industries?.join(', ') || 'N/A'}
- Average Score: ${stats.avgScore?.toFixed(1) || 'N/A'}
- Average Volatility: ${stats.avgVolatility?.toFixed(2) || 'N/A'}

Sample of brands (first 20):
${JSON.stringify(sampleBrands.slice(0, 20), null, 2)}

User Question: ${question}`;
    }

    console.log('Calling Lovable AI with question:', question.substring(0, 100));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: unknown) {
    console.error("brand-intelligence error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
