"use client";

import Link from "next/link";
import { OpportunityItem } from "@/types";
import { CheckCircle2, TrendingUp, ShieldAlert, Award, ArrowRight, DollarSign, Cpu } from "lucide-react";

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  rank: number;
}

export function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const isTopMatch = rank === 1;

  return (
    <div className={`relative rounded-2xl bg-slate-900 border transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 ${
      isTopMatch
        ? "border-emerald-500/50 ring-1 ring-emerald-500/30"
        : "border-slate-800"
    }`}>
      {/* Rank Badge */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            rank === 1 ? "bg-emerald-500 text-slate-950" : rank === 2 ? "bg-blue-500 text-slate-950" : "bg-amber-500 text-slate-950"
          }`}>
            #{rank}
          </span>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
              {opportunity.business_name}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{opportunity.category}</span>
          </div>
        </div>

        {/* Score & Confidence */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400">{opportunity.score}</span>
            <span className="text-xs text-slate-500 font-semibold">/100</span>
          </div>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Confidence {opportunity.confidence}%</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              opportunity.confidence_level === "HIGH" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400"
            }`}>
              {opportunity.confidence_level}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 space-y-4">
        <p className="text-xs text-slate-300 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Quick Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Est. Capital</span>
            <span className="font-semibold text-white">₹{(opportunity.investment_min / 100000).toFixed(1)}L - {(opportunity.investment_max / 100000).toFixed(1)}L</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Market Demand</span>
            <span className="font-semibold text-emerald-400">{opportunity.demand}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Skill Fit</span>
            <span className="font-semibold text-blue-400">{opportunity.skill_fit}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Risk Level</span>
            <span className={`font-semibold ${opportunity.risk === "LOW" ? "text-emerald-400" : "text-amber-400"}`}>
              {opportunity.risk} Risk
            </span>
          </div>
        </div>

        {/* Why Recommended Rationale */}
        <div className="space-y-1.5 pt-2">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Why Recommended?</span>
          </h4>
          <ul className="space-y-1 text-xs text-slate-300">
            {opportunity.why_recommended.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-950/80 border-t border-slate-800/80 rounded-b-2xl">
        <Link
          href={`/opportunities/${opportunity.business_id}`}
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1"
        >
          <span>View Detailed Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href={`/finance/${opportunity.business_id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Financial Digital Twin</span>
        </Link>
      </div>
    </div>
  );
}
