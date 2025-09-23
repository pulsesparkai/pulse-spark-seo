import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SimulationPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

export function SimulationPanel({ isActive, onToggle }: SimulationPanelProps) {
  const [query, setQuery] = useState("What's the best CRM software?");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const simulationSteps = [
    "AI engines scanning your content...",
    "Analyzing content quality and relevance...",
    "Checking authority signals...",
    "Evaluating answer completeness...",
    "Determining citation preferences..."
  ];

  const aiResults = [
    { name: 'ChatGPT', selected: true, reason: 'Clear comparison table found' },
    { name: 'Claude', selected: false, reason: 'Missing definition section' },
    { name: 'Perplexity', selected: true, reason: 'Strong authority signals' },
    { name: 'Gemini', selected: false, reason: 'Ambiguous pricing info' },
    { name: 'DeepSeek', selected: true, reason: 'Structured data present' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= simulationSteps.length - 1) {
            setIsRunning(false);
            toast.success('Simulation complete! Check the results below.');
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }

    return () => clearInterval(interval);
  }, [isRunning, simulationSteps.length]);

  const handleRunSimulation = () => {
    setCurrentStep(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  if (!isActive) return null;

  return (
    <Card className="absolute top-4 left-4 w-80 p-4 bg-background/95 backdrop-blur-sm border shadow-lg z-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Query Simulation</h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>×</Button>
        </div>
        
        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a query to test..."
            disabled={isRunning}
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRunSimulation} 
              disabled={isRunning}
              size="sm"
              className="flex-1"
            >
              {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Processing:</div>
            {simulationSteps.map((step, index) => (
              <div
                key={index}
                className={`text-xs p-2 rounded ${
                  index <= currentStep ? 'bg-citation-high/10 text-citation-high' : 'bg-muted text-muted-foreground'
                }`}
              >
                {index === currentStep && isRunning && (
                  <div className="inline-block w-2 h-2 bg-citation-high rounded-full animate-pulse mr-2" />
                )}
                {step}
              </div>
            ))}
          </div>
        )}

        {!isRunning && currentStep > 0 && (
          <div className="space-y-3 border-t pt-3">
            <div className="text-sm font-medium">Citation Results:</div>
            <div className="space-y-2">
              {aiResults.map((result) => (
                <div key={result.name} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{result.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={result.selected ? "default" : "secondary"}
                      className={result.selected ? "bg-citation-high text-white" : ""}
                    >
                      {result.selected ? 'Selected' : 'Skipped'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>3/5 engines</strong> would cite your content for this query.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}