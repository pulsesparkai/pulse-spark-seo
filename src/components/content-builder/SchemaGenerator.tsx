import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Code, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const schemaTypes = {
  Product: {
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    availability: 'https://schema.org/InStock',
    brand: '',
    category: ''
  },
  FAQ: {
    mainEntity: [
      { question: '', answer: '' }
    ]
  },
  LocalBusiness: {
    name: '',
    address: '',
    telephone: '',
    openingHours: '',
    priceRange: '',
    description: ''
  },
  Article: {
    headline: '',
    author: '',
    datePublished: '',
    description: '',
    articleBody: ''
  },
  Review: {
    itemReviewed: '',
    author: '',
    reviewRating: '5',
    reviewBody: '',
    datePublished: ''
  }
};

export function SchemaGenerator() {
  const [selectedType, setSelectedType] = useState<keyof typeof schemaTypes>('Product');
  const [formData, setFormData] = useState<any>(schemaTypes.Product);
  const [isValidated, setIsValidated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTypeChange = (type: keyof typeof schemaTypes) => {
    setSelectedType(type);
    setFormData(schemaTypes[type]);
    setIsValidated(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setIsValidated(false);
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    if (selectedType === 'FAQ') {
      const newFAQ = [...(formData as any).mainEntity];
      newFAQ[index] = { ...newFAQ[index], [field]: value };
      setFormData({ mainEntity: newFAQ });
    }
  };

  const addFAQItem = () => {
    if (selectedType === 'FAQ') {
      const newFAQ = [...(formData as any).mainEntity, { question: '', answer: '' }];
      setFormData({ mainEntity: newFAQ });
    }
  };

  const generateFromContent = async () => {
    setIsGenerating(true);
    try {
      // Mock AI generation - in real app, this would analyze page content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedType === 'Product') {
        setFormData({
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: '299.99',
          currency: 'USD',
          availability: 'https://schema.org/InStock',
          brand: 'AudioTech',
          category: 'Electronics'
        });
      }
      
      toast.success('Schema fields generated from content!');
    } catch (error) {
      toast.error('Failed to generate schema fields');
    } finally {
      setIsGenerating(false);
    }
  };

  const validateSchema = () => {
    // Mock validation - in real app, this would validate against schema.org
    setTimeout(() => {
      setIsValidated(true);
      toast.success('Schema validation passed!');
    }, 1000);
  };

  const generateJSONLD = () => {
    const schema: any = {
      "@context": "https://schema.org/",
      "@type": selectedType,
      ...formData
    };

    if (selectedType === 'FAQ' && formData.mainEntity) {
      schema.mainEntity = formData.mainEntity.map((item: any) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }));
    }

    return JSON.stringify(schema, null, 2);
  };

  const renderFormFields = () => {
    switch (selectedType) {
      case 'Product':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={(formData as any).name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={(formData as any).description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={(formData as any).price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="29.99"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={(formData as any).brand || ''}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Brand name"
                />
              </div>
            </div>
          </div>
        );

      case 'FAQ':
        return (
          <div className="space-y-4">
            {((formData as any).mainEntity || []).map((item: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label>Question {index + 1}</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                      placeholder="Enter answer"
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addFAQItem} className="w-full">
              Add FAQ Item
            </Button>
          </div>
        );

      case 'LocalBusiness':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={(formData as any).name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter business name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={(formData as any).address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telephone">Phone</Label>
                <Input
                  id="telephone"
                  value={(formData as any).telephone || ''}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  value={(formData as any).priceRange || ''}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  placeholder="$$"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={(formData as any).headline || (formData as any).itemReviewed || ''}
                onChange={(e) => handleInputChange(selectedType === 'Article' ? 'headline' : 'itemReviewed', e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={(formData as any).author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Author name"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Schema Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Schema Generator</h2>
          <Button
            onClick={generateFromContent}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate from Content'}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Schema Type</Label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {Object.keys(schemaTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderFormFields()}

          <div className="flex gap-2">
            <Button onClick={validateSchema} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Validate Schema
            </Button>
            {isValidated && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Valid</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">JSON-LD Preview</h3>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="relative">
          <pre className="bg-gray-50 border rounded-lg p-4 text-sm overflow-auto h-96 font-mono">
            {generateJSONLD()}
          </pre>
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="sm">
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}