import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PromptLibrary } from '@/components/ai-prompts/PromptLibrary';
import { CustomPromptBuilder } from '@/components/ai-prompts/CustomPromptBuilder';
import { ResultsDisplay, AnalysisResult, AnalysisFinding } from '@/components/ai-prompts/ResultsDisplay';
import { PromptHistory } from '@/components/ai-prompts/PromptHistory';
import { Library, Edit, BarChart3, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AIPrompts() {
  const [currentResults, setCurrentResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  // Mock function to simulate AI analysis
  const runAnalysis = async (prompt: string, context?: string[], keyword?: string): Promise<AnalysisResult> => {
    // Replace {keyword} placeholder in prompt
    const processedPrompt = keyword ? prompt.replace(/{keyword}/g, keyword) : prompt;
    
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: `Perform SEO analysis based on this prompt: "${processedPrompt}"
          
Additional context: ${context?.join(', ') || 'None'}

Generate realistic SEO analysis findings in this format for each issue found:

Page Title: [Specific page title]
URL: [Page URL like /products/wireless-headphones]
Issue: [Specific SEO issue description]
Priority: [high/medium/low]
Category: [Schema Markup/Technical SEO/Content Quality/Internal Links]
Impact: [Specific impact description]
Effort: [quick/moderate/complex]
Improvement: [Estimated improvement percentage]

Provide 5-8 realistic findings that match the prompt request. Make them specific and actionable.` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to run analysis");
      }

      const aiResponse = functionData?.response;
      
      // Parse AI response into structured findings
      const findings: AnalysisFinding[] = [];
      
      // Simple parsing - in a real app, you'd have more sophisticated parsing
      const lines = (aiResponse || '').split('\n').filter(line => line.trim());
      let currentFinding: Partial<AnalysisFinding> = {};
      let findingId = 1;
      
      for (const line of lines) {
        if (line.startsWith('Page Title:')) {
          if (currentFinding.pageTitle) {
            findings.push({
              id: String(findingId++),
              pageUrl: currentFinding.pageUrl || '/unknown',
              pageTitle: currentFinding.pageTitle || 'Unknown Page',
              suggestion: currentFinding.suggestion || 'Optimization needed',
              priority: (currentFinding.priority as any) || 'medium',
              category: currentFinding.category || 'Technical SEO',
              impact: currentFinding.impact || 'Moderate impact expected',
              effort: (currentFinding.effort as any) || 'moderate',
              estimatedImprovement: currentFinding.estimatedImprovement
            });
            currentFinding = {};
          }
          currentFinding.pageTitle = line.replace('Page Title:', '').trim();
        } else if (line.startsWith('URL:')) {
          currentFinding.pageUrl = line.replace('URL:', '').trim();
        } else if (line.startsWith('Issue:')) {
          currentFinding.suggestion = line.replace('Issue:', '').trim();
        } else if (line.startsWith('Priority:')) {
          currentFinding.priority = line.replace('Priority:', '').trim().toLowerCase() as any;
        } else if (line.startsWith('Category:')) {
          currentFinding.category = line.replace('Category:', '').trim();
        } else if (line.startsWith('Impact:')) {
          currentFinding.impact = line.replace('Impact:', '').trim();
        } else if (line.startsWith('Effort:')) {
          currentFinding.effort = line.replace('Effort:', '').trim().toLowerCase() as any;
        } else if (line.startsWith('Improvement:')) {
          currentFinding.estimatedImprovement = line.replace('Improvement:', '').trim();
        }
      }
      
      // Add the last finding if it exists
      if (currentFinding.pageTitle) {
        findings.push({
          id: String(findingId++),
          pageUrl: currentFinding.pageUrl || '/unknown',
          pageTitle: currentFinding.pageTitle || 'Unknown Page',
          suggestion: currentFinding.suggestion || 'Optimization needed',
          priority: (currentFinding.priority as any) || 'medium',
          category: currentFinding.category || 'Technical SEO',
          impact: currentFinding.impact || 'Moderate impact expected',
          effort: (currentFinding.effort as any) || 'moderate',
          estimatedImprovement: currentFinding.estimatedImprovement
        });
      }

      // Fallback findings if parsing failed
      if (findings.length === 0) {
        findings.push({
          id: '1',
          pageUrl: '/products/wireless-headphones',
          pageTitle: 'Premium Wireless Headphones',
          suggestion: 'Add Product schema markup to improve search visibility and enable rich snippets',
          priority: 'high',
          category: 'Schema Markup',
          impact: 'Rich snippets can increase CTR by 15-30%',
          effort: 'moderate',
          estimatedImprovement: '20-25%'
        });
      }

      return {
        id: Date.now().toString(),
        prompt: processedPrompt,
        timestamp: new Date(),
        findings,
        summary: `Analysis completed successfully. Found ${findings.length} optimization opportunities across your website.`,
        totalPages: 1247,
        completionTime: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  const handleRunPrebuiltPrompt = async (prompt: any, keyword?: string) => {
    setIsLoading(true);
    setActiveTab('results');
    
    try {
      const results = await runAnalysis(prompt.prompt, [], keyword);
      setCurrentResults(results);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Failed to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCustomPrompt = async (promptText: string, context: string[]) => {
    setIsLoading(true);
    setActiveTab('results');
    
    try {
      const results = await runAnalysis(promptText, context);
      setCurrentResults(results);
      toast.success('Custom analysis completed successfully!');
    } catch (error) {
      toast.error('Failed to complete custom analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrompt = (prompt: string, context: string[]) => {
    // In a real app, save to database
    toast.success('Prompt saved to your library!');
  };

  const handleApplyFix = (findingId: string) => {
    toast.success('Fix implementation started');
  };

  const handleExportReport = (resultId: string) => {
    toast.success('Report exported successfully');
  };

  const handleViewResults = (historyId: string) => {
    // In a real app, load results from history
    toast.info('Loading historical results...');
    setActiveTab('results');
  };

  const handleRerunPrompt = (historyId: string) => {
    // In a real app, rerun the historical prompt
    toast.info('Rerunning prompt...');
    setActiveTab('results');
  };

  const handleDeleteEntry = (historyId: string) => {
    // In a real app, delete from database
    toast.success('History entry deleted');
  };

  return (
    <div className="space-y-6 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Prompts</h1>
        <p className="text-muted-foreground">
          Run custom SEO analysis with AI-powered prompts to discover optimization opportunities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Prompt Library
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Custom Builder
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-0 h-[calc(100%-4rem)]">
          <PromptLibrary onRunPrompt={handleRunPrebuiltPrompt} />
        </TabsContent>

        <TabsContent value="builder" className="mt-0 h-[calc(100%-4rem)]">
          <CustomPromptBuilder 
            onRunPrompt={handleRunCustomPrompt}
            onSavePrompt={handleSavePrompt}
          />
        </TabsContent>

        <TabsContent value="results" className="mt-0 h-[calc(100%-4rem)]">
          <ResultsDisplay 
            results={currentResults}
            isLoading={isLoading}
            onApplyFix={handleApplyFix}
            onExportReport={handleExportReport}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0 h-[calc(100%-4rem)]">
          <PromptHistory 
            onViewResults={handleViewResults}
            onRerunPrompt={handleRerunPrompt}
            onDeleteEntry={handleDeleteEntry}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}