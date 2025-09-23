import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

export function ROICalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    monthlySearches: 50000,
    conversionRate: 2,
    customerLTV: 5000
  });

  const calculate = () => {
    const aiAdoptionRate = 0.6; // 60%
    const aiQueries = formData.monthlySearches * aiAdoptionRate;
    const currentCitationRate = 0.05; // 5%
    const optimizedCitationRate = 0.25; // 25% with PulseSpark
    
    const currentCitations = aiQueries * currentCitationRate;
    const optimizedCitations = aiQueries * optimizedCitationRate;
    
    const currentCustomers = currentCitations * (formData.conversionRate / 100);
    const optimizedCustomers = optimizedCitations * (formData.conversionRate / 100);
    
    const currentRevenue = currentCustomers * formData.customerLTV;
    const potentialRevenue = optimizedCustomers * formData.customerLTV;
    
    return {
      aiQueries,
      currentCitations,
      optimizedCitations,
      currentRevenue,
      potentialRevenue,
      opportunity: potentialRevenue - currentRevenue
    };
  };

  const results = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Your AEO Opportunity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">AEO ROI Calculator</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, industry: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="services">Professional Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="searches">Monthly Searches</Label>
              <Input
                id="searches"
                type="number"
                value={formData.monthlySearches}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  monthlySearches: parseInt(e.target.value) || 0 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="conversion">Conversion Rate (%)</Label>
              <Input
                id="conversion"
                type="number"
                step="0.1"
                value={formData.conversionRate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  conversionRate: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="ltv">Customer LTV ($)</Label>
              <Input
                id="ltv"
                type="number"
                value={formData.customerLTV}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customerLTV: parseInt(e.target.value) || 0 
                }))}
              />
            </div>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            <Card className="p-4 bg-muted">
              <h3 className="font-semibold mb-3">Opportunity Analysis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly searches:</span>
                  <span>{formData.monthlySearches.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI adoption (60%):</span>
                  <span>{Math.round(results.aiQueries).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current citations:</span>
                  <span>{Math.round(results.currentCitations)}</span>
                </div>
                <div className="flex justify-between">
                  <span>With PulseSpark:</span>
                  <span>{Math.round(results.optimizedCitations)}</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-citation-high">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-citation-high" />
                <h3 className="font-semibold">Revenue Impact</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Currently capturing:</span>
                  <span>${Math.round(results.currentRevenue).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential with PulseSpark:</span>
                  <span>${Math.round(results.potentialRevenue).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-citation-high">
                    <span>Monthly Opportunity:</span>
                    <span>+${Math.round(results.opportunity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="text-xs text-muted-foreground text-center">
              Based on industry averages and AI adoption rates
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button className="bg-citation-high text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Start Optimization
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}