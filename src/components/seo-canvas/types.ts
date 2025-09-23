export interface SEONode {
  id: string;
  url: string;
  title: string;
  type: 'homepage' | 'product' | 'category' | 'blog' | 'other';
  status: 'optimized' | 'needs-work' | 'critical';
  seoScore: number;
  missingElements: string[];
  position: { x: number; y: number };
}

export interface SEOIssue {
  type: 'meta' | 'schema' | 'content' | 'links';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export type CanvasTool = 'select' | 'add-page' | 'bulk-edit' | 'ai-suggest';