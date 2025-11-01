import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function DashboardCard({ title, children, action }: DashboardCardProps) {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
