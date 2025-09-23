import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Zap, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface HowItWorksModalProps {
  trigger?: React.ReactNode;
  title?: string;
  context?: 'aeo' | 'audit' | 'content' | 'general';
}

const contextContent = {
  aeo: {
    title: 'How AEO Citation Flow Works',
    steps: [
      {
        icon: Target,
        title: 'Content Analysis',
        description: 'We analyze your website content to identify how well it answers common questions in your industry.'
      },
      {
        icon: Zap,
        title: 'AI Engine Simulation',
        description: 'We simulate how different AI engines (ChatGPT, Claude, Perplexity, etc.) would process and cite your content.'
      },
      {
        icon: TrendingUp,
        title: 'Citation Probability',
        description: 'Each page gets a citation probability score showing how likely each AI engine is to reference your content.'
      },
      {
        icon: CheckCircle,
        title: 'Optimization Recommendations',
        description: 'Get specific recommendations to improve your content for better AI citations and visibility.'
      }
    ]
  },
  audit: {
    title: 'How AEO Audit Works',
    steps: [
      {
        icon: Target,
        title: 'Site Crawling',
        description: 'Our crawler scans your entire website to understand your content structure and identify opportunities.'
      },
      {
        icon: Zap,
        title: 'AI-Ready Analysis',
        description: 'We analyze each page for AI optimization factors like structured data, clear answers, and authority signals.'
      },
      {
        icon: TrendingUp,
        title: 'Issue Detection',
        description: 'Identify critical issues preventing AI engines from understanding and citing your content.'
      },
      {
        icon: CheckCircle,
        title: 'Actionable Insights',
        description: 'Get prioritized recommendations with estimated impact on your AI citation potential.'
      }
    ]
  },
  content: {
    title: 'How Content Optimization Works',
    steps: [
      {
        icon: Target,
        title: 'Content Analysis',
        description: 'We analyze your existing content for AI optimization opportunities and gaps.'
      },
      {
        icon: Zap,
        title: 'Schema Generation',
        description: 'Automatically generate structured data markup to help AI engines understand your content better.'
      },
      {
        icon: TrendingUp,
        title: 'Meta Optimization',
        description: 'Optimize titles, descriptions, and meta tags specifically for AI engine visibility.'
      },
      {
        icon: CheckCircle,
        title: 'Performance Tracking',
        description: 'Monitor how your optimizations improve AI citation rates and visibility over time.'
      }
    ]
  },
  general: {
    title: 'How PulseSpark.ai Works',
    steps: [
      {
        icon: Target,
        title: 'Comprehensive Analysis',
        description: 'We analyze your website content, structure, and optimization for AI engine visibility.'
      },
      {
        icon: Zap,
        title: 'AI Engine Intelligence',
        description: 'Our platform understands how different AI engines work and what they look for when citing sources.'
      },
      {
        icon: TrendingUp,
        title: 'Strategic Optimization',
        description: 'Get data-driven recommendations to improve your content for better AI citations and traffic.'
      },
      {
        icon: CheckCircle,
        title: 'Measurable Results',
        description: 'Track your progress with detailed analytics and citation performance metrics.'
      }
    ]
  }
};

export function HowItWorksModal({ trigger, title, context = 'general' }: HowItWorksModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const content = contextContent[context];

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Info className="h-4 w-4 mr-2" />
      {title || 'How It Works'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {content.title}
          </DialogTitle>
          <DialogDescription>
            Understand how our AI optimization platform helps you get cited by AI engines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {content.steps.map((step, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground ml-11">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Got it
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Start Optimizing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}