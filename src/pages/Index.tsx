import { 
  TrendingUp, 
  Globe, 
  Database, 
  Award,
  DollarSign,
  AlertTriangle,
  Info
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AIEngineVisibility } from "@/components/dashboard/AIEngineVisibility";
import { CitationFeed } from "@/components/dashboard/CitationFeed";
import { ROICalculator } from "@/components/dashboard/ROICalculator";
import { CompetitorChart } from "@/components/dashboard/CompetitorChart";
import { CompetitiveIntelligence } from "@/components/dashboard/CompetitiveIntelligence";
import { PricingTiers } from "@/components/dashboard/PricingTiers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HowItWorksModal } from "@/components/shared/HowItWorksModal";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AEO Command Center</h1>
        <p className="text-muted-foreground">Monitor your Answer Engine Optimization performance and AI citation opportunities</p>
      </div>

      {/* Critical Alert Banner */}
      <Card className="p-4 bg-destructive/10 border-destructive/20 border-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
            <div>
              <span className="font-bold text-destructive text-lg">
                ⚠️ You're losing $47,000/month from missed AI citations
              </span>
              <div className="text-sm text-destructive/80 mt-1">
                14 competitors already optimizing for AI • First-mover advantage expires in 6 months
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <HowItWorksModal 
              context="general"
              trigger={
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  What is AEO?
                </Button>
              }
            />
            <Button variant="destructive" size="sm">Fix Now - Save $47K</Button>
          </div>
        </div>
      </Card>

      {/* AI Engine Visibility */}
      <AIEngineVisibility />

      {/* Live Citation Ticker */}
      <Card className="p-3 bg-gradient-to-r from-citation-high/10 to-ai-chatgpt/10 border-citation-high/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-citation-high rounded-full animate-pulse" />
            <span className="text-sm font-bold">LIVE:</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-pulse-slow text-sm">
              ChatGPT just cited your pricing page • Claude referenced API docs • Perplexity quoted FAQ • +$3,400 revenue impact
            </div>
          </div>
        </div>
      </Card>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="AEO Readiness Score"
          value="87"
          suffix="%"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="AI Citations This Month"
          value="1,247"
          icon={Globe}
          trend={{ value: 23, isPositive: true }}
          delay={150}
        />
        <MetricCard
          title="AI Engine Coverage"
          value="4/5"
          icon={Database}
          trend={{ value: 1, isPositive: true }}
          delay={300}
        />
        <MetricCard
          title="Revenue from AI Citations"
          value="$47K"
          suffix="/mo"
          icon={DollarSign}
          trend={{ value: 28, isPositive: true }}
          delay={450}
        />
      </div>

      {/* Enhanced ROI Calculator - Prominent */}
      <Card className="p-6 bg-gradient-to-r from-citation-high/5 to-primary/5 border-citation-high/20">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Calculate Your AEO Opportunity</h2>
          <p className="text-muted-foreground">See how much revenue you're missing from AI citations</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-citation-high">50,000</div>
              <div className="text-sm text-muted-foreground">Monthly Searches</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-citation-high">30,000</div>
              <div className="text-sm text-muted-foreground">AI Queries (60%)</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-citation-high">1,500</div>
              <div className="text-sm text-muted-foreground">Current Citations (5%)</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-destructive">$143K</div>
              <div className="text-sm text-muted-foreground">Monthly Opportunity</div>
            </div>
          </div>
          <ROICalculator />
        </div>
      </Card>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CitationFeed />
          <CompetitiveIntelligence />
        </div>
        
        <div className="space-y-6">
          <CompetitorChart />
          <PricingTiers />
        </div>
      </div>

      {/* Urgency Elements */}
      <Card className="p-4 bg-muted/50">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>Every day without AEO costs you $1,500</strong> • 14 competitors already optimizing for AI
          </p>
          <p className="text-xs text-muted-foreground">
            We track citations using public APIs, synthetic queries, and traffic analysis. No private user data accessed.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Index;
