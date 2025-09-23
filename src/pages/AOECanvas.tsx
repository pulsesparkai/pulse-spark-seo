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
import { toast } from 'sonner';

const nodeTypes = {
  seoNode: SEONode,
  aiEngine: AIEngineNode,
};

// AI Engine Nodes (right side)
const aiEngineNodes: Node[] = [
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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'seoNode',
    position: { x: 400, y: 200 },
    data: {
      id: '1',
      url: '/',
      title: 'Homepage',
      type: 'homepage',
      status: 'optimized',
      seoScore: 87,
      missingElements: [],
    } as SEONodeData,
  },
  {
    id: '2',
    type: 'seoNode',
    position: { x: 200, y: 400 },
    data: {
      id: '2',
      url: '/products',
      title: 'Product Pages',
      type: 'product',
      status: 'needs-work',
      seoScore: 65,
      missingElements: ['Schema Markup', 'Meta Description'],
    } as SEONodeData,
  },
  {
    id: '3',
    type: 'seoNode',
    position: { x: 600, y: 400 },
    data: {
      id: '3',
      url: '/categories',
      title: 'Category Pages',
      type: 'category',
      status: 'critical',
      seoScore: 42,
      missingElements: ['H1 Tag', 'Meta Title', 'Internal Links'],
    } as SEONodeData,
  },
  {
    id: '4',
    type: 'seoNode',
    position: { x: 400, y: 600 },
    data: {
      id: '4',
      url: '/blog',
      title: 'Blog Posts',
      type: 'blog',
      status: 'needs-work',
      seoScore: 73,
      missingElements: ['Schema Markup'],
    } as SEONodeData,
  },
  ...aiEngineNodes,
];

const initialEdges: Edge[] = [
  // Content to AI Engine connections
  { id: 'e1-chatgpt', source: '1', target: 'chatgpt', animated: true, style: { stroke: 'hsl(var(--citation-high))' } },
  { id: 'e1-claude', source: '1', target: 'claude', animated: true, style: { stroke: 'hsl(var(--citation-high))' } },
  { id: 'e1-perplexity', source: '1', target: 'perplexity', animated: true, style: { stroke: 'hsl(var(--citation-medium))' } },
  { id: 'e1-gemini', source: '1', target: 'gemini', animated: true, style: { stroke: 'hsl(var(--citation-medium))' } },
  { id: 'e1-deepseek', source: '1', target: 'deepseek', animated: true, style: { stroke: 'hsl(var(--citation-low))' } },
  
  { id: 'e2-chatgpt', source: '2', target: 'chatgpt', animated: true, style: { stroke: 'hsl(var(--citation-medium))' } },
  { id: 'e2-claude', source: '2', target: 'claude', animated: true, style: { stroke: 'hsl(var(--citation-low))' } },
  { id: 'e2-perplexity', source: '2', target: 'perplexity', animated: true, style: { stroke: 'hsl(var(--citation-high))' } },
  
  { id: 'e3-gemini', source: '3', target: 'gemini', animated: true, style: { stroke: 'hsl(var(--citation-low))' } },
  { id: 'e3-deepseek', source: '3', target: 'deepseek', animated: true, style: { stroke: 'hsl(var(--citation-low))' } },
  
  { id: 'e4-chatgpt', source: '4', target: 'chatgpt', animated: true, style: { stroke: 'hsl(var(--citation-high))' } },
  { id: 'e4-claude', source: '4', target: 'claude', animated: true, style: { stroke: 'hsl(var(--citation-high))' } },
  { id: 'e4-perplexity', source: '4', target: 'perplexity', animated: true, style: { stroke: 'hsl(var(--citation-medium))' } },
];

// AEO Canvas - Answer Engine Optimization visualization
export default function AOECanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<SEONodeType | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isOptimizationPanelOpen, setIsOptimizationPanelOpen] = useState(false);
  const [optimizationType, setOptimizationType] = useState<'meta' | 'schema' | 'content' | null>(null);
  const [optimizingNodeId, setOptimizingNodeId] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (activeTool === 'select') {
      const nodeData = node.data as SEONodeData;
      const seoNode: SEONodeType = {
        ...nodeData,
        position: node.position,
      };
      setSelectedNode(seoNode);
      setIsPanelOpen(true);
    }
  }, [activeTool]);

  const onSelectionChange = useCallback((params: any) => {
    if (params.nodes) {
      setSelectedNodes(params.nodes.map((node: Node) => node.id));
    }
  }, []);

  const handleOptimize = useCallback((nodeId: string, type: 'meta' | 'schema' | 'content') => {
    setOptimizingNodeId(nodeId);
    setOptimizationType(type);
    setIsOptimizationPanelOpen(true);
    setIsPanelOpen(false);
  }, []);

  const handleAddPage = useCallback(() => {
    const newId = `${nodes.length + 1}`;
    const newNode: Node = {
      id: newId,
      type: 'seoNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 300 },
      data: {
        id: newId,
        url: `/new-page-${newId}`,
        title: `New Page ${newId}`,
        type: 'other',
        status: 'needs-work',
        seoScore: 30,
        missingElements: ['Meta Title', 'Meta Description', 'H1 Tag'],
      } as SEONodeData,
    };
    
    setNodes((nds) => [...nds, newNode]);
    toast.success('New page added to AEO Canvas');
  }, [nodes.length, setNodes]);

  const handleAISuggest = useCallback(() => {
    // Simulate AI reorganization for optimal citation flow
    const reorganizedNodes = nodes.map(node => {
      if (node.type === 'seoNode') {
        return {
          ...node,
          position: {
            x: node.position.x + (Math.random() - 0.5) * 100,
            y: node.position.y + (Math.random() - 0.5) * 100,
          },
        };
      }
      return node;
    });
    
    setNodes(reorganizedNodes);
    toast.success('AI suggested optimal citation flow applied');
  }, [nodes, setNodes]);

  const handleExportSitemap = useCallback(() => {
    const sitemap = nodes
      .filter(node => node.type === 'seoNode')
      .map(node => {
        const nodeData = node.data as SEONodeData;
        return {
          url: nodeData.url,
          title: nodeData.title,
          citationPotential: nodeData.seoScore,
        };
      });
    
    console.log('Exporting AEO sitemap:', sitemap);
    toast.success('AEO sitemap exported successfully');
  }, [nodes]);

  return (
    <div className="h-full relative bg-gray-50">
      <SimulationPanel 
        isActive={simulationMode} 
        onToggle={() => setSimulationMode(!simulationMode)} 
      />
      
      <div className="h-full">
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
          className="bg-gray-50"
        >
          <Controls position="top-left" />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </div>

      <NodeDetailsPanel
        node={selectedNode}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onOptimize={handleOptimize}
      />

      <CanvasToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onAddPage={handleAddPage}
        onAISuggest={handleAISuggest}
        onExportSitemap={handleExportSitemap}
        onUndo={() => toast.info('Undo functionality coming soon')}
        onRedo={() => toast.info('Redo functionality coming soon')}
        selectedNodes={selectedNodes}
        onSimulationToggle={() => setSimulationMode(!simulationMode)}
        simulationActive={simulationMode}
      />

      <OptimizationPanel
        isOpen={isOptimizationPanelOpen}
        onClose={() => setIsOptimizationPanelOpen(false)}
        nodeId={optimizingNodeId}
        optimizationType={optimizationType}
      />
    </div>
  );
}