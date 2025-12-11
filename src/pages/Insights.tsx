import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Trash2, Loader2 } from 'lucide-react';
import { useBrandData } from '@/hooks/useBrandData';
import { useInsightPresets, InsightResult } from '@/hooks/useInsightPresets';
import { useAIChat } from '@/hooks/useAIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const Insights = () => {
  const { brands, loading: brandsLoading } = useBrandData();
  const { presets, activePreset, results, loading: presetLoading, runPreset, clearResults } = useInsightPresets(brands);
  const { messages, isLoading: aiLoading, error: aiError, sendMessage, clearMessages } = useAIChat(brands);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim() || aiLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAnalyzePreset = () => {
    if (!activePreset || !results.length || aiLoading) return;
    const preset = presets.find(p => p.id === activePreset);
    sendMessage(
      `Analyze these ${preset?.name} results and provide strategic insights, patterns, and recommendations:`,
      results
    );
  };

  const suggestedQuestions = [
    "What are the most notable patterns across all brands?",
    "Which industries show the most volatility and why might that be?",
    "Compare the Nordic markets - what are the key differences?",
    "What brands should be watched closely in the next period?",
    "What strategic recommendations would you give for brands in the Danger Zone?",
  ];

  if (brandsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Brand Intelligence
                </h1>
                <p className="text-sm text-muted-foreground">
                  Discover patterns, risks, and opportunities across {brands.length} brands
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Presets & Results */}
          <div className="space-y-6">
            {/* Preset Buttons */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Analytical Presets</CardTitle>
                <CardDescription>Click to run pre-built strategic analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={activePreset === preset.id ? 'default' : 'outline'}
                      className="h-auto py-3 px-3 flex flex-col items-start gap-1"
                      onClick={() => runPreset(preset.id)}
                      disabled={presetLoading}
                    >
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-xs font-medium">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            {results.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {presets.find(p => p.id === activePreset)?.icon}
                        {presets.find(p => p.id === activePreset)?.name}
                      </CardTitle>
                      <CardDescription>{results.length} results</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAnalyzePreset}
                        disabled={aiLoading}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Analyze with AI
                      </Button>
                      <Button size="sm" variant="ghost" onClick={clearResults}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Brand</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Industry</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                          <TableHead>Highlight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              <Link
                                to={`/brand/${encodeURIComponent(result.brand)}/${result.country.split(',')[0].trim()}`}
                                className="hover:text-primary transition-colors"
                              >
                                {result.brand}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {result.country}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {result.industry}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {result.currentScore.toFixed(1)}
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-primary">{result.highlight}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: AI Chat */}
          <Card className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Brand Strategist
                  </CardTitle>
                  <CardDescription>Ask questions about brand performance</CardDescription>
                </div>
                {messages.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={clearMessages}>
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
                    Ask me anything about brand performance, trends, or strategic positioning.
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Suggested questions:</p>
                    {suggestedQuestions.map((q, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setInputValue(q);
                        }}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
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
                      </div>
                    </div>
                  ))}
                  {aiLoading && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.content && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {aiError && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {aiError}
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
                  placeholder="Ask about brand trends, patterns, risks..."
                  disabled={aiLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || aiLoading}
                  size="icon"
                >
                  {aiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Insights;
