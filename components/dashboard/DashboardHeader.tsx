import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  roleLabel?: string;
  actions?: ReactNode;
}

export function DashboardHeader({ title, subtitle, roleLabel, actions }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-px bg-linear-to-br from-blue-400/40 via-indigo-400/30 to-purple-400/40 dark:from-blue-400/40 dark:via-indigo-400/30 dark:to-purple-400/40 shadow-xl shadow-blue-500/10">
      <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {roleLabel && (
                <span className="inline-flex items-center rounded-full bg-blue-600/10 dark:bg-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-600/30 dark:border-blue-500/30">
                  {roleLabel}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
