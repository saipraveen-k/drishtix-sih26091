import React from "react";
import { Database, ShieldCheck, Info } from "lucide-react";

interface DataSourceBadgeProps {
  sourceName?: string;
  freshness?: string;
  confidence?: number;
  isProxy?: boolean;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  sourceName = "District Market Survey 2026",
  freshness = "2026-Q1",
  confidence = 86,
  isProxy = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
      <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
        <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Source: {sourceName}</span>
      </div>

      <span className="text-slate-300">|</span>

      <div className="flex items-center space-x-1 text-slate-600">
        <span>Freshness:</span>
        <span className="font-semibold text-slate-800">{freshness}</span>
      </div>

      <span className="text-slate-300">|</span>

      <div className="flex items-center space-x-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="text-slate-600">Confidence:</span>
        <span className="font-bold text-emerald-700">{confidence}% (HIGH)</span>
      </div>

      {isProxy && (
        <div className="flex items-center space-x-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium ml-auto">
          <Info className="w-3 h-3 shrink-0" />
          <span>District Proxy Used</span>
        </div>
      )}
    </div>
  );
};
