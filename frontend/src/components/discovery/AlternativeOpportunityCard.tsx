"use client";

import { AlternativeBusinessItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, IndianRupee, Sparkles } from "lucide-react";

interface AlternativeOpportunityCardProps {
  item: AlternativeBusinessItem;
  rank: number;
  onExplore: (item: AlternativeBusinessItem) => void;
}

export function AlternativeOpportunityCard({ item, rank, onExplore }: AlternativeOpportunityCardProps) {
  const isTopMatch = rank === 1;

  return (
    <div
      className={`relative p-5 rounded-2xl border-2 transition-all space-y-4 flex flex-col justify-between ${
        isTopMatch
          ? "bg-gradient-to-b from-blue-50/60 to-white border-blue-500 shadow-md ring-2 ring-blue-500/20"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
      }`}
    >
      {/* Top Rank Badge */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
            isTopMatch ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-800"
          }`}>
            #{rank}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {item.category}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          {isTopMatch && (
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Best Fit
            </span>
          )}
          <Badge variant={item.opportunity_score >= 85 ? "success" : "info"}>
            {item.fit_level}
          </Badge>
        </div>
      </div>

      {/* Title & Score */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <h4 className="text-base font-black text-slate-900 leading-tight">
            {item.business_name}
          </h4>
          <div className="text-right">
            <span className="text-xl font-black text-blue-700">{item.opportunity_score.toFixed(1)}</span>
            <span className="text-xs text-slate-500">/100</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
      </div>

      {/* Capital Requirement */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Est. Capital:</span>
        <span className="font-extrabold text-slate-900 flex items-center">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          ₹{(item.investment_min / 1000).toFixed(0)}K – ₹{(item.investment_max / 1000).toFixed(0)}K
        </span>
      </div>

      {/* Why Better */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Key Advantage Drivers:
        </span>
        <div className="space-y-1">
          {item.why_better.map((reason, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Button */}
      <div className="pt-2">
        <Button
          variant={isTopMatch ? "secondary" : "outline"}
          size="sm"
          className="w-full justify-between"
          onClick={() => onExplore(item)}
        >
          <span>Explore This Alternative</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
