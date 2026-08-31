"use client";

import { InterestedBusinessEval } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { CheckCircle2, AlertTriangle, Info, IndianRupee, ShieldCheck } from "lucide-react";

interface InterestedBusinessCardProps {
  data: InterestedBusinessEval;
}

export function InterestedBusinessCard({ data }: InterestedBusinessCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "emerald";
    if (score >= 60) return "blue";
    return "amber";
  };

  const scoreBadgeVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "info";
    return "warning";
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
                Your Chosen Interest
              </span>
              <Badge variant={scoreBadgeVariant(data.opportunity_score)}>
                {data.fit_level}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {data.canonical_business_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              Entered as &quot;{data.user_entered_business}&quot; • Category: {data.category}
            </p>
          </div>

          {/* Opportunity Score Gauge */}
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start sm:self-center">
            <ScoreRing score={data.opportunity_score} size="md" color={getScoreColor(data.opportunity_score)} />
            <div>
              <span className="text-[10px] font-extrabold text-blue-200 uppercase tracking-widest block">
                Opportunity Score
              </span>
              <span className="text-2xl font-black text-white">{data.opportunity_score.toFixed(1)}</span>
              <span className="text-xs text-blue-200"> / 100</span>
              <div className="text-[10px] text-slate-300 mt-0.5 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Confidence: <b>{data.confidence_level}</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content Grid */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Description & Capital requirement summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="sm:col-span-2">
            <span className="font-extrabold text-slate-900 block mb-1">Business Description:</span>
            <p className="text-slate-600 leading-relaxed">{data.description}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-center space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Capital Requirement:</span>
            <div className="flex items-center text-sm font-black text-slate-900">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>₹{(data.investment_min / 1000).toFixed(0)}K – ₹{(data.investment_max / 1000).toFixed(0)}K</span>
            </div>
            <span className="text-[10px] text-slate-500">Working Capital: ₹{data.working_capital.toLocaleString()}</span>
          </div>
        </div>

        {/* Why does DrishtiX give this score? */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Why does DrishtiX give this score?</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {data.why_reasons.map((reason, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-start space-x-2.5 ${
                  reason.type === "positive"
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : reason.type === "warning"
                    ? "bg-amber-50/70 border-amber-200 text-amber-950"
                    : "bg-rose-50/70 border-rose-200 text-rose-950"
                }`}
              >
                {reason.type === "positive" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>{reason.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source & Freshness Metadata */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <DataSourceBadge
            sourceName={data.data_transparency.data_source}
            freshness={data.data_transparency.freshness}
          />
          <div className="flex items-center space-x-3 text-slate-500">
            <span>Coverage: <b>{data.data_transparency.geographic_coverage}</b></span>
            <span>•</span>
            <span>Proxy: <b>{data.data_transparency.proxy_status}</b></span>
          </div>
        </div>

      </div>
    </div>
  );
}
