import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Play, TestTube, Save, Sparkles, Database, TrendingUp, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContextOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface CustomPromptBuilderProps {
  onRunPrompt: (prompt: string, context: string[]) => void;
  onSavePrompt?: (prompt: string, context: string[]) => void;
}

export function CustomPromptBuilder({ onRunPrompt, onSavePrompt }: CustomPromptBuilderProps) {
  const [promptText, setPromptText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const [contextOptions, setContextOptions] = useState<ContextOption[]>([
    {
      id: 'competitors',
      label: 'Include competitor data',
      description: 'Analyze against top 3 competitors in your industry',
      icon: TrendingUp,
      enabled: false
    },
    {
      id: 'search_console',
      label: 'Include Search Console data',
      description: 'Use search performance and indexing data',
      icon: Database,
      enabled: false
    },
    {
      id: 'rankings',
      label: 'Include current rankings',
      description: 'Consider existing keyword positions',
      icon: ExternalLink,
      enabled: false
    }
  ]);

  const promptTemplates = [
    'Analyze my site for technical SEO issues that could impact rankings...',
    'Find opportunities to improve content quality on pages with low engagement...',
    'Identify pages that need better internal linking to boost authority...',
    'Suggest ways to optimize my site structure for better crawlability...',
    'Find content that could be expanded to target long-tail keywords...'
  ];

  const handleContextToggle = (optionId: string, checked: boolean) => {
    setContextOptions(prev => 
      prev.map(option => 
        option.id === optionId ? { ...option, enabled: checked } : option
      )
    );
  };

  const handleTestPrompt = async () => {
    if (!promptText.trim()) {
      toast.error('Please enter a prompt to test');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const enabledContext = contextOptions.filter(opt => opt.enabled).map(opt => opt.label);
      const contextString = enabledContext.length > 0 
        ? `Context to consider: ${enabledContext.join(', ')}`
        : 'No additional context selected';

      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: `Test this SEO analysis prompt for clarity and effectiveness:

Prompt: "${promptText}"
${contextString}

Please evaluate:
1. Is the prompt clear and specific enough?
2. What kind of results would this generate?
3. Any suggestions to improve the prompt?
4. Estimated analysis time and complexity

Provide a brief assessment and any recommendations for improvement.` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to test prompt");
      }

      const result = functionData?.response;
      if (result) {
        setTestResult(result);
        toast.success('Prompt test completed');
      }
    } catch (error) {
      console.error('Error testing prompt:', error);
      toast.error('Failed to test prompt. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunPrompt = async () => {
    if (!promptText.trim()) {
      toast.error('Please enter a prompt to run');
      return;
    }

    setIsRunning(true);

    try {
      const enabledContext = contextOptions.filter(opt => opt.enabled).map(opt => opt.id);
      await onRunPrompt(promptText, enabledContext);
    } catch (error) {
      console.error('Error running prompt:', error);
      toast.error('Failed to run prompt. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSavePrompt = () => {
    if (!promptText.trim()) {
      toast.error('Please enter a prompt to save');
      return;
    }

    const enabledContext = contextOptions.filter(opt => opt.enabled).map(opt => opt.id);
    onSavePrompt?.(promptText, enabledContext);
    toast.success('Prompt saved to your library');
  };

  const insertTemplate = (template: string) => {
    setPromptText(template);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Custom Prompt Builder</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-3 w-3" />
          AI-Powered Analysis
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Build Your Analysis Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt-text" className="text-sm font-medium mb-2 block">
                  Describe what you want to analyze
                </Label>
                <Textarea
                  id="prompt-text"
                  placeholder="Analyze my site for..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{promptText.length} characters</span>
                  <span>Be specific for better results</span>
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Start Templates</Label>
                <div className="space-y-2">
                  {promptTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => insertTemplate(template)}
                      className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Context Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contextOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={option.enabled}
                        onCheckedChange={(checked) => handleContextToggle(option.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Label 
                            htmlFor={option.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleTestPrompt}
              disabled={isTesting || !promptText.trim()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isTesting ? 'Testing...' : 'Test Prompt'}
            </Button>

            <Button
              onClick={handleSavePrompt}
              disabled={!promptText.trim()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Prompt
            </Button>

            <Button
              onClick={handleRunPrompt}
              disabled={isRunning || !promptText.trim()}
              className="flex items-center gap-2 flex-1"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Analysis...' : 'Run Analysis'}
            </Button>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prompt Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {testResult ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setTestResult(null)}
                    className="w-full"
                  >
                    Clear Results
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <TestTube className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Test your prompt to see how effective it is before running the full analysis.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Be specific about what you want to analyze</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Include the type of recommendations you need</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Mention your target audience or industry</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Use context options for comprehensive analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}