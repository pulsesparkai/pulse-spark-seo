import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  popular?: boolean;
  enterprise?: boolean;
  features: string[];
  limits: {
    pages: string;
    analyses: string;
    competitors: string;
    extras?: string[];
  };
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 79,
    description: "Perfect for small sites",
    features: [
      "AEO Health Score",
      "Basic AI Citation Tracking",
      "Content Optimization",
      "Email Support"
    ],
    limits: {
      pages: "1,000 pages analyzed",
      analyses: "100 AI analyses",
      competitors: "2 competitors tracked"
    }
  },
  {
    name: "Professional",
    price: 199,
    description: "Most popular",
    popular: true,
    features: [
      "Everything in Starter",
      "Advanced Citation Analytics",
      "Competitor Intelligence",
      "API Access",
      "Priority Support"
    ],
    limits: {
      pages: "5,000 pages analyzed",
      analyses: "500 AI analyses",
      competitors: "5 competitors tracked",
      extras: ["API access", "Custom reports"]
    }
  },
  {
    name: "Business",
    price: 399,
    description: "For serious brands",
    enterprise: true,
    features: [
      "Everything in Professional",
      "White-label Reports",
      "Advanced Automation",
      "Dedicated Support",
      "Custom Integrations"
    ],
    limits: {
      pages: "25,000 pages analyzed",
      analyses: "2,000 AI analyses",
      competitors: "10 competitors tracked",
      extras: ["White-label reports", "Dedicated account manager"]
    }
  }
];

export function PricingTiers() {
  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold">Investor-Ready Pricing</h3>
        <p className="text-sm text-muted-foreground">Transparent, scalable, profitable</p>
      </div>

      <div className="space-y-4">
        {pricingTiers.map((tier, index) => (
          <Card key={index} className={`p-4 relative ${
            tier.popular ? 'border-citation-high border-2 bg-citation-high/5' : ''
          } ${tier.enterprise ? 'border-primary border-2 bg-primary/5' : ''}`}>
            {tier.popular && (
              <Badge className="absolute -top-2 left-4 bg-citation-high text-white">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            {tier.enterprise && (
              <Badge className="absolute -top-2 left-4 bg-primary text-white">
                <Crown className="h-3 w-3 mr-1" />
                Enterprise
              </Badge>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg">{tier.name}</h4>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${tier.price}</div>
                <div className="text-sm text-muted-foreground">/month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Limits:</h5>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {tier.limits.pages}</li>
                  <li>• {tier.limits.analyses}</li>
                  <li>• {tier.limits.competitors}</li>
                  {tier.limits.extras?.map((extra, i) => (
                    <li key={i}>• {extra}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Features:</h5>
                <ul className="text-xs space-y-1">
                  {tier.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-citation-high" />
                      {feature}
                    </li>
                  ))}
                  {tier.features.length > 3 && (
                    <li className="text-muted-foreground">+{tier.features.length - 3} more...</li>
                  )}
                </ul>
              </div>
            </div>

            <Button 
              className={`w-full ${
                tier.popular ? 'bg-citation-high text-white' : 
                tier.enterprise ? 'bg-primary text-white' : ''
              }`}
              variant={tier.popular || tier.enterprise ? "default" : "outline"}
            >
              {tier.enterprise && <Crown className="h-4 w-4 mr-2" />}
              {tier.popular && <Zap className="h-4 w-4 mr-2" />}
              Start {tier.name}
            </Button>
          </Card>
        ))}
      </div>

      {/* Profit Margins for Investors */}
      <Card className="mt-6 p-4 bg-muted/30">
        <h4 className="font-medium text-sm mb-3">Unit Economics (Investor View)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-citation-high">$47</div>
            <div className="text-xs text-muted-foreground">CAC</div>
          </div>
          <div>
            <div className="text-lg font-bold text-citation-high">$199</div>
            <div className="text-xs text-muted-foreground">ARPU/mo</div>
          </div>
          <div>
            <div className="text-lg font-bold text-citation-high">85%</div>
            <div className="text-xs text-muted-foreground">Gross Margin</div>
          </div>
          <div>
            <div className="text-lg font-bold text-citation-high">14 days</div>
            <div className="text-xs text-muted-foreground">Payback</div>
          </div>
        </div>
      </Card>
    </Card>
  );
}