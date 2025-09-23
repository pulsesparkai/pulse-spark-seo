import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, CheckCircle, Target, Users, Database, Link, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PrebuiltPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'keyword' | 'content' | 'technical' | 'linking' | 'schema';
  lastRun?: Date;
  findings?: number;
  estimatedTime: string;
  icon: React.ElementType;
}

const prebuiltPrompts: PrebuiltPrompt[] = [
  {
    id: '1',
    title: 'Find pages that could rank for [keyword]',
    description: 'Analyzes your existing content to identify pages that could be optimized to rank for specific target keywords.',
    prompt: 'Analyze the website content and identify existing pages that could be optimized to rank for the keyword "{keyword}". Look for pages with related content, similar topics, or partial keyword mentions. Provide specific recommendations for each page including content additions, optimization strategies, and ranking potential.',
    category: 'keyword',
    lastRun: new Date('2024-01-15'),
    findings: 12,
    estimatedTime: '2-3 min',
    icon: Target
  },
  {
    id: '2',
    title: 'Identify content gaps vs competitors',
    description: 'Compares your content against top competitors to find missing topics and content opportunities.',
    prompt: 'Compare the website content against top competitors in the same industry. Identify content gaps, missing topics, and opportunities where competitors have content but this site does not. Provide specific topic recommendations and content strategy suggestions.',
    category: 'content',
    lastRun: new Date('2024-01-10'),
    findings: 8,
    estimatedTime: '3-5 min',
    icon: Users
  },
  {
    id: '3',
    title: 'Suggest schema markup opportunities',
    description: 'Identifies pages that would benefit from structured data markup to improve search visibility.',
    prompt: 'Analyze all pages on the website and identify opportunities to implement schema markup. Look for product pages, articles, FAQs, reviews, events, and other content types that could benefit from structured data. Provide specific schema recommendations for each page type.',
    category: 'schema',
    estimatedTime: '1-2 min',
    icon: Database
  },
  {
    id: '4',
    title: 'Find internal linking opportunities',
    description: 'Discovers opportunities to improve internal linking structure and distribute page authority better.',
    prompt: 'Analyze the website internal linking structure and identify opportunities to improve it. Look for orphaned pages, pages that could benefit from more internal links, and opportunities to create topic clusters. Provide specific linking recommendations with anchor text suggestions.',
    category: 'linking',
    estimatedTime: '2-4 min',
    icon: Link
  },
  {
    id: '5',
    title: 'Generate FAQ content from existing pages',
    description: 'Extracts common questions and creates FAQ sections based on your existing content.',
    prompt: 'Analyze the existing content on the website and generate comprehensive FAQ content. Identify common questions that users might have based on the products, services, and information provided. Create question-answer pairs that could be added to improve user experience and SEO.',
    category: 'content',
    lastRun: new Date('2024-01-08'),
    findings: 15,
    estimatedTime: '1-3 min',
    icon: HelpCircle
  }
];

interface PromptLibraryProps {
  onRunPrompt: (prompt: PrebuiltPrompt, keyword?: string) => void;
}

export function PromptLibrary({ onRunPrompt }: PromptLibraryProps) {
  const [runningPrompts, setRunningPrompts] = useState<Set<string>>(new Set());
  const [keywordInputs, setKeywordInputs] = useState<Record<string, string>>({});

  const getCategoryConfig = (category: PrebuiltPrompt['category']) => {
    switch (category) {
      case 'keyword':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Keyword' };
      case 'content':
        return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Content' };
      case 'technical':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Technical' };
      case 'linking':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Linking' };
      case 'schema':
        return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Schema' };
    }
  };

  const handleRunPrompt = async (prompt: PrebuiltPrompt) => {
    if (runningPrompts.has(prompt.id)) return;

    // Check if prompt needs keyword input
    if (prompt.prompt.includes('{keyword}') && !keywordInputs[prompt.id]?.trim()) {
      toast.error('Please enter a keyword for this prompt');
      return;
    }

    setRunningPrompts(prev => new Set([...prev, prompt.id]));

    try {
      const keyword = keywordInputs[prompt.id] || '';
      await onRunPrompt(prompt, keyword);
    } catch (error) {
      console.error('Error running prompt:', error);
      toast.error('Failed to run prompt. Please try again.');
    } finally {
      setRunningPrompts(prev => {
        const newSet = new Set(prev);
        newSet.delete(prompt.id);
        return newSet;
      });
    }
  };

  const handleKeywordChange = (promptId: string, value: string) => {
    setKeywordInputs(prev => ({ ...prev, [promptId]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Prompt Library</h2>
        <Badge variant="outline" className="text-sm">
          {prebuiltPrompts.length} prompts available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prebuiltPrompts.map((prompt) => {
          const categoryConfig = getCategoryConfig(prompt.category);
          const Icon = prompt.icon;
          const isRunning = runningPrompts.has(prompt.id);
          const needsKeyword = prompt.prompt.includes('{keyword}');

          return (
            <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{prompt.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={categoryConfig.color}>
                    {categoryConfig.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Est. {prompt.estimatedTime}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Keyword input for prompts that need it */}
                {needsKeyword && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Target Keyword
                    </label>
                    <input
                      type="text"
                      placeholder="Enter keyword..."
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      value={keywordInputs[prompt.id] || ''}
                      onChange={(e) => handleKeywordChange(prompt.id, e.target.value)}
                    />
                  </div>
                )}

                {/* Last run info */}
                {prompt.lastRun && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last run: {prompt.lastRun.toLocaleDateString()}
                    </div>
                    {prompt.findings !== undefined && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        {prompt.findings} findings
                      </div>
                    )}
                  </div>
                )}

                {/* Run button */}
                <Button 
                  onClick={() => handleRunPrompt(prompt)}
                  disabled={isRunning}
                  className="w-full flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isRunning ? 'Running Analysis...' : 'Run on Site'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {prebuiltPrompts.filter(p => p.lastRun).length}
              </div>
              <div className="text-sm text-muted-foreground">Prompts Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {prebuiltPrompts.reduce((acc, p) => acc + (p.findings || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Findings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {new Set(prebuiltPrompts.map(p => p.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {prebuiltPrompts.length}
              </div>
              <div className="text-sm text-muted-foreground">Available Prompts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}