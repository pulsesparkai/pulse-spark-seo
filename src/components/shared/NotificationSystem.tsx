import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Shield, TrendingUp, Search, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  type: 'schema' | 'competitor' | 'analysis' | 'warning' | 'success';
  message: string;
  timestamp: Date;
}

const notificationTemplates = [
  { type: 'schema', message: "New schema opportunity detected on Product Pages", icon: Shield },
  { type: 'competitor', message: "Competitor updated their content strategy", icon: TrendingUp },
  { type: 'analysis', message: "AI analysis complete: 12 new insights discovered", icon: Sparkles },
  { type: 'analysis', message: "Crawl finished: Found 45 optimization opportunities", icon: Search },
  { type: 'warning', message: "Core Web Vitals score dropped on 3 pages", icon: AlertTriangle },
  { type: 'success', message: "Schema markup successfully implemented", icon: CheckCircle },
  { type: 'competitor', message: "Competitor ranking changes detected for 8 keywords", icon: TrendingUp },
  { type: 'schema', message: "FAQ schema opportunity found on 15 pages", icon: Shield },
];

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const showRandomNotification = () => {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const notification: Notification = {
        id: Date.now().toString(),
        type: template.type as any,
        message: template.message,
        timestamp: new Date(),
      };

      setNotifications(prev => [notification, ...prev.slice(0, 9)]);

      // Show toast notification
      toast({
        title: getNotificationTitle(template.type as any),
        description: template.message,
        duration: 4000,
      });
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showRandomNotification, 3000);
    
    // Then show notifications every 15-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to show notification
        showRandomNotification();
      }
    }, Math.random() * 15000 + 15000); // 15-30 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return null; // This component only handles the logic, toasts are shown by the toast system
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case 'schema': return 'Schema Opportunity';
    case 'competitor': return 'Competitor Update';
    case 'analysis': return 'Analysis Complete';
    case 'warning': return 'Performance Alert';
    case 'success': return 'Optimization Applied';
    default: return 'SEO Update';
  }
}