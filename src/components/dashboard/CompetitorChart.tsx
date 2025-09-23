import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend,
  Cell 
} from "recharts";

const competitorData = [
  {
    name: "Your Site",
    score: 87,
    organic: 12400,
    backlinks: 890,
    isYou: true
  },
  {
    name: "Competitor A",
    score: 92,
    organic: 18600,
    backlinks: 1240,
    isYou: false
  },
  {
    name: "Competitor B", 
    score: 79,
    organic: 8900,
    backlinks: 650,
    isYou: false
  },
  {
    name: "Competitor C",
    score: 85,
    organic: 15200,
    backlinks: 1100,
    isYou: false
  }
];

export function CompetitorChart() {
  return (
    <div className="bg-gradient-card border border-metric-card-border rounded-xl p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Competitor Analysis</h3>
        <p className="text-sm text-muted-foreground">SEO performance comparison</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={competitorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Legend 
              wrapperStyle={{ 
                fontSize: "12px", 
                color: "hsl(var(--muted-foreground))" 
              }}
            />
            <Bar 
              dataKey="score" 
              name="SEO Score"
              radius={[4, 4, 0, 0]}
            >
              {competitorData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isYou ? "hsl(var(--primary))" : "hsl(var(--muted))"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-status-surface rounded-lg">
          <div className="text-lg font-bold text-primary">2nd</div>
          <div className="text-muted-foreground">Position</div>
        </div>
        <div className="text-center p-3 bg-status-surface rounded-lg">
          <div className="text-lg font-bold text-primary">+5%</div>
          <div className="text-muted-foreground">vs Last Month</div>
        </div>
      </div>
    </div>
  );
}