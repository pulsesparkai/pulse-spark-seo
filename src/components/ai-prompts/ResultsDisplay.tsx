import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

export interface AnalysisFinding {
  id: string;
  pageUrl: string;
  pageTitle: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  impact: string;
  effort: 'quick' | 'moderate' | 'complex';
  estimatedImprovement?: string;
}

export interface AnalysisResult {
  id: string;
  prompt: string;
  timestamp: Date;
  findings: AnalysisFinding[];
  summary: string;
  totalPages: number;
  completionTime: string;
}

interface ResultsDisplayProps {
  results: AnalysisResult | null;
  isLoading?: boolean;
  onApplyFix?: (findingId: string) => void;
  onExportReport?: (resultId: string) => void;
}

export function ResultsDisplay({ results, isLoading, onApplyFix, onExportReport }: ResultsDisplayProps) {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Running Analysis...</h3>
          <p className="text-muted-foreground">This may take a few minutes depending on your site size</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
          <p className="text-muted-foreground">Run a prompt from the library or create a custom analysis to see results here</p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityConfig = (priority: AnalysisFinding['priority']) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 'low':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
    }
  };

  const getEffortBadge = (effort: AnalysisFinding['effort']) => {
    switch (effort) {
      case 'quick':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'complex':
        return 'bg-red-100 text-red-800';
    }
  };

  const getFilteredFindings = () => {
    return results.findings.filter(finding => {
      const priorityMatch = selectedPriority === 'all' || finding.priority === selectedPriority;
      const categoryMatch = selectedCategory === 'all' || finding.category === selectedCategory;
      return priorityMatch && categoryMatch;
    });
  };

  const getUniqueCategories = () => {
    const categories = results.findings.map(f => f.category);
    return Array.from(new Set(categories));
  };

  const getPriorityCount = (priority: AnalysisFinding['priority']) => {
    return results.findings.filter(f => f.priority === priority).length;
  };

  const handleApplyFix = (findingId: string) => {
    onApplyFix?.(findingId);
    toast.success('Fix applied successfully');
  };

  const handleExportReport = () => {
    onExportReport?.(results.id);
    toast.success('Report exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">Analysis Results</CardTitle>
              <p className="text-sm text-muted-foreground mb-3">{results.prompt}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {results.timestamp.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {results.totalPages} pages analyzed
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Completed in {results.completionTime}
                </div>
              </div>
            </div>
            
            <Button onClick={handleExportReport} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        
        {results.summary && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
              <p className="text-sm text-blue-800">{results.summary}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="text-sm border border-input rounded-md px-2 py-1"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border border-input rounded-md px-2 py-1"
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Badge className="bg-red-100 text-red-800">
            High: {getPriorityCount('high')}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800">
            Medium: {getPriorityCount('medium')}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            Low: {getPriorityCount('low')}
          </Badge>
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-4">
        {getFilteredFindings().map((finding) => {
          const priorityConfig = getPriorityConfig(finding.priority);
          const PriorityIcon = priorityConfig.icon;

          return (
            <Card key={finding.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${priorityConfig.color}`}>
                      <PriorityIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{finding.pageTitle}</h3>
                        <Badge className={priorityConfig.badgeColor}>
                          {finding.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getEffortBadge(finding.effort)}>
                          {finding.effort} fix
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{finding.pageUrl}</p>
                      <p className="text-sm mb-3">{finding.suggestion}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-medium">Category: {finding.category}</span>
                        <span>{finding.impact}</span>
                        {finding.estimatedImprovement && (
                          <span className="text-green-600 font-medium">
                            Est. improvement: {finding.estimatedImprovement}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleApplyFix(finding.id)}
                      size="sm"
                      variant="outline"
                    >
                      Apply Fix
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {getFilteredFindings().length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
            <p className="text-muted-foreground">
              {selectedPriority !== 'all' || selectedCategory !== 'all' 
                ? 'No findings match the current filters.' 
                : 'Great! No issues were found in this analysis.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}