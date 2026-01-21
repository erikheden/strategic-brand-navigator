import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Send, Trash2, Loader2, Lightbulb } from 'lucide-react';
import { useChartMaker } from '@/hooks/useChartMaker';
import { useChartData } from '@/hooks/useChartData';
import { BrandChart } from '@/components/charts/BrandChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const ChartMaker = () => {
  const { messages, currentChart, isGenerating, error, generateChart, clearConversation, setCurrentChart } = useChartMaker();
  const { data: chartSeries, categories, isLoading: dataLoading } = useChartData(currentChart);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;
    const userInput = inputValue;
    setInputValue('');
    
    const response = await generateChart(userInput);
    
    // The chart config is automatically set in state by the hook
    // useChartData will automatically fetch when currentChart changes
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Show me brand scores over time for Sweden",
    "Compare top 10 brands by score in 2025",
    "What are the trending discussion topics?",
    "Show behaviour groups distribution",
    "Compare media influence channels",
    "Show sustainability knowledge levels",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  AI Chart Maker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Describe the chart you want and AI will create it
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Chat Interface */}
          <Card className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Chart Assistant
                  </CardTitle>
                  <CardDescription>Describe what you want to visualize</CardDescription>
                </div>
                {messages.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={clearConversation}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Tell me what chart you'd like to create. I can visualize brand scores, trends, distributions, and more.
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Try these:</p>
                    {suggestedPrompts.map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setInputValue(prompt)}
                      >
                        "{prompt}"
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        {msg.chartConfig && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            Chart: {msg.chartConfig.chartType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the chart you want..."
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isGenerating}
                  size="icon"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Right Column: Chart Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Chart Preview
                </CardTitle>
                <CardDescription>
                  {currentChart ? currentChart.title : 'Your chart will appear here'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : currentChart && chartSeries.length > 0 ? (
                  <BrandChart
                    type={currentChart.chartType as any}
                    series={chartSeries}
                    categories={categories}
                    title={currentChart.title}
                    subtitle={currentChart.subtitle}
                    options={{
                      xAxis: { title: { text: currentChart.options?.xAxisTitle } },
                      yAxis: { title: { text: currentChart.options?.yAxisTitle } },
                    }}
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Start a conversation to generate a chart</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart Configuration Details */}
            {currentChart && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline" className="ml-2">{currentChart.chartType}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Table:</span>
                      <Badge variant="outline" className="ml-2">{currentChart.dataQuery.table}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">X-Axis:</span>
                      <span className="ml-2 font-mono text-xs">{currentChart.xAxisField}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Y-Axis:</span>
                      <span className="ml-2 font-mono text-xs">{currentChart.yAxisField}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartMaker;
