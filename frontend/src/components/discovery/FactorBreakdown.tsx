"use client";

import { FactorBreakdown as FactorType } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface FactorBreakdownProps {
  factors: FactorType[];
  title?: string;
}

export function FactorBreakdown({ factors, title = "7-Factor Opportunity Breakdown" }: FactorBreakdownProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">
            Deterministic weighted evaluation formula (0–100 scale) calculated by backend engine.
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          100% Deterministic
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {factors.map((f) => {
          let variant: "success" | "info" | "warning" | "error" = "info";
          if (f.score >= 80) variant = "success";
          else if (f.score >= 65) variant = "info";
          else if (f.score >= 50) variant = "warning";
          else variant = "error";

          return (
            <div key={f.factor_name} className="space-y-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">
                  {f.factor_name} <span className="text-[10px] font-bold text-slate-400">({f.weight_pct}% weight)</span>
                </span>
                <span className="font-black text-slate-900">{f.score.toFixed(1)} / 100</span>
              </div>
              <ProgressBar value={f.score} variant={variant} size="md" showLabel={false} />
              <p className="text-[11px] text-slate-500">{f.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
