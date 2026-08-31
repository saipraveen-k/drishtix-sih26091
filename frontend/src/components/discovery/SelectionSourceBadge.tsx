"use client";

import { UserCheck, Sparkles } from "lucide-react";

interface SelectionSourceBadgeProps {
  source: "user_interest" | "recommended_alternative" | string;
  className?: string;
}

export function SelectionSourceBadge({ source, className = "" }: SelectionSourceBadgeProps) {
  const isRecommendation = source === "recommended_alternative";

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
        isRecommendation
          ? "bg-blue-50 text-blue-800 border-blue-200"
          : "bg-emerald-50 text-emerald-800 border-emerald-200"
      } ${className}`}
    >
      {isRecommendation ? (
        <>
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Selection: DrishtiX Recommendation</span>
        </>
      ) : (
        <>
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Selection: Your Choice</span>
        </>
      )}
    </span>
  );
}
