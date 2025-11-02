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

interface ModuleChartProps {
  data: Array<{ module: string; completions: number }>;
}

export function ModuleChart({ data }: ModuleChartProps) {
  return (
    <ChartContainer
      config={{
        completions: {
          label: "Completions",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[320px] w-full"
    >
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
        <XAxis 
          type="number"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          dataKey="module" 
          type="category"
          width={120}
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <ChartTooltip 
          content={<ChartTooltipContent />}
          cursor={{ fill: 'hsl(var(--chart-2))', opacity: 0.1 }}
        />
        <Bar 
          dataKey="completions" 
          radius={[0, 6, 6, 0]}
          maxBarSize={30}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`hsl(var(--chart-2))`}
              opacity={1 - (index * 0.08)}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
