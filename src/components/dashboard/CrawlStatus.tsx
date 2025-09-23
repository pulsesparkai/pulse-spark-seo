import { useEffect, useState } from "react";
import { Activity, Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CrawlItem {
  id: string;
  url: string;
  status: "crawling" | "completed" | "analyzing";
  progress: number;
}

export function CrawlStatus() {
  const [crawlItems, setCrawlItems] = useState<CrawlItem[]>([
    { id: "1", url: "homepage", status: "completed", progress: 100 },
    { id: "2", url: "product-pages", status: "crawling", progress: 67 },
    { id: "3", url: "blog-posts", status: "analyzing", progress: 45 },
    { id: "4", url: "category-pages", status: "crawling", progress: 23 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrawlItems(prev => prev.map(item => {
        if (item.status === "crawling" && item.progress < 100) {
          const newProgress = Math.min(item.progress + Math.random() * 15, 100);
          return {
            ...item,
            progress: newProgress,
            status: newProgress >= 100 ? "completed" : "crawling"
          };
        }
        if (item.status === "analyzing" && item.progress < 100) {
          const newProgress = Math.min(item.progress + Math.random() * 8, 100);
          return {
            ...item,
            progress: newProgress,
            status: newProgress >= 100 ? "completed" : "analyzing"
          };
        }
        return item;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: CrawlItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-status-success" />;
      case "crawling":
        return <Activity className="h-4 w-4 text-status-warning animate-pulse" />;
      case "analyzing":
        return <Clock className="h-4 w-4 text-status-warning animate-pulse-slow" />;
    }
  };

  const getStatusText = (status: CrawlItem["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "crawling":
        return "Crawling...";
      case "analyzing":
        return "Analyzing...";
    }
  };

  return (
    <div className="bg-gradient-card border border-metric-card-border rounded-xl p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <Activity className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Real-time Crawl Status</h3>
          <p className="text-sm text-muted-foreground">Pages being analyzed right now</p>
        </div>
      </div>

      <div className="space-y-4">
        {crawlItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className="text-sm font-medium text-card-foreground">{item.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{Math.round(item.progress)}%</span>
                <span className="text-xs text-muted-foreground">{getStatusText(item.status)}</span>
              </div>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}