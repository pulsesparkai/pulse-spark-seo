import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SEONode, SEONodeData } from '@/components/seo-canvas/SEONode';
import { AIEngineNode } from '@/components/aeo-canvas/AIEngineNodes';
import { NodeDetailsPanel } from '@/components/seo-canvas/NodeDetailsPanel';
import { CanvasToolbar } from '@/components/seo-canvas/CanvasToolbar';
import { OptimizationPanel } from '@/components/seo-canvas/OptimizationPanel';
import { SimulationPanel } from '@/components/aeo-canvas/SimulationPanel';
import { SEONode as SEONodeType, CanvasTool } from '@/components/seo-canvas/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Zap, Info } from 'lucide-react';
import { toast } from 'sonner';

const nodeTypes = {
  seoNode: SEONode,
  aiEngine: AIEngineNode,
};

// Website Pages (left column)
const initialNodes: Node[] = [
  // Website Pages - Left Column
  {
    id: 'homepage',
    type: 'seoNode',
    position: { x: 50, y: 100 },
    data: { 
      id: 'homepage', 
      url: '/', 
      title: 'Homepage', 
      type: 'homepage', 
      status: 'optimized', 
      seoScore: 92,
      missingElements: [],
      citationProbability: {
        chatgpt: 92,
        claude: 85,
        perplexity: 78,
        gemini: 68,
        deepseek: 45
      }
    },
  },
  {
    id: 'pricing',
    type: 'seoNode',
    position: { x: 50, y: 250 },
    data: { 
      id: 'pricing', 
      url: '/pricing', 
      title: 'Pricing Page', 
      type: 'other', 
      status: 'needs-work', 
      seoScore: 67,
      missingElements: ['FAQ schema'],
      citationProbability: {
        chatgpt: 67,
        claude: 72,
        perplexity: 45,
        gemini: 58,
        deepseek: 32
      }
    },
  },
  {
    id: 'api-docs',
    type: 'seoNode',
    position: { x: 50, y: 400 },
    data: { 
      id: 'api-docs', 
      url: '/docs/api', 
      title: 'API Documentation', 
      type: 'other', 
      status: 'critical', 
      seoScore: 45,
      missingElements: ['Clear answers', 'Code examples', 'FAQ schema'],
      citationProbability: {
        chatgpt: 45,
        claude: 88,
        perplexity: 62,
        gemini: 41,
        deepseek: 55
      }
    },
  },
  {
    id: 'blog',
    type: 'seoNode',
    position: { x: 50, y: 550 },
    data: { 
      id: 'blog', 
      url: '/blog', 
      title: 'Blog Articles', 
      type: 'blog', 
      status: 'optimized', 
      seoScore: 89,
      missingElements: [],
      citationProbability: {
        chatgpt: 89,
        claude: 91,
        perplexity: 85,
        gemini: 72,
        deepseek: 68
      }
    },
  },

  // AI Engines - Right Column
  {
    id: 'chatgpt',
    type: 'aiEngine',
    position: { x: 800, y: 150 },
    data: { id: 'chatgpt', name: 'ChatGPT', logo: '🤖', citationScore: 92, status: 'high' },
  },
  {
    id: 'claude',
    type: 'aiEngine', 
    position: { x: 800, y: 280 },
    data: { id: 'claude', name: 'Claude', logo: '🔮', citationScore: 87, status: 'high' },
  },
  {
    id: 'perplexity',
    type: 'aiEngine',
    position: { x: 800, y: 410 },
    data: { id: 'perplexity', name: 'Perplexity', logo: '🔍', citationScore: 76, status: 'medium' },
  },
  {
    id: 'gemini',
    type: 'aiEngine',
    position: { x: 800, y: 540 },
    data: { id: 'gemini', name: 'Gemini', logo: '💎', citationScore: 68, status: 'medium' },
  },
  {
    id: 'deepseek',
    type: 'aiEngine',
    position: { x: 800, y: 670 },
    data: { id: 'deepseek', name: 'DeepSeek', logo: '🎯', citationScore: 45, status: 'low' },
  },
];

// Animated paths showing content flowing to AI engines
const initialEdges: Edge[] = [
  { id: 'homepage-chatgpt', source: 'homepage', target: 'chatgpt', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },
  { id: 'homepage-claude', source: 'homepage', target: 'claude', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'pricing-claude', source: 'pricing', target: 'claude', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } }, 
  { id: 'api-docs-claude', source: 'api-docs', target: 'claude', animated: true, style: { stroke: '#10b981', strokeWidth: 3 } },
  { id: 'blog-chatgpt', source: 'blog', target: 'chatgpt', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'blog-claude', source: 'blog', target: 'claude', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'blog-perplexity', source: 'blog', target: 'perplexity', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
];

