import { useState } from 'react';
import { X, Save, Eye, Code, Link2, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface OptimizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string | null;
  optimizationType: 'meta' | 'schema' | 'content' | null;
}

export function OptimizationPanel({ isOpen, onClose, nodeId, optimizationType }: OptimizationPanelProps) {
  const [metaTitle, setMetaTitle] = useState('Best Product Category - Your Store');
  const [metaDescription, setMetaDescription] = useState('Discover our amazing product category with top-quality items and great prices. Shop now for fast delivery.');
  const [schemaType, setSchemaType] = useState('Product');
  const [contentSuggestions] = useState([
    'Add FAQ section to improve user engagement',
    'Include customer testimonials for trust building',
    'Optimize product descriptions with target keywords',
    'Add related product recommendations'
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success('Optimization settings saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              {optimizationType === 'meta' && <FileText className="h-4 w-4 text-primary-foreground" />}
              {optimizationType === 'schema' && <Code className="h-4 w-4 text-primary-foreground" />}
              {optimizationType === 'content' && <Edit className="h-4 w-4 text-primary-foreground" />}
            </div>
            <h2 className="text-lg font-semibold">
              Optimize {optimizationType === 'meta' ? 'Meta Tags' : optimizationType === 'schema' ? 'Schema Markup' : 'Content'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <Tabs defaultValue={optimizationType || 'meta'} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meta">Meta Tags</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meta" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta-title" className="text-sm font-medium">Meta Title</Label>
                  <Input
                    id="meta-title"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="mt-1"
                    placeholder="Enter page title..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metaTitle.length}/60 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="meta-description" className="text-sm font-medium">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="mt-1"
                    placeholder="Enter page description..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metaDescription.length}/160 characters
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Preview</h4>
                  <div className="space-y-1">
                    <div className="text-blue-600 text-sm font-medium">{metaTitle}</div>
                    <div className="text-green-600 text-xs">https://example.com/category</div>
                    <div className="text-gray-600 text-sm">{metaDescription}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schema" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Schema Type</Label>
                  <select 
                    className="w-full mt-1 p-2 border border-input rounded-md"
                    value={schemaType}
                    onChange={(e) => setSchemaType(e.target.value)}
                  >
                    <option value="Product">Product</option>
                    <option value="Article">Article</option>
                    <option value="Organization">Organization</option>
                    <option value="LocalBusiness">Local Business</option>
                    <option value="FAQ">FAQ</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Generated Schema</h4>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
{`{
  "@context": "https://schema.org/",
  "@type": "${schemaType}",
  "name": "Product Name",
  "description": "Product description...",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  }
}`}
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-3">AI Content Suggestions</h4>
                  <div className="space-y-3">
                    {contentSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <span className="text-sm flex-1">{suggestion}</span>
                        <Button variant="ghost" size="sm">
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-3">Internal Linking Opportunities</h4>
                  <div className="space-y-2">
                    {['Related Product A', 'Category Overview', 'Brand Information'].map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{link}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Add Link
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}