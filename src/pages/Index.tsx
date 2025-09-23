import { 
  TrendingUp, 
  Globe, 
  Database, 
  Award 
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CrawlStatus } from "@/components/dashboard/CrawlStatus";
import { IssuesPanel } from "@/components/dashboard/IssuesPanel";
import { CompetitorChart } from "@/components/dashboard/CompetitorChart";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">SEO Dashboard</h1>
        <p className="text-muted-foreground">Monitor your website's search performance and optimization opportunities</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="AI Readiness Score"
          value="87"
          suffix="%"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="Pages Indexed"
          value="1247"
          icon={Globe}
          trend={{ value: 8, isPositive: true }}
          delay={150}
        />
        <MetricCard
          title="Schema Coverage"
          value="64"
          suffix="%"
          icon={Database}
          trend={{ value: -3, isPositive: false }}
          delay={300}
        />
        <MetricCard
          title="Content Score"
          value="B+"
          icon={Award}
          trend={{ value: 15, isPositive: true }}
          delay={450}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CrawlStatus />
        </div>
        
        <div className="lg:col-span-1">
          <IssuesPanel />
        </div>
        
        <div className="lg:col-span-1">
          <CompetitorChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
