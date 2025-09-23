import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  suffix = "", 
  icon: Icon, 
  trend, 
  delay = 0 
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^\d.]/g, "")) : value;
      
      let startValue = 0;
      const duration = 1500; // Animation duration in ms
      const increment = numericValue / (duration / 16); // 60fps
      
      const animate = () => {
        startValue += increment;
        if (startValue >= numericValue) {
          setAnimatedValue(numericValue);
        } else {
          setAnimatedValue(Math.floor(startValue));
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={`
      bg-gradient-card border border-metric-card-border rounded-xl p-6 shadow-metric
      hover:shadow-lg transition-all duration-300 hover:-translate-y-1
      ${isVisible ? 'animate-fade-up' : 'opacity-0'}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-6 w-6 text-accent-foreground" />
        </div>
        {trend && (
          <div className={`
            text-sm font-medium px-2 py-1 rounded-md
            ${trend.isPositive ? 'text-status-success bg-status-surface' : 'text-status-error bg-status-surface'}
          `}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className={`
            text-3xl font-bold text-metric-value
            ${isVisible ? 'animate-count-up' : ''}
          `}>
            {animatedValue}{suffix}
          </span>
        </div>
        <p className="text-metric-label text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}