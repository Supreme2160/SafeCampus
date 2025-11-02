"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadialBar,
  RadialBarChart,
  Legend,
  PolarAngleAxis,
} from "recharts";

interface ProgressRadialChartProps {
  modulesCompleted: number;
  totalModules: number;
  avgScore: number;
}

export function ProgressRadialChart({ modulesCompleted, totalModules, avgScore }: ProgressRadialChartProps) {
  const moduleProgress = totalModules > 0 ? (modulesCompleted / totalModules) * 100 : 0;
  
  const data = [
    {
      name: 'Avg Score',
      value: avgScore,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'Modules',
      value: moduleProgress,
      fill: 'hsl(var(--chart-2))',
    },
  ];

  return (
    <ChartContainer
      config={{
        value: {
          label: "Progress",
        },
      }}
      className="h-80 w-full"
    >
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="30%" 
        outerRadius="90%" 
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          label={{ 
            position: 'insideStart', 
            fill: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            formatter: (value: number) => `${Math.round(value)}%`
          }}
        />
        <Legend 
          iconSize={12}
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value, entry: any) => (
            <span className="text-sm">
              {value}: {Math.round(entry.payload.value)}%
            </span>
          )}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </RadialBarChart>
    </ChartContainer>
  );
}
