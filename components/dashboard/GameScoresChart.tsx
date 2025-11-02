"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface GameScoresChartProps {
  data: Array<{ game: string; score: number }>;
}

const getColor = (score: number) => {
  if (score >= 70) return "hsl(var(--chart-2))"; // Green
  if (score >= 50) return "hsl(var(--chart-3))"; // Yellow
  return "hsl(var(--chart-5))"; // Orange/Red
};

export function GameScoresChart({ data }: GameScoresChartProps) {
  return (
    <ChartContainer
      config={{
        score: {
          label: "Score",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-80 w-full"
    >
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
        <XAxis 
          dataKey="game" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          domain={[0, 100]}
        />
        <ChartTooltip 
          content={<ChartTooltipContent />}
          cursor={{ fill: 'hsl(var(--chart-1))', opacity: 0.1 }}
        />
        <Bar 
          dataKey="score" 
          radius={[6, 6, 0, 0]}
          maxBarSize={50}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getColor(entry.score)}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
