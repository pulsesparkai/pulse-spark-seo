import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  PlayCircle, 
  Download,
  Eye,
  Trash2,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HistoryEntry {
  id: string;
  prompt: string;
  timestamp: Date;
  findingsCount: number;
  completionTime: string;
  totalPages: number;
  type: 'prebuilt' | 'custom';
  status: 'completed' | 'failed' | 'running';
}

const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    prompt: 'Find pages that could rank for "wireless headphones"',
    timestamp: new Date('2024-01-15T14:30:00'),
    findingsCount: 12,
    completionTime: '2m 34s',
    totalPages: 1247,
    type: 'prebuilt',
    status: 'completed'
  },
  {
    id: '2',
    prompt: 'Identify content gaps vs competitors',
    timestamp: new Date('2024-01-10T09:15:00'),
    findingsCount: 8,
    completionTime: '4m 12s',
    totalPages: 1247,
    type: 'prebuilt',
    status: 'completed'
  },
  {
    id: '3',
    prompt: 'Analyze my product pages for missing schema markup and identify opportunities to improve search visibility',
    timestamp: new Date('2024-01-08T16:45:00'),
    findingsCount: 15,
    completionTime: '1m 58s',
    totalPages: 1247,
    type: 'custom',
    status: 'completed'
  },
  {
    id: '4',
    prompt: 'Find internal linking opportunities between blog posts and product pages',
    timestamp: new Date('2024-01-05T11:20:00'),
    findingsCount: 23,
    completionTime: '3m 07s',
    totalPages: 1247,
    type: 'custom',
    status: 'completed'
  },
  {
    id: '5',
    prompt: 'Generate FAQ content from existing pages',
    timestamp: new Date('2024-01-03T13:55:00'),
    findingsCount: 0,
    completionTime: '45s',
    totalPages: 1247,
    type: 'prebuilt',
    status: 'failed'
  }
];

interface PromptHistoryProps {
  onViewResults?: (historyId: string) => void;
  onRerunPrompt?: (historyId: string) => void;
  onDeleteEntry?: (historyId: string) => void;
}

export function PromptHistory({ onViewResults, onRerunPrompt, onDeleteEntry }: PromptHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'failed'>('all');

  const filteredHistory = mockHistory.filter(entry => {
    const matchesSearch = entry.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: HistoryEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeBadge = (type: HistoryEntry['type']) => {
    return type === 'prebuilt' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Prompt History</h2>
        <Badge variant="outline">
          {mockHistory.length} total runs
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusBadge(entry.status)}>
                      {entry.status}
                    </Badge>
                    <Badge className={getTypeBadge(entry.type)}>
                      {entry.type}
                    </Badge>
                    {entry.status === 'completed' && entry.findingsCount > 0 && (
                      <Badge variant="outline">
                        {entry.findingsCount} findings
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {entry.prompt}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(entry.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {entry.totalPages.toLocaleString()} pages
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {entry.completionTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {entry.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewResults?.(entry.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRerunPrompt?.(entry.id)}
                    className="flex items-center gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Rerun
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEntry?.(entry.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No History Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedStatus !== 'all' 
                ? 'No prompts match the current filters.'
                : 'Your prompt history will appear here once you run your first analysis.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {mockHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {mockHistory.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Analyses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {mockHistory.filter(h => h.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {mockHistory.reduce((acc, h) => acc + h.findingsCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Findings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(mockHistory.reduce((acc, h) => {
                    const timeInSeconds = parseInt(h.completionTime.split('m')[0]) * 60 + 
                                        parseInt(h.completionTime.split('m')[1]);
                    return acc + timeInSeconds;
                  }, 0) / mockHistory.length / 60)}m
                </div>
                <div className="text-sm text-muted-foreground">Avg. Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}