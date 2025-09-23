import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Citation {
  id: string;
  engine: string;
  action: 'cited' | 'lost';
  content: string;
  timestamp: Date;
  impact?: string;
}

const citationEvents: Omit<Citation, 'id' | 'timestamp'>[] = [
  {
    engine: 'ChatGPT',
    action: 'cited',
    content: 'just recommended you for "enterprise CRM"',
    impact: '+15 potential customers'
  },
  {
    engine: 'Claude',
    action: 'cited',
    content: 'referenced your API docs',
    impact: '+8% developer queries'
  },
  {
    engine: 'Perplexity',
    action: 'cited',
    content: 'quoted your FAQ in pricing comparison',
    impact: '+12 qualified leads'
  },
  {
    engine: 'ChatGPT',
    action: 'lost',
    content: 'Competitor cited instead for "CRM comparison"',
    impact: '-5 potential customers'
  },
  {
    engine: 'Gemini',
    action: 'cited',
    content: 'featured your integration guide',
    impact: '+6% technical queries'
  }
];

export function CitationFeed() {
  const [citations, setCitations] = useState<Citation[]>([]);

  useEffect(() => {
    // Initialize with some recent citations
    const initialCitations = citationEvents.slice(0, 3).map((event, index) => ({
      ...event,
      id: `initial-${index}`,
      timestamp: new Date(Date.now() - index * 2 * 60 * 1000) // 2 minutes apart
    }));
    
    setCitations(initialCitations);

    // Add new citations periodically
    const interval = setInterval(() => {
      const randomEvent = citationEvents[Math.floor(Math.random() * citationEvents.length)];
      const newCitation: Citation = {
        ...randomEvent,
        id: `citation-${Date.now()}`,
        timestamp: new Date()
      };
      
      setCitations(prev => [newCitation, ...prev.slice(0, 9)]); // Keep only 10 most recent
      
      // Show toast notification
      if (randomEvent.action === 'cited') {
        toast.success(`🎉 New Citation: ${randomEvent.engine} ${randomEvent.content}`, {
          duration: 4000,
        });
      } else {
        toast.error(`⚠️ Lost Citation: ${randomEvent.content}`, {
          duration: 4000,
        });
      }
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const getEngineColor = (engine: string) => {
    const colors: Record<string, string> = {
      'ChatGPT': 'text-ai-chatgpt',
      'Claude': 'text-ai-claude',
      'Perplexity': 'text-ai-perplexity',
      'Gemini': 'text-ai-gemini',
      'DeepSeek': 'text-ai-deepseek'
    };
    return colors[engine] || 'text-foreground';
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Live ticker */}
      <Card className="p-3 bg-gradient-to-r from-citation-high/10 to-ai-chatgpt/10 border-citation-high/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-citation-high rounded-full animate-pulse" />
            <span className="text-sm font-medium">LIVE CITATIONS:</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-pulse-slow text-sm">
              ChatGPT cited your pricing page • Claude referenced API docs • Perplexity quoted FAQ
            </div>
          </div>
        </div>
      </Card>

      {/* Recent citations */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4" />
          <h3 className="font-semibold">Real-time Citation Activity</h3>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {citations.map((citation) => (
            <div key={citation.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                citation.action === 'cited' ? 'bg-citation-high' : 'bg-citation-low'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium text-sm ${getEngineColor(citation.engine)}`}>
                    {citation.engine}
                  </span>
                  <Badge variant={citation.action === 'cited' ? 'default' : 'destructive'} className="text-xs">
                    {citation.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatTimeAgo(citation.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-foreground mb-1">{citation.content}</p>
                
                {citation.impact && (
                  <div className="flex items-center gap-1">
                    {citation.action === 'cited' ? (
                      <TrendingUp className="h-3 w-3 text-citation-high" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-citation-low" />
                    )}
                    <span className={`text-xs ${
                      citation.action === 'cited' ? 'text-citation-high' : 'text-citation-low'
                    }`}>
                      {citation.impact}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}