import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Target } from 'lucide-react';

interface CompetitorData {
  query: string;
  chatgpt: { rank: number; company: string; isYou?: boolean };
  claude: { rank: number; company: string; isYou?: boolean };
  perplexity: { rank: number; company: string; isYou?: boolean };
  yourRank: number;
  opportunity: string;
}

const competitorData: CompetitorData[] = [
  {
    query: "Best CRM software",
    chatgpt: { rank: 3, company: "Competitor A" },
    claude: { rank: 2, company: "You", isYou: true },
    perplexity: { rank: 1, company: "Competitor B" },
    yourRank: 2,
    opportunity: "Steal ChatGPT & Perplexity"
  },
  {
    query: "CRM pricing comparison",
    chatgpt: { rank: 1, company: "You", isYou: true },
    claude: { rank: 3, company: "Competitor A" },
    perplexity: { rank: 1, company: "You", isYou: true },
    yourRank: 1,
    opportunity: "Dominating ✓"
  },
  {
    query: "Enterprise CRM features",
    chatgpt: { rank: 4, company: "Competitor C" },
    claude: { rank: 5, company: "Competitor D" },
    perplexity: { rank: 2, company: "Competitor A" },
    yourRank: 5,
    opportunity: "Critical Gap - Fix Now"
  },
  {
    query: "CRM integration guide",
    chatgpt: { rank: 2, company: "You", isYou: true },
    claude: { rank: 1, company: "Competitor A" },
    perplexity: { rank: 3, company: "You", isYou: true },
    yourRank: 2,
    opportunity: "Beat Claude for #1"
  }
];

export function CompetitiveIntelligence() {
  const getEngineIcon = (engine: string) => {
    const icons: Record<string, string> = {
      'ChatGPT': '🤖',
      'Claude': '🔮',
      'Perplexity': '🔍'
    };
    return icons[engine] || '🤖';
  };

  const getRankBadge = (rank: number, isYou?: boolean) => {
    if (isYou) {
      return <Badge variant="default" className="bg-citation-high text-white">#{rank} ✓</Badge>;
    }
    if (rank <= 2) {
      return <Badge variant="destructive">#{rank}</Badge>;
    }
    return <Badge variant="secondary">#{rank}</Badge>;
  };

  const getOpportunityColor = (opportunity: string) => {
    if (opportunity.includes('Dominating')) return 'text-citation-high';
    if (opportunity.includes('Critical')) return 'text-destructive';
    return 'text-primary';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Competitive Intelligence</h3>
          <p className="text-sm text-muted-foreground">Who AI Engines Prefer</p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Full Report
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Query</TableHead>
              <TableHead className="text-center">🤖 ChatGPT</TableHead>
              <TableHead className="text-center">🔮 Claude</TableHead>
              <TableHead className="text-center">🔍 Perplexity</TableHead>
              <TableHead className="text-center">Your Rank</TableHead>
              <TableHead>Action Required</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitorData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.query}</TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1">
                    {getRankBadge(row.chatgpt.rank, row.chatgpt.isYou)}
                    <div className="text-xs text-muted-foreground">
                      {row.chatgpt.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1">
                    {getRankBadge(row.claude.rank, row.claude.isYou)}
                    <div className="text-xs text-muted-foreground">
                      {row.claude.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1">
                    {getRankBadge(row.perplexity.rank, row.perplexity.isYou)}
                    <div className="text-xs text-muted-foreground">
                      {row.perplexity.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={row.yourRank <= 2 ? "default" : "destructive"}>
                    #{row.yourRank}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getOpportunityColor(row.opportunity)}`}>
                      {row.opportunity}
                    </span>
                    {!row.opportunity.includes('Dominating') && (
                      <Button variant="outline" size="sm">
                        <Target className="h-3 w-3 mr-1" />
                        Fix
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">🎯 Quick Wins Available</p>
            <p className="text-xs text-muted-foreground">3 queries where you can easily beat competitors</p>
          </div>
          <Button size="sm" className="bg-citation-high text-white">
            Steal These Citations
          </Button>
        </div>
      </div>
    </Card>
  );
}