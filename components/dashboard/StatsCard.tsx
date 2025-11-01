import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor = "bg-blue-600/15 dark:bg-blue-500/20",
  iconColor = "text-blue-600 dark:text-blue-400",
}: StatsCardProps) {
  return (
    <div className="rounded-2xl p-px bg-linear-to-br from-blue-400/30 to-indigo-400/20 dark:from-blue-400/30 dark:to-indigo-400/20 shadow-lg">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 h-full">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">{title}</p>
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">{value}</h3>
          </div>
          <div
            className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
