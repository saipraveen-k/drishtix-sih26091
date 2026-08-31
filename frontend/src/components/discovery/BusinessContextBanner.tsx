"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SelectionSourceBadge } from "./SelectionSourceBadge";
import { api } from "@/lib/api";
import { JourneyStateResponse } from "@/types";
import { Briefcase, ArrowRightLeft } from "lucide-react";

interface BusinessContextBannerProps {
  currentBusinessName?: string;
}

export function BusinessContextBanner({ currentBusinessName }: BusinessContextBannerProps) {
  const [journeyState, setJourneyState] = useState<JourneyStateResponse | null>(null);

  useEffect(() => {
    api.getJourneyState()
      .then((res) => setJourneyState(res))
      .catch(() => {});
  }, []);

  const businessName = currentBusinessName || journeyState?.selected_business_name || "Millet Processing & Packaging";
  const source = journeyState?.selection_source || "recommended_alternative";
  const score = journeyState?.opportunity_score || 91.0;

  return (
    <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Active Business Journey
            </span>
            <SelectionSourceBadge source={source} />
          </div>
          <h3 className="text-base font-black text-white">
            {businessName} <span className="text-xs font-bold text-emerald-400 ml-1">({score.toFixed(1)}/100)</span>
          </h3>
        </div>
      </div>

      <Link
        href="/discover"
        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center space-x-1.5 transition-all self-end sm:self-center"
      >
        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-300" />
        <span>Compare &amp; Change Business</span>
      </Link>
    </div>
  );
}
