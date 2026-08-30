import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  variant?: "blue" | "emerald" | "amber" | "slate";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "slate",
}) => {
  const iconColors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    slate: "text-slate-700 bg-slate-100 border-slate-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${iconColors[variant]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      {subtext && <p className="text-xs font-medium text-slate-500">{subtext}</p>}
    </div>
  );
};
