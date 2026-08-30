import React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export interface ChecklistItem {
  id: string;
  label: string;
  category: "identity" | "business" | "financial" | "compliance";
  status: "verified" | "action_required" | "missing";
}

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle?: (id: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ items, onToggle }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isVerified = item.status === "verified";
        const isAction = item.status === "action_required";

        return (
          <div
            key={item.id}
            onClick={() => onToggle && onToggle(item.id)}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              onToggle ? "cursor-pointer hover:bg-slate-50" : ""
            } ${
              isVerified
                ? "bg-emerald-50/40 border-emerald-200/80"
                : isAction
                ? "bg-amber-50/40 border-amber-200/80"
                : "bg-rose-50/40 border-rose-200/80"
            }`}
          >
            <div className="flex items-center space-x-3">
              {isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : isAction ? (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="text-xs font-semibold text-slate-800">{item.label}</span>
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isVerified
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : isAction
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-rose-100 text-rose-800 border-rose-300"
              }`}
            >
              {isVerified ? "Verified" : isAction ? "Action Required" : "Missing"}
            </span>
          </div>
        );
      })}
    </div>
  );
};
