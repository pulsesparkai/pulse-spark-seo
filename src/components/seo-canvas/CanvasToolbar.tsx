import { Plus, MousePointer, Edit, Sparkles, Download, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CanvasTool } from './types';

interface CanvasToolbarProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  onAddPage: () => void;
  onAISuggest: () => void;
  onExportSitemap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  selectedNodes: string[];
}

export function CanvasToolbar({ 
  activeTool, 
  onToolChange, 
  onAddPage, 
  onAISuggest, 
  onExportSitemap,
  onUndo,
  onRedo,
  selectedNodes 
}: CanvasToolbarProps) {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'add-page', icon: Plus, label: 'Add Page' },
    { id: 'bulk-edit', icon: Edit, label: 'Bulk Edit' },
  ] as const;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 bg-white border border-border rounded-lg shadow-lg p-2">
        {/* Navigation Tools */}
        <div className="flex gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange(tool.id as CanvasTool)}
              className="flex items-center gap-2"
            >
              <tool.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tool.label}</span>
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddPage}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Page</span>
        </Button>

        {selectedNodes.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Edit ({selectedNodes.length})</span>
          </Button>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* AI and Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAISuggest}
          className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Suggest</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportSitemap}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export Sitemap</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* History */}
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}