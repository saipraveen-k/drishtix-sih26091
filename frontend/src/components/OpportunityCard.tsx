import React from "react";
import Link from "next/link";
import { OpportunityItem } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  rank: number;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, rank }) => {
  const isTopMatch = rank === 1;

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-200 p-6 sm:p-8 space-y-6 ${
        isTopMatch
          ? "border-blue-300 shadow-md ring-1 ring-blue-200"
          : "border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300"
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span
            className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${
              isTopMatch ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700"
            }`}
          >
            #{rank}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">{opportunity.business_name}</h3>
              {isTopMatch && <Badge variant="success">BEST MATCH</Badge>}
            </div>
            <p className="text-xs text-slate-500 font-medium">{opportunity.category}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ScoreRing score={opportunity.score} size="md" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
        {opportunity.description}
      </p>

      {/* Capital Range & Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Capital</span>
          <span className="font-extrabold text-slate-900">
            ₹{(opportunity.investment_min / 100000).toFixed(1)}L – ₹{(opportunity.investment_max / 100000).toFixed(1)}L
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Working Capital</span>
          <span className="font-extrabold text-slate-900">₹{opportunity.working_capital.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Demand Index</span>
          <span className="font-bold text-emerald-700">{opportunity.demand}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Risk</span>
          <span className="font-bold text-blue-700">{opportunity.risk} RISK</span>
        </div>
      </div>

      {/* 7-Factor Progress Bars */}
      {opportunity.score_breakdown && opportunity.score_breakdown.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            7-Factor Fit Breakdown
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {opportunity.score_breakdown.map((f) => (
              <ProgressBar
                key={f.factor_name}
                label={f.factor_name}
                value={f.score}
                weight={f.weight_pct}
              />
            ))}
          </div>
        </div>
      )}

      {/* Why Recommended Rationale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Why Recommended?</span>
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700 font-normal">
            {opportunity.why_recommended.map((w, i) => (
              <li key={i} className="flex items-start space-x-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {opportunity.why_alternatives_lower && opportunity.why_alternatives_lower.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Why Not Alternatives?</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {opportunity.why_alternatives_lower.map((alt, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Data Source Transparency Badge */}
      <DataSourceBadge
        sourceName="District Agriculture & Market Survey 2026"
        freshness="2026-Q1"
        confidence={opportunity.confidence}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link href={`/opportunities/${opportunity.business_id}`} className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all">
            <span>View 7-Factor Rationale</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Link href={`/finance/${opportunity.business_id}`} className="flex-1 sm:flex-initial">
            <button className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all">
              Run Survival Simulator
            </button>
          </Link>
          <Link href={`/schemes`} className="flex-1 sm:flex-initial">
            <button className="w-full px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all">
              Check Financing
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
