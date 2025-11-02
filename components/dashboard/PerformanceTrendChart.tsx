"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceTrendChartProps {
  data: Array<{ date: string; score: number }>;
}

export function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
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
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
        <XAxis 
          dataKey="date" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
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
          cursor={{ stroke: 'hsl(var(--chart-1))', strokeWidth: 1, strokeDasharray: '5 5' }}
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
          fill="url(#scoreGradient)"
        />
      </LineChart>
    </ChartContainer>
  );
}
