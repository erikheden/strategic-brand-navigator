import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  ChartConfiguration, 
  ChartConversationMessage, 
  ChartMakerState,
  ChartGeneratorResponse,
} from '@/types/chart-maker';

export function useChartMaker() {
  const [state, setState] = useState<ChartMakerState>({
    messages: [],
    currentChart: null,
    isGenerating: false,
    error: null,
    generatedCharts: [],
  });

  const generateChart = useCallback(async (
    userMessage: string,
    context?: {
      selectedCountry?: string;
      selectedBrand?: string;
      selectedIndustry?: string;
    }
  ) => {
    // Add user message
    const userMsg: ChartConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isGenerating: true,
      error: null,
    }));

    try {
      const { data, error } = await supabase.functions.invoke('chart-generator', {
        body: { userMessage, context },
      });

      if (error) throw error;

      const response = data as ChartGeneratorResponse;

      // Add assistant message
      const assistantMsg: ChartConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.explanation || (response.success 
          ? 'I\'ve generated a chart based on your request.' 
          : response.error || 'Sorry, I couldn\'t generate a chart.'),
        timestamp: new Date(),
        chartConfig: response.configuration,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        currentChart: response.configuration || prev.currentChart,
        generatedCharts: response.configuration 
          ? [...prev.generatedCharts, response.configuration]
          : prev.generatedCharts,
        isGenerating: false,
        error: response.success ? null : response.error || null,
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate chart';
      
      const errorMsg: ChartConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
        isGenerating: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const clearConversation = useCallback(() => {
    setState({
      messages: [],
      currentChart: null,
      isGenerating: false,
      error: null,
      generatedCharts: [],
    });
  }, []);

  const setCurrentChart = useCallback((chart: ChartConfiguration | null) => {
    setState(prev => ({ ...prev, currentChart: chart }));
  }, []);

  return {
    ...state,
    generateChart,
    clearConversation,
    setCurrentChart,
  };
}
