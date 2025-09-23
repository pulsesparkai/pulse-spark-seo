import { AlertTriangle, FileX, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  count: number;
  type: "schema" | "content" | "technical";
  priority: "high" | "medium" | "low";
}

const issues: Issue[] = [
  { id: "1", title: "Schema Opportunities", count: 23, type: "schema", priority: "high" },
  { id: "2", title: "Content Gaps", count: 45, type: "content", priority: "medium" },
  { id: "3", title: "Technical Issues", count: 12, type: "technical", priority: "high" },
];

export function IssuesPanel() {
  const getIssueIcon = (type: Issue["type"]) => {
    switch (type) {
      case "schema":
        return <FileX className="h-5 w-5" />;
      case "content":
        return <AlertTriangle className="h-5 w-5" />;
      case "technical":
        return <Wrench className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "high":
        return "text-status-error bg-status-surface border-l-4 border-l-status-error";
      case "medium":
        return "text-status-warning bg-status-surface border-l-4 border-l-status-warning";
      case "low":
        return "text-status-success bg-status-surface border-l-4 border-l-status-success";
    }
  };

  return (
    <div className="bg-gradient-card border border-metric-card-border rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Issues & Opportunities</h3>
          <p className="text-sm text-muted-foreground">Areas for SEO improvement</p>
        </div>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info('Opening full issues report...')}>
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div 
            key={issue.id} 
            className={`
              p-4 rounded-lg transition-all duration-300 hover:shadow-sm cursor-pointer
              animate-fade-up ${getPriorityColor(issue.priority)}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dashboard-surface">
                  {getIssueIcon(issue.type)}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{issue.title}</h4>
                  <p className="text-xs opacity-75">
                    {issue.count} {issue.count === 1 ? 'issue' : 'issues'} found
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{issue.count}</div>
                <div className="text-xs opacity-75 capitalize">{issue.priority} priority</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}