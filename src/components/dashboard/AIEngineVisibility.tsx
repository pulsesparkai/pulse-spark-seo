import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AIEngine {
  name: string;
  logo: string;
  color: string;
  citationScore: number;
  citations: number;
  trend: { value: number; isPositive: boolean };
  sparklineData: number[];
}

const aiEngines: AIEngine[] = [
  {
    name: 'ChatGPT',
    logo: '🤖',
    color: 'ai-chatgpt',
    citationScore: 92,
    citations: 47,
    trend: { value: 15, isPositive: true },
    sparklineData: [20, 35, 40, 47, 52, 47]
  },
  {
    name: 'Claude',
    logo: '🔮',
    color: 'ai-claude',
    citationScore: 87,
    citations: 34,
    trend: { value: 8, isPositive: true },
    sparklineData: [25, 28, 32, 30, 34, 34]
  },
  {
    name: 'Perplexity',
    logo: '🔍',
    color: 'ai-perplexity',
    citationScore: 76,
    citations: 28,
    trend: { value: -3, isPositive: false },
    sparklineData: [30, 32, 35, 31, 29, 28]
  },
  {
    name: 'Gemini',
    logo: '💎',
    color: 'ai-gemini',
    citationScore: 68,
    citations: 19,
    trend: { value: 22, isPositive: true },
    sparklineData: [10, 12, 15, 16, 18, 19]
  },
  {
    name: 'DeepSeek',
    logo: '🎯',
    color: 'ai-deepseek',
    citationScore: 45,
    citations: 8,
    trend: { value: 5, isPositive: true },
    sparklineData: [5, 6, 7, 6, 7, 8]
  }
];

export function AIEngineVisibility() {
  const [animatedScores, setAnimatedScores] = useState<number[]>(aiEngines.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(aiEngines.map(engine => engine.citationScore));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const Sparkline = ({ data }: { data: number[] }) => (
    <svg width="60" height="20" className="inline-block ml-2">
      {data.map((point, index) => (
        <circle
          key={index}
          cx={index * 10 + 5}
          cy={20 - (point / Math.max(...data)) * 15}
          r="1.5"
          className="fill-current opacity-60"
        />
      ))}
      <polyline
        points={data.map((point, index) => 
          `${index * 10 + 5},${20 - (point / Math.max(...data)) * 15}`
        ).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-80"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Alert Bar */}
      <Card className="p-4 bg-destructive/10 border-destructive/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="font-medium text-destructive">
              🔴 You're losing $12,000/month from missed AI citations
            </span>
          </div>
          <Button variant="destructive" size="sm">Fix Now</Button>
        </div>
      </Card>

      {/* AI Engine Visibility */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Answer Engine Visibility</h2>
            <p className="text-muted-foreground">Track your citation performance across major AI engines</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Education
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>What is AEO?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>• 60% of searches now go through AI</p>
                <p>• Your content needs to be THE source AI trusts</p>
                <p>• We make that happen</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Answer Engine Optimization (AEO) is the future of search visibility.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {aiEngines.map((engine, index) => (
            <div key={engine.name} className="text-center space-y-3 p-4 rounded-lg border bg-card">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">{engine.logo}</span>
                <h3 className="font-medium text-sm">{engine.name}™</h3>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {animatedScores[index]}%
                </div>
                <div className="text-xs text-muted-foreground">Citation Score</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center text-sm">
                  <span className="font-medium">{engine.citations}</span>
                  <span className="text-muted-foreground ml-1">this week</span>
                  {engine.trend.isPositive ? (
                    <TrendingUp className="h-3 w-3 ml-1 text-citation-high" />
                  ) : (
                    <TrendingDown className="h-3 w-3 ml-1 text-citation-low" />
                  )}
                </div>
                <Sparkline data={engine.sparklineData} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}