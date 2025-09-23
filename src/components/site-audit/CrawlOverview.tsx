import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe, FileText, Database, Link, Play, Pause } from 'lucide-react';
import { CrawlNetworkVisualization } from './CrawlNetworkVisualization';

interface CrawlStats {
  totalPages: number;
  currentPage: number;
  foundPages: number;
  categories: {
    name: string;
    progress: number;
    total: number;
    completed: number;
    icon: React.ElementType;
    color: string;
  }[];
}

export function CrawlOverview() {
  const [isRunning, setIsRunning] = useState(true);
  const [crawlStats, setCrawlStats] = useState<CrawlStats>({
    totalPages: 1247,
    currentPage: 234,
    foundPages: 1289,
    categories: [
      {
        name: 'Content Analysis',
        progress: 68,
        total: 1247,
        completed: 848,
        icon: FileText,
        color: 'bg-blue-500'
      },
      {
        name: 'Technical SEO',
        progress: 72,
        total: 1247,
        completed: 898,
        icon: Search,
        color: 'bg-green-500'
      },
      {
        name: 'Schema Markup',
        progress: 45,
        total: 1247,
        completed: 561,
        icon: Database,
        color: 'bg-purple-500'
      },
      {
        name: 'Internal Links',
        progress: 89,
        total: 1247,
        completed: 1110,
        icon: Link,
        color: 'bg-orange-500'
      }
    ]
  });

  // Simulate crawling progress
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCrawlStats(prev => {
        const newCurrentPage = Math.min(prev.currentPage + Math.floor(Math.random() * 3) + 1, prev.totalPages);
        const progressIncrement = Math.random() * 2;

        return {
          ...prev,
          currentPage: newCurrentPage,
          foundPages: prev.foundPages + Math.floor(Math.random() * 2),
          categories: prev.categories.map(cat => ({
            ...cat,
            progress: Math.min(cat.progress + progressIncrement * 0.5, 100),
            completed: Math.min(cat.completed + Math.floor(progressIncrement * 5), cat.total)
          }))
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Site Audit in Progress</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your website's SEO performance</p>
        </div>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause Audit
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Resume Audit
            </>
          )}
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pages Analyzed</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold animate-count-up">{crawlStats.currentPage.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">of {crawlStats.totalPages.toLocaleString()}</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Globe className="absolute inset-0 m-auto h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={(crawlStats.currentPage / crawlStats.totalPages) * 100} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="animate-pulse">
                    {isRunning ? 'Crawling' : 'Paused'}
                  </Badge>
                  {isRunning && (
                    <span className="text-sm text-muted-foreground">
                      Analyzing page {crawlStats.currentPage}...
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Found {crawlStats.foundPages.toLocaleString()} pages to analyze
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Completion</p>
              <div className="text-2xl font-bold mt-1">
                {isRunning ? Math.ceil((crawlStats.totalPages - crawlStats.currentPage) / 10) : '--'} min
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Based on current crawl speed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Analysis Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crawlStats.categories.map((category, index) => (
              <div 
                key={category.name} 
                className="space-y-3 animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {category.completed} / {category.total} pages
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{Math.round(category.progress)}%</span>
                    <span className="text-muted-foreground">
                      {category.total - category.completed} remaining
                    </span>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Live Crawl Network Visualization</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CrawlNetworkVisualization />
        </CardContent>
      </Card>
    </div>
  );
}