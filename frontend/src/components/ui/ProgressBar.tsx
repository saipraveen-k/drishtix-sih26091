import React from "react";

interface ProgressBarProps {
  label?: string;
  value: number; // 0 to 100
  weight?: number;
  description?: string;
  variant?: "success" | "info" | "warning" | "error" | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  weight,
  description,
  variant,
  size = "md",
  showLabel = true
}) => {
  const rounded = Math.round(value * 10) / 10;
  
  let barColor = rounded >= 80 ? "bg-emerald-600" : rounded >= 60 ? "bg-blue-600" : "bg-amber-500";
  if (variant === "success") barColor = "bg-emerald-600";
  else if (variant === "info") barColor = "bg-blue-600";
  else if (variant === "warning") barColor = "bg-amber-500";
  else if (variant === "error") barColor = "bg-rose-600";

  const height = size === "sm" ? "h-2" : size === "lg" ? "h-3.5" : "h-2.5";

  return (
    <div className="space-y-1.5 w-full">
      {showLabel && label && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
          <span className="flex items-center space-x-1.5">
            <span>{label}</span>
            {weight !== undefined && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                {weight}% Weight
              </span>
            )}
          </span>
          <span className="font-bold text-slate-900">{rounded} / 100</span>
        </div>
      )}
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, rounded))}%` }}
        />
      </div>
      {description && <p className="text-[11px] text-slate-500 font-normal">{description}</p>}
    </div>
  );
};
