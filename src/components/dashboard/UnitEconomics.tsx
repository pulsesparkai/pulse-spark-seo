import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, DollarSign, Users, Target, BarChart3 } from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  infrastructureCost: number;
  grossProfit: number;
  margin: number;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 79,
    infrastructureCost: 11.85,
    grossProfit: 67.15,
    margin: 85
  },
  {
    name: "Professional", 
    price: 199,
    infrastructureCost: 29.85,
    grossProfit: 169.15,
    margin: 85
  },
  {
    name: "Business",
    price: 399,
    infrastructureCost: 59.85,
    grossProfit: 339.15,
    margin: 85
  }
];

const investorMetrics = {
  arpu: 199,
  cac: 47,
  ltv: 4776,
  ltvCacRatio: 101,
  grossMargin: 85,
  paybackPeriod: 14
};

const scalabilityData = [
  { customers: 100, profit: 16900 },
  { customers: 1000, profit: 169000 },
  { customers: 10000, profit: 1690000 }
];

const competitorMargins = [
  { name: "Semrush", margin: 60 },
  { name: "Ahrefs", margin: 65 },
  { name: "PulseSpark", margin: 85 }
];

export function UnitEconomics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Unit Economics & Business Model</CardTitle>
          <CardDescription>Transparent pricing structure and investor metrics</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Pricing & Margins Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing & Margins Breakdown
          </h4>
          <div className="space-y-3">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tier.name} Plan - ${tier.price}/month</span>
                  <Badge variant="secondary">{tier.margin}% margin</Badge>
                </div>
                <div className="ml-4 space-y-1 text-sm text-muted-foreground font-mono">
                  <div>├─ Revenue per user: ${tier.price}</div>
                  <div>├─ Infrastructure cost: ${tier.infrastructureCost}</div>
                  <div>├─ Gross Profit: ${tier.grossProfit}</div>
                  <div>└─ Margin: {tier.margin}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Investor Metrics Dashboard */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Key Investor Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-bold text-primary">${investorMetrics.arpu}</div>
              <div className="text-xs text-muted-foreground">Average Revenue Per User (ARPU)</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-bold text-primary">${investorMetrics.cac}</div>
              <div className="text-xs text-muted-foreground">Customer Acquisition Cost (CAC)</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-bold text-primary">${investorMetrics.ltv.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Lifetime Value (LTV)</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-bold text-citation-high">{investorMetrics.ltvCacRatio}x</div>
              <div className="text-xs text-muted-foreground">LTV/CAC Ratio</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-bold text-citation-high">{investorMetrics.grossMargin}%</div>
              <div className="text-xs text-muted-foreground">Gross Margin</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-lg font-bold text-citation-high">{investorMetrics.paybackPeriod} days</div>
              <div className="text-xs text-muted-foreground">Payback Period</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Scalability Visualization */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Profit Scales with Growth
          </h4>
          <div className="space-y-3">
            {scalabilityData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.customers.toLocaleString()} customers</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">${data.profit.toLocaleString()}/mo</div>
                  <div className="text-xs text-muted-foreground">Monthly Profit</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Competitive Advantage */}
        <div className="space-y-4">
          <h4 className="font-semibold">Our Efficiency vs Competition</h4>
          <div className="space-y-2">
            {competitorMargins.map((competitor, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded">
                <span className="text-sm">{competitor.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        competitor.name === 'PulseSpark' 
                          ? 'bg-citation-high' 
                          : 'bg-muted-foreground/40'
                      }`}
                      style={{ width: `${(competitor.margin / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12">{competitor.margin}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-citation-high/10 rounded-lg border border-citation-high/20">
            <div className="text-sm text-citation-high font-medium">
              → AI-native architecture = higher margins
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}