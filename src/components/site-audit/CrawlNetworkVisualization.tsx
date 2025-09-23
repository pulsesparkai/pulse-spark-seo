import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, Filter, Download, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface PageNodeData {
  label: string;
  url: string;
  status: 'analyzing' | 'completed' | 'queued' | 'error';
  citationCount: number;
  issues: number;
  isHomepage?: boolean;
}

interface CrawlStats {
  pagesPerSecond: number;
  depthReached: number;
  maxDepth: number;
  uniqueContent: number;
  duplicatePages: number;
  aiReadyPages: number;
}

interface AIOpportunities {
  chatgpt: number;
  perplexity: number;
  claude: number;
  quickWins: number;
}

// Custom Node Component
const PageNode = ({ data, selected }: { data: PageNodeData; selected: boolean }) => {
  const getStatusColor = () => {
    switch (data.status) {
      case 'completed': return 'bg-green-500';
      case 'analyzing': return 'bg-yellow-500';
      case 'queued': return 'bg-gray-400';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getNodeSize = () => {
    return data.isHomepage ? 'w-16 h-16' : 'w-12 h-12';
  };

  return (
    <div className={`relative ${getNodeSize()} rounded-full ${getStatusColor()} 
      border-4 border-white shadow-lg cursor-pointer transition-all duration-300 group
      ${selected ? 'scale-110 ring-4 ring-primary/50' : ''}
      ${data.status === 'analyzing' ? 'animate-pulse' : ''}`}>
      
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
        {data.isHomepage ? '🏠' : data.citationCount}
      </div>
      
      {/* Glow effect for analyzing nodes */}
      {data.status === 'analyzing' && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping"></div>
      )}
      
      {/* Citation count badge */}
      {!data.isHomepage && data.citationCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
          {data.citationCount}
        </div>
      )}
      
      {/* Issues indicator */}
      {data.issues > 0 && (
        <div className="absolute -bottom-2 -left-2 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          !
        </div>
      )}
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
        <div className="font-semibold">{data.url}</div>
        <div className="text-green-300">{data.citationCount} AI citations found</div>
        {data.issues > 0 && <div className="text-red-300">{data.issues} issues detected</div>}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
};

const nodeTypes = {
  pageNode: PageNode,
};

export function CrawlNetworkVisualization() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentUrl, setCurrentUrl] = useState('https://example.com/products');
  const [showAIView, setShowAIView] = useState(false);

  const [crawlStats, setCrawlStats] = useState<CrawlStats>({
    pagesPerSecond: 2.4,
    depthReached: 3,
    maxDepth: 5,
    uniqueContent: 89,
    duplicatePages: 23,
    aiReadyPages: 67
  });

  const [aiOpportunities, setAIOpportunities] = useState<AIOpportunities>({
    chatgpt: 134,
    perplexity: 45,
    claude: 78,
    quickWins: 23
  });

  // Initialize with homepage
  useEffect(() => {
    const homepageNode: Node = {
      id: 'homepage',
      type: 'pageNode',
      position: { x: 400, y: 300 },
      data: {
        label: 'Homepage',
        url: 'https://example.com',
        status: 'completed',
        citationCount: 0,
        issues: 0,
        isHomepage: true
      }
    };
    setNodes([homepageNode]);
  }, [setNodes]);

  // Simulate crawl progress
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Add new nodes randomly
      if (Math.random() < 0.7) {
        const nodeId = `node-${Date.now()}-${Math.random()}`;
        const urls = [
          '/products', '/about', '/contact', '/blog', '/pricing', 
          '/features', '/support', '/docs', '/api', '/careers'
        ];
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
        
        const newNode: Node = {
          id: nodeId,
          type: 'pageNode',
          position: {
            x: 200 + Math.random() * 400,
            y: 100 + Math.random() * 400
          },
          data: {
            label: randomUrl.replace('/', ''),
            url: `https://example.com${randomUrl}`,
            status: 'analyzing',
            citationCount: Math.floor(Math.random() * 50),
            issues: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0
          }
        };

        setNodes(prevNodes => {
          // Add node with entrance animation
          const nodeWithAnimation = {
            ...newNode,
            style: { 
              opacity: 0, 
              transform: 'scale(0)' 
            }
          };
          
          // Trigger animation after adding
          setTimeout(() => {
            setNodes(currentNodes => 
              currentNodes.map(node => 
                node.id === nodeId 
                  ? { ...node, style: { opacity: 1, transform: 'scale(1)', transition: 'all 0.5s ease-out' } }
                  : node
              )
            );
          }, 50);

          return [...prevNodes, nodeWithAnimation];
        });

        // Add edge to connect to existing node
        if (nodes.length > 0) {
          const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
          const newEdge: Edge = {
            id: `edge-${sourceNode.id}-${nodeId}`,
            source: sourceNode.id,
            target: nodeId,
            animated: true,
            style: { stroke: '#8b5cf6', strokeWidth: 2 }
          };
          setEdges(prevEdges => [...prevEdges, newEdge]);
        }

        setCurrentUrl(newNode.data.url as string);

        // Show random notifications
        const notifications = [
          '⚠️ Found: 12 pages with no schema markup',
          '✅ Discovered: High-value FAQ content for Perplexity',
          '🔴 Critical: Pricing page not optimized for ChatGPT',
          '💡 Opportunity: Blog posts perfect for Claude citations'
        ];
        
        if (Math.random() < 0.3) {
          const notification = notifications[Math.floor(Math.random() * notifications.length)];
          toast(notification);
        }

        // Update node status after delay
        setTimeout(() => {
          setNodes(prevNodes => 
            prevNodes.map(node => 
              node.id === nodeId 
                ? { ...node, data: { ...node.data, status: 'completed' as const } }
                : node
            )
          );
        }, 2000 + Math.random() * 3000);
      }

      // Update stats
      setCrawlStats(prev => ({
        ...prev,
        pagesPerSecond: 2.0 + Math.random() * 1.5,
        aiReadyPages: prev.aiReadyPages + Math.floor(Math.random() * 2)
      }));

      setAIOpportunities(prev => ({
        ...prev,
        chatgpt: prev.chatgpt + Math.floor(Math.random() * 3),
        perplexity: prev.perplexity + Math.floor(Math.random() * 2),
        claude: prev.claude + Math.floor(Math.random() * 3)
      }));

    }, 2000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, nodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSpeedChange = () => {
    const speeds = [1, 2, 5];
    const currentIndex = speeds.indexOf(speed);
    setSpeed(speeds[(currentIndex + 1) % speeds.length]);
  };

  return (
    <div className="relative h-[600px] w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
      {/* Live Stats Overlay - Top Left */}
      <Card className="absolute top-4 left-4 p-3 z-10 bg-white/95 backdrop-blur">
        <div className="space-y-1 text-sm">
          <div className="font-semibold text-primary">📊 Live Stats</div>
          <div>Pages/second: <span className="font-mono">{crawlStats.pagesPerSecond.toFixed(1)}</span></div>
          <div>Depth: <span className="font-mono">{crawlStats.depthReached}/{crawlStats.maxDepth}</span></div>
          <div>Unique content: <span className="font-mono">{crawlStats.uniqueContent}%</span></div>
          <div>Duplicate pages: <span className="font-mono">{crawlStats.duplicatePages}</span></div>
          <div>AI-ready pages: <span className="font-mono">{crawlStats.aiReadyPages}%</span></div>
        </div>
      </Card>

      {/* AI Opportunities Overlay - Top Right */}
      <Card className="absolute top-4 right-4 p-3 z-10 bg-white/95 backdrop-blur">
        <div className="space-y-1 text-sm">
          <div className="font-semibold text-primary">🤖 AI Opportunities</div>
          <div>ChatGPT citations: <span className="font-mono text-green-600">+{aiOpportunities.chatgpt}</span></div>
          <div>Perplexity gaps: <span className="font-mono text-yellow-600">{aiOpportunities.perplexity}</span></div>
          <div>Claude optimization: <span className="font-mono text-blue-600">{aiOpportunities.claude}</span></div>
          <div>Quick wins: <span className="font-mono text-purple-600">{aiOpportunities.quickWins}</span></div>
        </div>
      </Card>

      {/* Current Analysis Overlay - Bottom Left */}
      <Card className="absolute bottom-20 left-4 p-3 z-10 bg-white/95 backdrop-blur max-w-sm">
        <div className="space-y-1 text-sm">
          <div className="font-semibold text-primary">Currently Analyzing:</div>
          <div className="font-mono text-xs break-all">{currentUrl}</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>Checking AI citation potential...</span>
          </div>
        </div>
      </Card>

      {/* Controls Toolbar - Bottom */}
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 z-10 bg-white/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "secondary" : "default"}
            size="sm"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={handleSpeedChange}
            variant="outline"
            size="sm"
            className="min-w-16"
          >
            <Zap className="h-3 w-3 mr-1" />
            {speed}x
          </Button>

          <Button
            onClick={() => setShowAIView(!showAIView)}
            variant={showAIView ? "default" : "outline"}
            size="sm"
          >
            <Filter className="h-4 w-4 mr-1" />
            AI View
          </Button>

          <Button variant="outline" size="sm" onClick={() => toast.info('Exporting crawl network data...')}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </Card>

      {/* React Flow Network */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="bg-transparent"
      >
        <Background variant={'dots' as any} gap={20} size={1} color="#e5e7eb" />
        <Controls className="bg-white/80 backdrop-blur" />
        <MiniMap 
          className="bg-white/80 backdrop-blur" 
          nodeColor={(node: any) => {
            const data = node.data as PageNodeData;
            switch (data.status) {
              case 'completed': return '#22c55e';
              case 'analyzing': return '#eab308';
              case 'queued': return '#9ca3af';
              case 'error': return '#ef4444';
              default: return '#9ca3af';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}