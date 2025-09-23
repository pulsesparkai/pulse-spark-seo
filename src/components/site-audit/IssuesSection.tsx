import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssueCard, AuditIssue } from './IssueCard';
import { AlertCircle, AlertTriangle, CheckCircle2, Download, Filter } from 'lucide-react';

const mockIssues: AuditIssue[] = [
  {
    id: '1',
    title: 'No Schema Markup on Product Pages',
    description: 'Product pages are missing structured data markup, reducing rich snippet visibility in search results.',
    priority: 'critical',
    pageCount: 147,
    category: 'Schema Markup',
    impact: 'Missing schema markup can significantly reduce click-through rates from search results. Rich snippets typically increase CTR by 15-30%.',
    estimatedImprovement: '~15-25% CTR increase',
    affectedPages: [
      {
        url: '/products/wireless-headphones',
        title: 'Premium Wireless Headphones',
        issue: 'Missing Product schema'
      },
      {
        url: '/products/bluetooth-speakers',
        title: 'Bluetooth Speakers Collection',
        issue: 'Missing Product schema'
      },
      {
        url: '/products/smart-watches',
        title: 'Smart Watches - Latest Models',
        issue: 'Missing Product schema'
      }
    ],
    solution: {
      description: 'Add JSON-LD structured data for products including name, price, availability, and reviews.',
      codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Premium Wireless Headphones",
  "image": "/images/headphones.jpg",
  "description": "High-quality wireless headphones...",
  "offers": {
    "@type": "Offer",
    "price": "299.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
      steps: [
        'Identify all product pages requiring schema markup',
        'Create product schema template with required fields',
        'Implement dynamic schema generation in product templates',
        'Test markup using Google\'s Structured Data Testing Tool',
        'Monitor rich snippet appearance in search results'
      ]
    }
  },
  {
    id: '2',
    title: 'Missing H1 Tags',
    description: '23 pages are missing H1 tags, which are crucial for page structure and SEO.',
    priority: 'critical',
    pageCount: 23,
    category: 'Technical SEO',
    impact: 'H1 tags help search engines understand page content hierarchy and main topics. Missing H1s can negatively impact rankings.',
    estimatedImprovement: '~5-10% ranking improvement',
    affectedPages: [
      {
        url: '/about-us',
        title: 'About Our Company',
        issue: 'No H1 tag found'
      },
      {
        url: '/contact',
        title: 'Contact Information',
        issue: 'No H1 tag found'
      }
    ],
    solution: {
      description: 'Add descriptive H1 tags to all pages that clearly describe the main topic.',
      codeExample: `<h1>About Our Audio Technology Company</h1>`,
      steps: [
        'Audit all pages missing H1 tags',
        'Create descriptive H1 content for each page',
        'Ensure H1 includes target keywords naturally',
        'Implement H1 tags in page templates',
        'Verify proper heading hierarchy (H1 > H2 > H3)'
      ]
    }
  },
  {
    id: '3',
    title: 'Thin Content Pages',
    description: '45 pages contain less than 300 words, which may be considered thin content by search engines.',
    priority: 'important',
    pageCount: 45,
    category: 'Content Quality',
    impact: 'Thin content pages may struggle to rank well. Adding valuable content can improve relevance and authority signals.',
    estimatedImprovement: '~10-20% content engagement',
    affectedPages: [
      {
        url: '/warranty',
        title: 'Product Warranty Information',
        issue: 'Only 127 words'
      },
      {
        url: '/shipping',
        title: 'Shipping Information',
        issue: 'Only 89 words'
      }
    ],
    solution: {
      description: 'Expand content with relevant information, FAQs, and detailed explanations.',
      steps: [
        'Identify pages with less than 300 words',
        'Research related topics and user questions',
        'Add comprehensive information and FAQ sections',
        'Include relevant internal links',
        'Optimize content for target keywords'
      ]
    }
  },
  {
    id: '4',
    title: 'Missing Alt Text on Images',
    description: '234 images are missing alt text, affecting accessibility and image SEO.',
    priority: 'important',
    pageCount: 89,
    category: 'Accessibility',
    impact: 'Alt text improves accessibility for screen readers and helps search engines understand image content.',
    estimatedImprovement: '~5-8% accessibility score',
    affectedPages: [
      {
        url: '/gallery',
        title: 'Product Gallery',
        issue: '12 images without alt text'
      }
    ],
    solution: {
      description: 'Add descriptive alt text to all images describing their content and context.',
      codeExample: `<img src="headphones.jpg" alt="Premium wireless headphones with noise cancellation" />`,
      steps: [
        'Audit all images missing alt text',
        'Write descriptive alt text for each image',
        'Include keywords naturally when relevant',
        'Implement alt text in image templates',
        'Test with screen readers for accessibility'
      ]
    }
  },
  {
    id: '5',
    title: 'Add FAQ Schema for Better Visibility',
    description: 'Adding FAQ schema to relevant pages can improve search result visibility with rich snippets.',
    priority: 'optimization',
    pageCount: 12,
    category: 'Schema Enhancement',
    impact: 'FAQ rich snippets can significantly increase visibility and click-through rates in search results.',
    estimatedImprovement: '~20-35% SERP visibility',
    affectedPages: [
      {
        url: '/support/faq',
        title: 'Frequently Asked Questions',
        issue: 'Could benefit from FAQ schema'
      }
    ],
    solution: {
      description: 'Implement FAQ schema markup on pages with question-and-answer content.',
      codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is the battery life?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Our wireless headphones offer up to 30 hours of battery life."
    }
  }]
}
</script>`,
      steps: [
        'Identify pages with FAQ content',
        'Structure content in question-answer format',
        'Implement FAQ schema markup',
        'Test with Google\'s Rich Results Test',
        'Monitor for FAQ rich snippets in search results'
      ]
    }
  },
  {
    id: '6',
    title: 'Internal Linking Opportunities',
    description: 'Found 89 opportunities to improve internal linking structure for better page authority distribution.',
    priority: 'optimization',
    pageCount: 156,
    category: 'Internal Links',
    impact: 'Better internal linking helps distribute page authority and improves user navigation and SEO.',
    estimatedImprovement: '~8-15% internal traffic',
    affectedPages: [
      {
        url: '/blog/audio-quality-tips',
        title: 'Audio Quality Tips',
        issue: 'Could link to product pages'
      }
    ],
    solution: {
      description: 'Add contextual internal links to related products, categories, and content.',
      steps: [
        'Analyze current internal linking patterns',
        'Identify relevant linking opportunities',
        'Add contextual internal links',
        'Ensure natural anchor text usage',
        'Monitor internal link distribution and flow'
      ]
    }
  }
];

export function IssuesSection() {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'critical' | 'important' | 'optimization'>('all');

  const getPriorityCount = (priority: AuditIssue['priority']) => {
    return mockIssues.filter(issue => issue.priority === priority).length;
  };

  const getFilteredIssues = () => {
    if (selectedPriority === 'all') return mockIssues;
    return mockIssues.filter(issue => issue.priority === selectedPriority);
  };

  const getTotalAffectedPages = (priority?: AuditIssue['priority']) => {
    const issues = priority ? mockIssues.filter(issue => issue.priority === priority) : mockIssues;
    return issues.reduce((total, issue) => total + issue.pageCount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Issues & Opportunities</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${selectedPriority === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setSelectedPriority('all')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{mockIssues.length}</div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getTotalAffectedPages()} pages affected
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-l-4 border-l-red-500 ${selectedPriority === 'critical' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setSelectedPriority('critical')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{getPriorityCount('critical')}</div>
            </div>
            <div className="text-sm text-red-700 font-medium">Critical</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getTotalAffectedPages('critical')} pages
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-l-4 border-l-yellow-500 ${selectedPriority === 'important' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setSelectedPriority('important')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{getPriorityCount('important')}</div>
            </div>
            <div className="text-sm text-yellow-700 font-medium">Important</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getTotalAffectedPages('important')} pages
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-l-4 border-l-green-500 ${selectedPriority === 'optimization' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setSelectedPriority('optimization')}
        >
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{getPriorityCount('optimization')}</div>
            </div>
            <div className="text-sm text-green-700 font-medium">Optimizations</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getTotalAffectedPages('optimization')} pages
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {getFilteredIssues().map((issue) => (
          <IssueCard 
            key={issue.id} 
            issue={issue}
            onGenerateFix={(issueId) => console.log('Generating fix for:', issueId)}
          />
        ))}
      </div>

      {getFilteredIssues().length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No issues found</h3>
            <p className="text-muted-foreground">
              {selectedPriority === 'all' 
                ? 'Great! No issues detected in your site audit.' 
                : `No ${selectedPriority} issues found.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}