export default function SEOCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [optimizationPanel, setOptimizationPanel] = useState<{
    isOpen: boolean;
    nodeId: string | null;
    type: string | null;
  }>({ isOpen: false, nodeId: null, type: null });
  const [simulationMode, setSimulationMode] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodes(nodes);
  }, []);

  const handleOptimize = (nodeId: string, type: 'meta' | 'schema' | 'content') => {
    setOptimizationPanel({ isOpen: true, nodeId, type });
  };

  const handleAddPage = () => {
    const newId = `page-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'seoNode',
      position: { x: 50, y: 100 + nodes.length * 120 },
      data: {
        id: newId,
        url: '/new-page',
        title: 'New Page',
        type: 'other' as const,
        status: 'needs-work' as const,
        seoScore: 30,
        missingElements: ['Meta title', 'Meta description', 'Clear answers'],
        citationProbability: {
          chatgpt: 15,
          claude: 20,
          perplexity: 10,
          gemini: 12,
          deepseek: 8
        }
      },
    };
    setNodes([...nodes, newNode]);
    toast.success('New page added to AEO analysis');
  };

  const handleAISuggest = () => {
    toast.success('AI is analyzing your content flow for optimization opportunities...');
    // Simulate AI suggestions after delay
    setTimeout(() => {
      toast.success('💡 Found 3 quick wins: Add FAQ schema to pricing, optimize API docs structure, create topic clusters');
    }, 2000);
  };

  const handleExportSitemap = () => {
    const seoNodes = nodes.filter(node => node.type === 'seoNode');
    console.log('AEO Sitemap Export:', seoNodes.map(node => node.data));
    toast.success('AEO sitemap exported successfully');
  };

  const runSimulation = () => {
    if (!queryInput.trim()) {
      toast.error('Please enter a query to simulate');
      return;
    }

    setSimulationRunning(true);
    toast.success(`Simulating query: "${queryInput}"`);

    // Simulate AI engine responses
    setTimeout(() => {
      const mockResults = [
        {
          engine: 'ChatGPT',
          logo: '🤖',
          selectedContent: 'Homepage + Blog Article',
          confidence: 92,
          reasoning: 'High-quality content with clear structure and definitions'
        },
        {
          engine: 'Claude',
          logo: '🔮',
          selectedContent: 'API Documentation',
          confidence: 88,
          reasoning: 'Technical accuracy and comprehensive examples'
        },
        {
          engine: 'Perplexity',
          logo: '🔍',
          selectedContent: 'Blog Article',
          confidence: 76,
          reasoning: 'Recent content with relevant statistics'
        },
        {
          engine: 'Gemini',
          logo: '💎',
          selectedContent: 'Pricing Page',
          confidence: 68,
          reasoning: 'Clear pricing information but needs FAQ schema'
        }
      ];
      
      setSimulationResults(mockResults);
      setSimulationRunning(false);
      toast.success('Simulation complete! See which content each AI selected.');
    }, 3000);
  };

  const resetSimulation = () => {
    setSimulationResults([]);
    setQueryInput('');
    setSimulationRunning(false);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AEO Citation Flow Visualizer</h1>
            <p className="text-sm text-muted-foreground">
              Watch your content flow to AI engines • Green = optimized, Yellow = needs work, Red = ignored by AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={simulationMode ? "default" : "outline"}
              size="sm"
              onClick={() => setSimulationMode(!simulationMode)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Simulation Mode
            </Button>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              How It Works
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Three-Column Layout */}
        <div className="flex w-full h-full">
          {/* LEFT: Website Pages Column */}
          <div className="w-80 border-r bg-muted/20 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Your Website Pages</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Click any page to see AI citation breakdown
              </p>
            </div>
            
            <div className="space-y-3">
              {nodes.filter(node => node.type === 'seoNode').map((node) => (
                <Card 
                  key={node.id} 
                  className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                    node.data.status === 'optimized' ? 'border-citation-high/50 bg-citation-high/5' :
                    node.data.status === 'needs-work' ? 'border-yellow-500/50 bg-yellow-500/5' :
                    'border-destructive/50 bg-destructive/5'
                  }`}
                  onClick={() => onNodeClick({} as React.MouseEvent, node)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{node.data.title}</h4>
                    <Badge 
                      variant={
                        node.data.status === 'optimized' ? 'default' :
                        node.data.status === 'needs-work' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {node.data.seoScore}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{node.data.url}</div>
                  
                  {/* AI Citation Probabilities */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium">AI Citation Probability:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex justify-between">
                        <span>🤖 ChatGPT:</span>
                        <span className={node.data.citationProbability?.chatgpt >= 80 ? 'text-citation-high' : 
                                       node.data.citationProbability?.chatgpt >= 60 ? 'text-yellow-600' : 'text-destructive'}>
                          {node.data.citationProbability?.chatgpt}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>🔮 Claude:</span>
                        <span className={node.data.citationProbability?.claude >= 80 ? 'text-citation-high' : 
                                       node.data.citationProbability?.claude >= 60 ? 'text-yellow-600' : 'text-destructive'}>
                          {node.data.citationProbability?.claude}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>🔍 Perplexity:</span>
                        <span className={node.data.citationProbability?.perplexity >= 80 ? 'text-citation-high' : 
                                       node.data.citationProbability?.perplexity >= 60 ? 'text-yellow-600' : 'text-destructive'}>
                          {node.data.citationProbability?.perplexity}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>💎 Gemini:</span>
                        <span className={node.data.citationProbability?.gemini >= 80 ? 'text-citation-high' : 
                                       node.data.citationProbability?.gemini >= 60 ? 'text-yellow-600' : 'text-destructive'}>
                          {node.data.citationProbability?.gemini}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button onClick={handleAddPage} className="w-full mt-4" variant="outline">
              + Add Page to Analysis
            </Button>
          </div>

          {/* CENTER: ReactFlow Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onSelectionChange={onSelectionChange}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls />
              <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>

            {/* Simulation Panel Overlay */}
            {simulationMode && (
              <div className="absolute top-4 left-4 right-4 z-10">
                <Card className="p-4 bg-background/95 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter a query to simulate (e.g., 'best CRM software')"
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={runSimulation} 
                          disabled={simulationRunning}
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {simulationRunning ? 'Running...' : 'Run Simulation'}
                        </Button>
                        <Button onClick={resetSimulation} variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Results */}
                  {simulationResults.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {simulationResults.map((result, index) => (
                        <Card key={index} className="p-3">
                          <div className="text-center space-y-2">
                            <div className="text-2xl">{result.logo}</div>
                            <div className="font-medium text-sm">{result.engine}</div>
                            <div className="text-xs text-muted-foreground">{result.selectedContent}</div>
                            <Badge variant="default" className="text-xs">
                              {result.confidence}% confidence
                            </Badge>
                            <div className="text-xs text-muted-foreground">{result.reasoning}</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* RIGHT: AI Engines Column */}
          <div className="w-80 border-l bg-muted/20 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">AI Answer Engines</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Your content needs to flow to these engines
              </p>
            </div>
            
            <div className="space-y-3">
              {nodes.filter(node => node.type === 'aiEngine').map((node) => (
                <Card key={node.id} className="p-3">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">{(node.data as any).logo}</div>
                    <div className="font-medium">{(node.data as any).name}™</div>
                    <div className="text-2xl font-bold text-foreground">
                      {(node.data as any).citationScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Citation Score</div>
                    <Badge 
                      variant={
                        node.data.status === 'high' ? 'default' :
                        node.data.status === 'medium' ? 'secondary' : 'destructive'
                      }
                    >
                      {(node.data as any).status === 'high' ? 'Optimized ✓' :
                       (node.data as any).status === 'medium' ? 'Needs Work ⚠️' : 'Critical ✗'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Next Actions:</h4>
              <div className="space-y-2 text-xs">
                <div>• Add FAQ schema to pricing page</div>
                <div>• Improve API docs structure</div>
                <div>• Create content for DeepSeek optimization</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panels */}
      <NodeDetailsPanel
        node={selectedNode}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onOptimize={handleOptimize}
      />

      <OptimizationPanel
        isOpen={optimizationPanel.isOpen}
        onClose={() => setOptimizationPanel({ isOpen: false, nodeId: null, type: null })}
        nodeId={optimizationPanel.nodeId}
        optimizationType={optimizationPanel.type}
      />
    </div>
  );
}