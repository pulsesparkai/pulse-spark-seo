import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Code, 
  TrendingUp,
  Sparkles,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditIssue {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'optimization';
  pageCount: number;
  category: string;
  impact: string;
  estimatedImprovement: string;
  affectedPages: {
    url: string;
    title: string;
    issue: string;
  }[];
  solution: {
    description: string;
    codeExample?: string;
    steps: string[];
  };
}

interface IssueCardProps {
  issue: AuditIssue;
  onGenerateFix?: (issueId: string) => void;
}

export function IssueCard({ issue, onGenerateFix }: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingFix, setIsGeneratingFix] = useState(false);
  const [generatedSolution, setGeneratedSolution] = useState<string | null>(null);

  const getPriorityConfig = (priority: AuditIssue['priority']) => {
    switch (priority) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'important':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'optimization':
        return {
          icon: CheckCircle2,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800 border-green-200'
        };
    }
  };

  const config = getPriorityConfig(issue.priority);
  const Icon = config.icon;

  const handleGenerateFix = async () => {
    setIsGeneratingFix(true);
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: `Generate a detailed fix for this SEO issue:

Issue: ${issue.title}
Description: ${issue.description}
Category: ${issue.category}
Affected Pages: ${issue.pageCount}

Please provide:
1. Step-by-step implementation guide
2. Code examples if applicable
3. Best practices to prevent this issue
4. Expected timeline for seeing results

Focus on actionable, technical instructions that a developer or SEO specialist can follow immediately.` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to generate fix");
      }

      const solution = functionData?.response;
      if (solution) {
        setGeneratedSolution(solution);
        toast.success('AI fix generated successfully!');
      }
    } catch (error) {
      console.error('Error generating fix:', error);
      toast.error('Failed to generate fix. Please try again.');
    } finally {
      setIsGeneratingFix(false);
    }
  };

  const handleFixAll = () => {
    toast.success(`Started fixing ${issue.title} across ${issue.pageCount} pages`);
    onGenerateFix?.(issue.id);
  };

  return (
    <Card className={`border-l-4 ${config.color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Icon className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{issue.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
              
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={config.badgeColor}>
                  {issue.priority.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium">
                  {issue.pageCount} pages affected
                </span>
                <Badge variant="outline" className="text-xs">
                  {issue.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {issue.estimatedImprovement}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleFixAll}>
              Fix All
            </Button>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Details
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            <Separator />
            
            {/* Impact & Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Expected Impact
                </h4>
                <p className="text-sm text-muted-foreground mb-4">{issue.impact}</p>
                
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  How to Fix
                </h4>
                <p className="text-sm text-muted-foreground mb-3">{issue.solution.description}</p>
                
                <div className="space-y-2">
                  {issue.solution.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI-Generated Solution
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateFix}
                    disabled={isGeneratingFix}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-3 w-3" />
                    {isGeneratingFix ? 'Generating...' : 'Generate Fix'}
                  </Button>
                </div>
                
                {generatedSolution ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {generatedSolution}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-muted-foreground text-center">
                    Click "Generate Fix" to get AI-powered solution recommendations
                  </div>
                )}
              </div>
            </div>

            {/* Code Example */}
            {issue.solution.codeExample && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code Example
                </h4>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{issue.solution.codeExample}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Affected Pages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Affected Pages ({issue.affectedPages.length})
                </h4>
                <Button variant="outline" size="sm">
                  Export List
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {issue.affectedPages.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                      <p className="text-xs text-red-600 mt-1">{page.issue}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {issue.affectedPages.length > 10 && (
                  <div className="text-center p-3">
                    <Button variant="ghost" size="sm">
                      View all {issue.affectedPages.length} pages
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}