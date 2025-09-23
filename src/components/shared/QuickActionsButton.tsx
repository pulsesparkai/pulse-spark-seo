import { useState } from "react";
import { Plus, Zap, FileText, Users, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  action: () => void;
}

export function QuickActionsButton({ onOpenAI }: { onOpenAI: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'audit',
      label: 'Quick Audit',
      icon: Zap,
      description: 'Run instant check on current page',
      action: () => {
        toast({
          title: "Quick Audit Started",
          description: "Analyzing current page for SEO issues...",
        });
        setIsOpen(false);
        // Simulate audit process
        setTimeout(() => {
          toast({
            title: "Audit Complete",
            description: "Found 3 optimization opportunities",
          });
        }, 3000);
      }
    },
    {
      id: 'report',
      label: 'Generate Report',
      icon: FileText,
      description: 'Create comprehensive PDF report',
      action: () => {
        toast({
          title: "Generating Report",
          description: "Creating your SEO performance report...",
        });
        setIsOpen(false);
        // Simulate report generation
        setTimeout(() => {
          toast({
            title: "Report Ready",
            description: "Your SEO report has been generated successfully",
          });
        }, 2500);
      }
    },
    {
      id: 'competitor',
      label: 'Compare to Competitor',
      icon: Users,
      description: 'Analyze against top competitors',
      action: () => {
        toast({
          title: "Competitor Analysis",
          description: "Comparing your site against top 5 competitors...",
        });
        setIsOpen(false);
        // Simulate competitor analysis
        setTimeout(() => {
          toast({
            title: "Analysis Complete",
            description: "Found 12 opportunities to outrank competitors",
          });
        }, 4000);
      }
    },
    {
      id: 'ai',
      label: 'Ask AI',
      icon: MessageCircle,
      description: 'Get instant SEO guidance',
      action: () => {
        setIsOpen(false);
        onOpenAI();
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 p-4 shadow-lg border border-border bg-card animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-card-foreground">Quick Actions</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent"
                onClick={action.action}
              >
                <action.icon className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}
      
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Plus className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>
    </div>
  );
}