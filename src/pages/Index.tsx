import { 
  TrendingUp, 
  Globe, 
  Database, 
  Award,
  DollarSign
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AIEngineVisibility } from "@/components/dashboard/AIEngineVisibility";
import { CitationFeed } from "@/components/dashboard/CitationFeed";
import { ROICalculator } from "@/components/dashboard/ROICalculator";
import { CompetitorChart } from "@/components/dashboard/CompetitorChart";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AEO Dashboard</h1>
        <p className="text-muted-foreground">Monitor your Answer Engine Optimization performance and AI citation opportunities</p>
      </div>

      {/* AI Engine Visibility */}
      <AIEngineVisibility />

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
          title="AI Citations"
          value="1,247"
          icon={Globe}
          trend={{ value: 23, isPositive: true }}
          delay={150}
        />
        <MetricCard
          title="Coverage"
          value="4/5"
          icon={Database}
          trend={{ value: 1, isPositive: true }}
          delay={300}
        />
        <MetricCard
          title="Est. Revenue from AI"
          value="$47K"
          suffix="/mo"
          icon={DollarSign}
          trend={{ value: 28, isPositive: true }}
          delay={450}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CitationFeed />
          <ROICalculator />
        </div>
        
        <div className="space-y-6">
          <CompetitorChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
