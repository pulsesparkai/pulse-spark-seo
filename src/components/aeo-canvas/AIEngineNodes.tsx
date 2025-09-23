import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface AIEngineNodeData {
  id: string;
  name: string;
  logo: string;
  citationScore: number;
  status: 'high' | 'medium' | 'low';
}

interface AIEngineNodeProps {
  data: AIEngineNodeData;
  selected?: boolean;
}

const statusIcons = {
  high: CheckCircle2,
  medium: AlertCircle,
  low: XCircle,
};

const statusColors = {
  high: 'text-citation-high border-citation-high/20 bg-citation-high/5',
  medium: 'text-citation-medium border-citation-medium/20 bg-citation-medium/5',
  low: 'text-citation-low border-citation-low/20 bg-citation-low/5',
};

export function AIEngineNode({ data, selected }: AIEngineNodeProps) {
  const StatusIcon = statusIcons[data.status];

  return (
    <Card className={`
      relative w-48 transition-all duration-200 cursor-pointer hover:shadow-lg
      ${selected ? 'ring-2 ring-primary shadow-lg' : ''}
      ${statusColors[data.status]}
    `}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="p-4 text-center space-y-3">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">{data.logo}</span>
          <h3 className="font-semibold text-sm">{data.name}™</h3>
        </div>
        
        <div className="space-y-2">
          <div className="text-xl font-bold">{data.citationScore}%</div>
          <div className="text-xs text-muted-foreground">Citation Rate</div>
        </div>
        
        <div className="flex items-center justify-center">
          <StatusIcon className={`h-4 w-4 mr-1 ${
            data.status === 'high' ? 'text-citation-high' :
            data.status === 'medium' ? 'text-citation-medium' :
            'text-citation-low'
          }`} />
          <Badge variant="outline" className={`text-xs ${
            data.status === 'high' ? 'border-citation-high text-citation-high' :
            data.status === 'medium' ? 'border-citation-medium text-citation-medium' :
            'border-citation-low text-citation-low'
          }`}>
            {data.status === 'high' ? 'Optimized' : 
             data.status === 'medium' ? 'Good' : 'Needs Work'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}