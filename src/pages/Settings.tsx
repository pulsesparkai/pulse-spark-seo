import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Clock, 
  Users, 
  Bell, 
  Download, 
  Globe, 
  Trash2,
  Plus,
  X
} from "lucide-react";

export default function Settings() {
  const [crawlFrequency, setCrawlFrequency] = useState("weekly");
  const [competitors, setCompetitors] = useState([
    "example-competitor.com",
    "another-competitor.com",
    "market-leader.com"
  ]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [notifications, setNotifications] = useState({
    schemaOpportunities: true,
    competitorUpdates: true,
    crawlComplete: true,
    performanceAlerts: true,
    weeklyReports: false,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const addCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor("");
      toast({
        title: "Competitor Added",
        description: `Now tracking ${newCompetitor}`,
      });
    }
  };

  const removeCompetitor = (domain: string) => {
    setCompetitors(competitors.filter(c => c !== domain));
    toast({
      title: "Competitor Removed",
      description: `No longer tracking ${domain}`,
    });
  };

  const exportData = (type: string) => {
    toast({
      title: "Export Started",
      description: `Preparing your ${type} export...`,
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Ready",
        description: `Your ${type} has been exported successfully.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your SEO monitoring and analysis preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Crawl Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Crawl Settings</CardTitle>
              <CardDescription>Configure how often your site is analyzed</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crawl-frequency">Crawl Frequency</Label>
              <Select value={crawlFrequency} onValueChange={setCrawlFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="crawl-depth">Maximum Crawl Depth</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 levels</SelectItem>
                  <SelectItem value="5">5 levels</SelectItem>
                  <SelectItem value="10">10 levels</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exclude-patterns">Exclude URL Patterns</Label>
              <Textarea 
                placeholder="Enter URL patterns to exclude, one per line&#10;/admin/*&#10;/test/*&#10;*.pdf"
                className="h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Competitor Tracking */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Competitor Tracking</CardTitle>
              <CardDescription>Monitor your competitors' SEO performance</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Tracked Competitors</Label>
              <div className="space-y-2">
                {competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{competitor}</span>
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeCompetitor(competitor)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="competitor-domain.com"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
              />
              <Button onClick={addCompetitor} disabled={!newCompetitor.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries({
                schemaOpportunities: "Schema markup opportunities detected",
                competitorUpdates: "Competitor content or ranking changes",
                crawlComplete: "Site crawl and analysis completion",
                performanceAlerts: "Performance issues or drops",
                weeklyReports: "Weekly SEO performance summary",
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="text-sm font-normal">
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download your SEO data and reports</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => exportData("SEO Report")}
              >
                <Download className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">SEO Report</div>
                  <div className="text-xs text-muted-foreground">Comprehensive PDF</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => exportData("Raw Data")}
              >
                <Download className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Raw Data</div>
                  <div className="text-xs text-muted-foreground">CSV Export</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => exportData("Competitor Analysis")}
              >
                <Download className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Competitor Data</div>
                  <div className="text-xs text-muted-foreground">Excel Report</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-between items-center">
          <Button onClick={handleSaveSettings} className="px-8">
            Save Settings
          </Button>
          
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}