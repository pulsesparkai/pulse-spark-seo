import { Handle, Position, NodeProps } from '@xyflow/react';
import { Globe, Package, FolderOpen, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export interface SEONodeData extends Record<string, unknown> {
  id: string;
  url: string;
  title: string;
  type: 'homepage' | 'product' | 'category' | 'blog' | 'other';
  status: 'optimized' | 'needs-work' | 'critical';
  seoScore: number;
  missingElements: string[];
}

const nodeIcons = {
  homepage: Globe,
  product: Package,
  category: FolderOpen,
  blog: FileText,
  other: Globe,
};

const statusColors = {
  optimized: 'border-status-success bg-green-50 text-status-success',
  'needs-work': 'border-status-warning bg-yellow-50 text-status-warning',
  critical: 'border-status-error bg-red-50 text-status-error',
};

const statusIcons = {
  optimized: CheckCircle,
  'needs-work': Clock,
  critical: AlertCircle,
};

export function SEONode({ data, selected }: NodeProps) {
  const nodeData = data as SEONodeData;
  const Icon = nodeIcons[nodeData.type];
  const StatusIcon = statusIcons[nodeData.status];
  
  return (
    <div className={`
      relative p-4 rounded-lg border-2 bg-white shadow-card min-w-[200px]
      transition-all duration-200 hover:shadow-lg cursor-pointer
      ${statusColors[nodeData.status]}
      ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}
    `}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-border"
      />
      
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm text-foreground truncate">{nodeData.title}</h3>
            <StatusIcon className="h-4 w-4" />
          </div>
          <p className="text-xs text-muted-foreground truncate mb-2">{nodeData.url}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className="font-medium">SEO Score:</span>
              <span className={`ml-1 font-bold ${
                nodeData.seoScore >= 80 ? 'text-status-success' : 
                nodeData.seoScore >= 60 ? 'text-status-warning' : 'text-status-error'
              }`}>
                {nodeData.seoScore}%
              </span>
            </div>
            
            {nodeData.missingElements.length > 0 && (
              <div className="text-xs text-status-error">
                {nodeData.missingElements.length} issues
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-border"
      />
    </div>
  );
}