import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, TrendingUp, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentScores {
  readability: { score: string; value: number };
  keywordDensity: { score: string; value: number };
  semanticCoverage: { score: string; value: number };
}

interface AISuggestion {
  id: string;
  text: string;
  type: 'improvement' | 'addition' | 'correction';
  priority: 'high' | 'medium' | 'low';
}

export function ContentOptimizer() {
  const [content, setContent] = useState(`Welcome to our premium wireless headphones collection. 

Our latest model features advanced noise cancellation technology that blocks out 99% of external sounds, allowing you to focus on what matters most - your music, podcasts, or calls.

Key features include:
• 30-hour battery life with quick charge capability
• Premium leather comfort padding for extended wear
• Bluetooth 5.2 connectivity with multi-device pairing
• Crystal clear audio with enhanced bass response

Perfect for professionals, students, and music enthusiasts who demand the highest quality audio experience.`);

  const [scores, setScores] = useState<ContentScores>({
    readability: { score: 'B+', value: 82 },
    keywordDensity: { score: 'Good', value: 75 },
    semanticCoverage: { score: '78%', value: 78 }
  });

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      text: 'Add more detail about pricing and value proposition',
      type: 'addition',
      priority: 'high'
    },
    {
      id: '2', 
      text: 'Include FAQ section for common questions',
      type: 'addition',
      priority: 'medium'
    },
    {
      id: '3',
      text: 'Improve keyword distribution throughout content',
      type: 'improvement',
      priority: 'medium'
    },
    {
      id: '4',
      text: 'Add customer testimonials or social proof',
      type: 'addition',
      priority: 'high'
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Simulate real-time content analysis
  useEffect(() => {
    const analyzeContent = () => {
      const wordCount = content.split(' ').length;
      const sentences = content.split(/[.!?]+/).length;
      const avgWordsPerSentence = wordCount / sentences;

      // Calculate readability score based on content length and complexity
      const readabilityValue = Math.min(95, Math.max(40, 100 - (avgWordsPerSentence * 2)));
      const keywordDensityValue = Math.min(90, Math.max(30, wordCount > 100 ? 75 + Math.random() * 15 : 45));
      const semanticValue = Math.min(95, Math.max(50, wordCount > 150 ? 80 + Math.random() * 10 : 55));

      setScores({
        readability: {
          score: readabilityValue >= 80 ? 'A' : readabilityValue >= 70 ? 'B+' : readabilityValue >= 60 ? 'B' : 'C',
          value: readabilityValue
        },
        keywordDensity: {
          score: keywordDensityValue >= 80 ? 'Excellent' : keywordDensityValue >= 70 ? 'Good' : keywordDensityValue >= 60 ? 'Fair' : 'Poor',
          value: keywordDensityValue
        },
        semanticCoverage: {
          score: `${Math.round(semanticValue)}%`,
          value: semanticValue
        }
      });
    };

    const debounceTimer = setTimeout(analyzeContent, 500);
    return () => clearTimeout(debounceTimer);
  }, [content]);

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: `Enhance this content for better SEO and readability while maintaining its core message and tone. Focus on improving structure, adding relevant keywords naturally, and making it more engaging:

${content}

Please provide the enhanced version that addresses these priorities:
1. Better keyword integration
2. Improved readability and flow
3. More engaging language
4. Better structure with headers if needed` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to enhance content");
      }

      const enhancedContent = functionData?.response;
      if (enhancedContent) {
        setContent(enhancedContent);
        toast.success('Content enhanced successfully!');
      }
    } catch (error) {
      console.error('Error enhancing content:', error);
      toast.error('Failed to enhance content. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="h-4 w-4" />;
      case 'addition':
        return <CheckCircle className="h-4 w-4" />;
      case 'correction':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AISuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Content Editor */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Content Editor</h2>
          <Button
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
          </Button>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste your content here..."
          className="min-h-[400px] resize-none font-mono text-sm leading-relaxed"
        />

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Words: {content.split(' ').filter(word => word.length > 0).length}</span>
          <span>Characters: {content.length}</span>
          <span>Reading time: ~{Math.ceil(content.split(' ').length / 200)} min</span>
        </div>
      </div>

      {/* Scoring Sidebar */}
      <div className="space-y-6">
        {/* Real-time Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Readability</span>
                <Badge className={getScoreColor(scores.readability.value)}>
                  {scores.readability.score}
                </Badge>
              </div>
              <Progress value={scores.readability.value} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Keyword Density</span>
                <Badge className={getScoreColor(scores.keywordDensity.value)}>
                  {scores.keywordDensity.score}
                </Badge>
              </div>
              <Progress value={scores.keywordDensity.value} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Semantic Coverage</span>
                <Badge className={getScoreColor(scores.semanticCoverage.value)}>
                  {scores.semanticCoverage.score}
                </Badge>
              </div>
              <Progress value={scores.semanticCoverage.value} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">{suggestion.text}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={getPriorityColor(suggestion.priority)}
                        >
                          {suggestion.priority}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              Preview Result
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              SEO Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}