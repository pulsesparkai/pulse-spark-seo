import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, DollarSign, Target, Zap } from 'lucide-react';

interface AEOIssue {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedPages: number;
  affectedEngines: string[];
  citationIncrease: number;
  revenueImpact: number;
  fixAction: string;
}

const aeoIssues: AEOIssue[] = [
  {
    id: '1',
    type: 'critical',
    title: 'No clear answers for AI to cite',
    description: 'Content lacks direct, quotable answers that AI engines prefer',
    affectedPages: 147,
    affectedEngines: ['🤖 ChatGPT', '🔮 Claude', '🔍 Perplexity'],
    citationIncrease: 127,
    revenueImpact: 34000,
    fixAction: 'Add definition boxes and direct answers'
  },
  {
    id: '2',
    type: 'critical',
    title: 'Missing FAQ schema that Perplexity needs',
    description: 'FAQ pages lack structured data that Perplexity uses for citations',
    affectedPages: 23,
    affectedEngines: ['🔍 Perplexity', '💎 Gemini'],
    citationIncrease: 89,
    revenueImpact: 23000,
    fixAction: 'Implement FAQ schema markup'
  },
  {
    id: '3',
    type: 'high',
    title: 'Ambiguous content ChatGPT won\'t cite',
    description: 'Content structure is unclear and lacks the confidence AI needs',
    affectedPages: 67,
    affectedEngines: ['🤖 ChatGPT', '🎯 DeepSeek'],
    citationIncrease: 54,
    revenueImpact: 14000,
    fixAction: 'Restructure with clear headings and bullet points'
  },
  {
    id: '4',
    type: 'high',
    title: 'Missing statistics and data points',
    description: 'AI engines prefer content with concrete numbers and statistics',
    affectedPages: 89,
    affectedEngines: ['🔮 Claude', '🔍 Perplexity', '💎 Gemini'],
    citationIncrease: 72,
    revenueImpact: 19000,
    fixAction: 'Add supporting statistics and data'
  },
  {
    id: '5',
    type: 'medium',
    title: 'Outdated content Claude ignores',
    description: 'Old content without recent updates gets deprioritized',
    affectedPages: 134,
    affectedEngines: ['🔮 Claude'],
    citationIncrease: 31,
    revenueImpact: 8000,
    fixAction: 'Update with recent information'
  },
  {
    id: '6',
    type: 'medium',
    title: 'No code examples for technical queries',
    description: 'Developer-focused AI queries need practical code examples',
    affectedPages: 45,
    affectedEngines: ['🤖 ChatGPT', '🔮 Claude', '🎯 DeepSeek'],
    citationIncrease: 43,
    revenueImpact: 11000,
    fixAction: 'Add code snippets and examples'
  }
];

const getIssueColor = (type: string) => {
  switch (type) {
    case 'critical': return 'text-destructive border-destructive/20 bg-destructive/5';
    case 'high': return 'text-orange-600 border-orange-600/20 bg-orange-600/5';
    case 'medium': return 'text-yellow-600 border-yellow-600/20 bg-yellow-600/5';
    case 'low': return 'text-blue-600 border-blue-600/20 bg-blue-600/5';
    default: return 'text-muted-foreground border-muted/20 bg-muted/5';
  }
};

const getIssueBadgeVariant = (type: string) => {
  switch (type) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
};

export function AEOIssuesSection() {
  const totalRevenueImpact = aeoIssues.reduce((sum, issue) => sum + issue.revenueImpact, 0);
  const totalCitationIncrease = aeoIssues.reduce((sum, issue) => sum + issue.citationIncrease, 0);
  const criticalIssues = aeoIssues.filter(issue => issue.type === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-destructive/5 border-destructive/20">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold">Critical AEO Issues</h3>
          </div>
          <div className="text-3xl font-bold text-destructive mb-1">{criticalIssues}</div>
          <p className="text-sm text-muted-foreground">Blocking AI citations</p>
        </Card>

        <Card className="p-6 bg-citation-high/5 border-citation-high/20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-citation-high" />
            <h3 className="font-semibold">Citation Opportunity</h3>
          </div>
          <div className="text-3xl font-bold text-citation-high mb-1">+{totalCitationIncrease}</div>
          <p className="text-sm text-muted-foreground">per month potential</p>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Revenue at Risk</h3>
          </div>
          <div className="text-3xl font-bold text-primary mb-1">${(totalRevenueImpact / 1000).toFixed(0)}K</div>
          <p className="text-sm text-muted-foreground">monthly opportunity</p>
        </Card>
      </div>

      {/* Issues List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">AEO Issues</h2>
            <p className="text-sm text-muted-foreground">Issues preventing AI engines from citing your content</p>
          </div>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Auto-Fix All Critical
          </Button>
        </div>

        <div className="space-y-4">
          {aeoIssues.map((issue) => (
            <Card key={issue.id} className={`p-4 ${getIssueColor(issue.type)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getIssueBadgeVariant(issue.type)}>
                      {issue.type.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold">{issue.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{issue.affectedPages}</span>
                      <span className="text-muted-foreground">pages affected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-citation-high" />
                      <span className="font-medium text-citation-high">+{issue.citationIncrease}/mo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-primary" />
                      <span className="font-medium text-primary">+${(issue.revenueImpact / 1000).toFixed(0)}K/mo</span>
                    </div>
                  </div>

                  {/* Affected AI Engines */}
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Affected AI Engines:</div>
                    <div className="flex gap-1">
                      {issue.affectedEngines.map((engine, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {engine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Target className="h-3 w-3 mr-1" />
                    Generate Fix
                  </Button>
                  <div className="text-xs text-muted-foreground text-right">
                    {issue.fixAction}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">🚀 Quick Wins Available</h4>
              <p className="text-sm text-muted-foreground">Fix these 3 issues to gain +${(47000 / 1000).toFixed(0)}K/month in 14 days</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              <Button size="sm" className="bg-citation-high text-white">
                Start Quick Fixes
              </Button>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}