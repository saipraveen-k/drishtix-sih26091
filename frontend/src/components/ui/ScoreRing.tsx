import React from "react";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = "md", label = "Score" }) => {
  const rounded = Math.round(score * 10) / 10;
  
  const strokeColor =
    rounded >= 80 ? "#16A34A" : rounded >= 60 ? "#2563EB" : "#D97706";
  const badgeBg =
    rounded >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : rounded >= 60 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200";

  const dimensions = {
    sm: { radius: 28, stroke: 5, box: 64, text: "text-base font-bold", labelText: "text-[9px]" },
    md: { radius: 42, stroke: 7, box: 96, text: "text-2xl font-black", labelText: "text-xs font-semibold" },
    lg: { radius: 56, stroke: 9, box: 128, text: "text-3xl font-black", labelText: "text-xs font-bold" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const offset = circumference - (rounded / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.box, height: dimensions.box }}>
        <svg className="transform -rotate-90" width={dimensions.box} height={dimensions.box}>
          <circle
            cx={dimensions.box / 2}
            cy={dimensions.box / 2}
            r={dimensions.radius}
            stroke="#E2E8F0"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          <circle
            cx={dimensions.box / 2}
            cy={dimensions.box / 2}
            r={dimensions.radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`${dimensions.text} text-slate-900 tracking-tight`}>{rounded}</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">/100</span>
        </div>
      </div>
      {label && (
        <span className={`mt-1.5 px-2.5 py-0.5 rounded-full border text-center ${dimensions.labelText} ${badgeBg}`}>
          {rounded >= 80 ? "Excellent Match" : rounded >= 60 ? "Good Match" : "Moderate Match"}
        </span>
      )}
    </div>
  );
};
