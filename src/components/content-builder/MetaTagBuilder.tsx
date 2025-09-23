import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CompetitorData {
  domain: string;
  title: string;
  description: string;
  titleLength: number;
  descriptionLength: number;
  score: 'good' | 'fair' | 'poor';
}

export function MetaTagBuilder() {
  const [title, setTitle] = useState('Premium Wireless Headphones - Best Audio Quality | AudioTech');
  const [description, setDescription] = useState('Discover our premium wireless headphones with advanced noise cancellation, 30-hour battery life, and crystal-clear audio quality. Free shipping on orders over $50.');
  const [url, setUrl] = useState('https://audiotech.com/wireless-headphones');
  const [isGenerating, setIsGenerating] = useState(false);

  const [competitors] = useState<CompetitorData[]>([
    {
      domain: 'competitor1.com',
      title: 'Best Wireless Headphones 2024 - Premium Sound Quality',
      description: 'Shop the best wireless headphones with superior sound quality, long battery life, and comfortable design. Free returns within 30 days.',
      titleLength: 59,
      descriptionLength: 142,
      score: 'good'
    },
    {
      domain: 'competitor2.com',  
      title: 'Wireless Headphones | Noise Canceling | Free Shipping',
      description: 'High-quality wireless headphones with active noise cancellation technology. Perfect for music lovers and professionals.',
      titleLength: 62,
      descriptionLength: 125,
      score: 'fair'
    },
    {
      domain: 'competitor3.com',
      title: 'Premium Audio Headphones - Wireless & Wired Options Available Now',
      description: 'Get the best audio experience with our premium headphones. Multiple connectivity options, premium materials, exceptional sound quality for audiophiles and casual listeners alike.',
      titleLength: 78,
      descriptionLength: 178,
      score: 'poor'
    }
  ]);

  const titleLength = title.length;
  const descriptionLength = description.length;

  const getTitleStatus = () => {
    if (titleLength <= 60) return { status: 'good', color: 'text-green-600' };
    if (titleLength <= 70) return { status: 'warning', color: 'text-yellow-600' };
    return { status: 'error', color: 'text-red-600' };
  };

  const getDescriptionStatus = () => {
    if (descriptionLength >= 120 && descriptionLength <= 160) return { status: 'good', color: 'text-green-600' };
    if (descriptionLength <= 180) return { status: 'warning', color: 'text-yellow-600' };
    return { status: 'error', color: 'text-red-600' };
  };

  const generateFromContent = async () => {
    setIsGenerating(true);
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: `Generate optimized meta title and description for a wireless headphones product page. The content should be SEO-friendly and compelling for users.

Requirements:
- Title: Under 60 characters, include main keyword "wireless headphones"
- Description: 120-160 characters, include key benefits and call to action
- Focus on premium quality, noise cancellation, battery life
- Make it compelling for both search engines and users

Please provide both title and description in this format:
Title: [your title]
Description: [your description]` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to generate meta tags");
      }

      const response = functionData?.response;
      if (response) {
        // Parse the AI response
        const titleMatch = response.match(/Title:\s*(.+)/i);
        const descMatch = response.match(/Description:\s*(.+)/i);
        
        if (titleMatch) setTitle(titleMatch[1].trim());
        if (descMatch) setDescription(descMatch[1].trim());
        
        toast.success('Meta tags generated successfully!');
      }
    } catch (error) {
      console.error('Error generating meta tags:', error);
      toast.error('Failed to generate meta tags. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const getScoreBadge = (score: CompetitorData['score']) => {
    const colors = {
      good: 'bg-green-100 text-green-800 border-green-200',
      fair: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      poor: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[score];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Meta Tag Editor */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Meta Tag Builder</h2>
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

        <div className="space-y-6">
          {/* Page URL */}
          <div>
            <Label htmlFor="url">Page URL</Label>
            <div className="flex mt-1">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="flex-1"
              />
              <Button variant="ghost" size="sm" className="ml-2">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Meta Title</Label>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getTitleStatus().color}`}>
                  {titleLength}/60
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(title, 'Title')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meta title"
              className="mt-1"
            />
            {titleLength > 60 && (
              <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                <AlertTriangle className="h-3 w-3" />
                Title may be truncated in search results
              </div>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Meta Description</Label>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getDescriptionStatus().color}`}>
                  {descriptionLength}/160
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(description, 'Description')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meta description"
              rows={3}
              className="mt-1"
            />
            {descriptionLength < 120 && (
              <div className="flex items-center gap-2 mt-1 text-sm text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                Description could be longer for better SEO
              </div>
            )}
          </div>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Google Search Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white border rounded-lg">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">
                  {title || 'Your Meta Title Here'}
                </div>
                <div className="text-green-600 text-sm mb-2">
                  {url || 'https://example.com/page'}
                </div>
                <div className="text-gray-600 text-sm leading-relaxed">
                  {description || 'Your meta description will appear here. Make it compelling and informative to encourage clicks.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Competitor Analysis</h3>
          <Button variant="outline" size="sm">
            Refresh Data
          </Button>
        </div>

        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{competitor.domain}</CardTitle>
                  <Badge className={getScoreBadge(competitor.score)}>
                    {competitor.score}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Title</span>
                    <span>{competitor.titleLength}/60</span>
                  </div>
                  <p className="text-sm text-blue-600 leading-tight">
                    {competitor.title}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Description</span>
                    <span>{competitor.descriptionLength}/160</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-tight">
                    {competitor.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    {competitor.titleLength <= 60 && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {competitor.descriptionLength >= 120 && competitor.descriptionLength <= 160 && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Title Optimization</span>
                <div className="flex items-center gap-2">
                  {getTitleStatus().status === 'good' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {getTitleStatus().status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  <span className={`text-sm font-medium ${getTitleStatus().color}`}>
                    {getTitleStatus().status === 'good' ? 'Excellent' : getTitleStatus().status === 'warning' ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Description Quality</span>
                <div className="flex items-center gap-2">
                  {getDescriptionStatus().status === 'good' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {getDescriptionStatus().status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  <span className={`text-sm font-medium ${getDescriptionStatus().color}`}>
                    {getDescriptionStatus().status === 'good' ? 'Excellent' : getDescriptionStatus().status === 'warning' ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>

              <Separator />
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {getTitleStatus().status === 'good' && getDescriptionStatus().status === 'good' ? '95' : 
                   getTitleStatus().status === 'good' || getDescriptionStatus().status === 'good' ? '78' : '62'}/100
                </div>
                <p className="text-xs text-muted-foreground">Overall SEO Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}