import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SchemaGenerator } from '@/components/content-builder/SchemaGenerator';
import { ContentOptimizer } from '@/components/content-builder/ContentOptimizer';
import { MetaTagBuilder } from '@/components/content-builder/MetaTagBuilder';
import { Code, Edit3, Tag } from 'lucide-react';

export default function ContentBuilder() {
  return (
    <div className="space-y-6 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Content Builder</h1>
        <p className="text-muted-foreground">Create and optimize content with AI-powered tools for better SEO performance</p>
      </div>

      <Tabs defaultValue="schema" className="h-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Schema Generator
          </TabsTrigger>
          <TabsTrigger value="optimizer" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Content Optimizer
          </TabsTrigger>
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Meta Tag Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="mt-0 h-[calc(100%-4rem)]">
          <SchemaGenerator />
        </TabsContent>

        <TabsContent value="optimizer" className="mt-0 h-[calc(100%-4rem)]">
          <ContentOptimizer />
        </TabsContent>

        <TabsContent value="meta" className="mt-0 h-[calc(100%-4rem)]">
          <MetaTagBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}