import { X, ExternalLink, Plus, Edit3, Code, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SEONode, SEONodeData } from './types';
import { Node } from '@xyflow/react';
import { toast } from 'sonner';

interface NodeDetailsPanelProps {
  node: Node<SEONodeData> | null;
  isOpen: boolean;
  onClose: () => void;
  onOptimize: (nodeId: string, type: 'meta' | 'schema' | 'content') => void;
}

export function NodeDetailsPanel({ node, isOpen, onClose, onOptimize }: NodeDetailsPanelProps) {
  if (!isOpen || !node) return null;

  // Access node data with proper typing
  const nodeData = node.data as SEONodeData;

  const getStatusColor = (status: SEONodeData['status']) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-work': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="fixed right-0 top-16 h-full w-80 bg-white border-l border-border shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Page Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Page Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medium text-sm">{nodeData.title}</h3>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{nodeData.url}</p>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(nodeData.status)}>
                {nodeData.status?.replace('-', ' ') || 'Unknown'}
              </Badge>
              <span className="text-sm font-medium">Score: {nodeData.seoScore || 0}%</span>
            </div>
          </div>

          <Separator />

          {/* Missing Elements */}
          <div>
            <h4 className="font-medium text-sm mb-3">Missing Elements</h4>
            <div className="space-y-2">
              {nodeData.missingElements && nodeData.missingElements.length > 0 ? (
                nodeData.missingElements.map((element, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <span className="text-sm text-red-700">{element}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-green-600">All elements optimized!</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => onOptimize(nodeData.id, 'schema')}
              >
                <Code className="h-4 w-4 mr-2" />
                Add Schema Markup
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => onOptimize(nodeData.id, 'content')}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Optimize Content
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => onOptimize(nodeData.id, 'meta')}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Fix Meta Tags
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.info('Opening internal links analysis...')}>
                <Link className="h-4 w-4 mr-2" />
                Internal Links
              </Button>
            </div>
          </div>

          <Separator />

          {/* SEO Checklist */}
          <div>
            <h4 className="font-medium text-sm mb-3">SEO Checklist</h4>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Meta Title', status: nodeData.seoScore > 70 },
                { label: 'Meta Description', status: nodeData.seoScore > 60 },
                { label: 'H1 Tag', status: nodeData.seoScore > 80 },
                { label: 'Schema Markup', status: nodeData.seoScore > 75 },
                { label: 'Internal Links', status: nodeData.seoScore > 65 },
                { label: 'Image Alt Text', status: nodeData.seoScore > 70 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <div className={`w-3 h-3 rounded-full ${item.status ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}