"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

interface EngagementChartProps {
  data: Array<{ month: string; activeUsers: number }>;
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <ChartContainer
      config={{
        activeUsers: {
          label: "Active Users",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[320px] w-full"
    >
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
            <stop offset="50%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
        <XAxis 
          dataKey="month" 
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
        />
        <ChartTooltip 
          content={<ChartTooltipContent />}
          cursor={{ stroke: 'hsl(var(--chart-1))', strokeWidth: 1, strokeDasharray: '5 5' }}
        />
        <Area 
          type="monotone" 
          dataKey="activeUsers" 
          stroke="hsl(var(--chart-1))" 
          fillOpacity={1} 
          fill="url(#colorUsers)" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
