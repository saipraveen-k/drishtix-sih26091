"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, UserCheck, ShieldCheck } from "lucide-react";

interface SelectionDecisionProps {
  userChoiceName: string;
  bestAltName: string;
  bestAltScore: number;
  userChoiceScore: number;
  onSelectAlternative: () => void;
  onContinueUserChoice: () => void;
}

export function SelectionDecision({
  userChoiceName,
  bestAltName,
  bestAltScore,
  userChoiceScore,
  onSelectAlternative,
  onContinueUserChoice
}: SelectionDecisionProps) {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-300 bg-blue-950 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-800">
          Entrepreneur Decision Point
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          What would you like to do?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          DrishtiX provides evidence and recommendations, but you always make the final choice. Both paths launch your complete business intelligence journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Choice A: Explore Recommended Alternative */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-blue-400/30 flex flex-col justify-between space-y-4 hover:border-blue-400/60 transition-all">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-blue-300 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Option A: DrishtiX Recommendation
              </span>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                {bestAltScore.toFixed(1)} / 100
              </span>
            </div>
            <h4 className="text-xl font-black text-white">{bestAltName}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on local market demand, raw material supply, and your capital profile, this business offers higher overall suitability.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-between bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg"
            onClick={onSelectAlternative}
          >
            <span>EXPLORE BETTER MATCH ({bestAltName})</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </div>

        {/* Choice B: Continue with My Interested Business */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col justify-between space-y-4 hover:border-white/40 transition-all">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-300" /> Option B: Your Original Choice
              </span>
              <span className="text-xs font-black text-blue-200 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800">
                {userChoiceScore.toFixed(1)} / 100
              </span>
            </div>
            <h4 className="text-xl font-black text-white">{userChoiceName}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continue with your chosen business. DrishtiX will help evaluate its financial viability, loan funding, risk mitigation, and DPR generation.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/40 text-white font-extrabold"
            onClick={onContinueUserChoice}
          >
            <span>CONTINUE WITH MY BUSINESS ({userChoiceName})</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </div>
      </div>

      <div className="text-center pt-2">
        <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DrishtiX does not penalize your selection. All financial twins &amp; DPR generators adapt to your choice.</span>
        </p>
      </div>
    </div>
  );
}
