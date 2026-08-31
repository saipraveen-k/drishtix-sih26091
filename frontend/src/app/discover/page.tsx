"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { BusinessJourneyStepper } from "@/components/discovery/BusinessJourneyStepper";
import { InterestedBusinessCard } from "@/components/discovery/InterestedBusinessCard";
import { FactorBreakdown } from "@/components/discovery/FactorBreakdown";
import { AlternativeOpportunityCard } from "@/components/discovery/AlternativeOpportunityCard";
import { OpportunityComparison } from "@/components/discovery/OpportunityComparison";
import { SelectionDecision } from "@/components/discovery/SelectionDecision";
import { api } from "@/lib/api";
import {
  InterestEvaluateResponse,
  ProfileData,
  AlternativeBusinessItem
} from "@/types";
import { Sparkles, AlertTriangle, CheckCircle2, ArrowRightLeft, ShieldCheck, PieChart, Layers } from "lucide-react";

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryInterest = searchParams.get("interest");

  const [loading, setLoading] = useState(true);
  const [evalData, setEvalData] = useState<InterestEvaluateResponse | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Ramesh Kumar",
    available_capital: 150000,
    expected_investment: 200000,
    desired_loan_amount: 50000,
    experience_level: "1–3 years",
    existing_business: false,
    business_goal: "Start a new business",
    state: "Andhra Pradesh",
    district: "Anantapur",
    block: "Kudair",
    village: "Kudair",
    skills: ["Agriculture", "Food Processing"],
    interests: ["Land", "Equipment", "Raw Materials"]
  });

  const [interestedBusinessName, setInterestedBusinessName] = useState(queryInterest || "Restaurant");

  useEffect(() => {
    let activeInterest = queryInterest;

    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("drishtix_user_profile");
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (e) {}
      }
      const storedInterest = localStorage.getItem("drishtix_interested_business");
      if (!activeInterest && storedInterest) {
        activeInterest = storedInterest;
      }
    }

    const finalInterest = activeInterest || "Restaurant";
    setInterestedBusinessName(finalInterest);

    setLoading(true);
    api.evaluateInterest(profile, finalInterest)
      .then((res) => {
        setEvalData(res);
      })
      .catch((err) => {
        console.warn("Evaluation fallback mode:", err);
      })
      .finally(() => setLoading(false));
  }, [queryInterest]);

  const handleSelectAlternative = async (alt?: AlternativeBusinessItem) => {
    if (!evalData) return;
    const target = alt || evalData.alternatives[0];
    if (!target) return;

    try {
      await api.selectBusinessJourney({
        interested_business_name: evalData.interested_business.user_entered_business,
        interested_business_id: evalData.interested_business.canonical_business_id,
        selected_business_id: target.business_id,
        selected_business_name: target.business_name,
        selection_source: "recommended_alternative",
        opportunity_score: target.opportunity_score
      });
    } catch (e) {}

    router.push(`/opportunities/${target.business_id}`);
  };

  const handleContinueMyBusiness = async () => {
    if (!evalData) return;
    const ib = evalData.interested_business;

    try {
      await api.selectBusinessJourney({
        interested_business_name: ib.user_entered_business,
        interested_business_id: ib.canonical_business_id,
        selected_business_id: ib.canonical_business_id,
        selected_business_name: ib.canonical_business_name,
        selection_source: "user_interest",
        opportunity_score: ib.opportunity_score
      });
    } catch (e) {}

    router.push(`/opportunities/${ib.canonical_business_id}`);
  };

  if (loading || !evalData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-700">Evaluating your business interest &amp; ranking alternative opportunities...</p>
      </div>
    );
  }

  const ib = evalData.interested_business;
  const score = ib.opportunity_score;
  const bestAlt = evalData.comparison.best_alternative;

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Stepper Header */}
      <BusinessJourneyStepper currentStepIndex={0} activeBusinessId={ib.canonical_business_id} />

      {/* Top Headline Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
              Interest-Led Discovery &amp; Evaluation
            </span>
            <span className="text-xs font-bold text-slate-500">Kudair, Anantapur, AP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            You chose: <span className="text-blue-700">{ib.user_entered_business}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            DrishtiX has calculated its feasibility and analyzed higher-suiting alternative micro-enterprises.
          </p>
        </div>

        <button
          onClick={() => router.push("/onboarding")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Change Interest</span>
        </button>
      </div>

      {/* Interested Business Evaluation Card */}
      <InterestedBusinessCard data={ib} />

      {/* Score-Dependent Messaging Banner */}
      {score >= 80 ? (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start space-x-3 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-emerald-900 text-base">Great choice! Your interest is strongly supported by the data.</h4>
            <p className="mt-1 text-xs text-emerald-800">
              Your declared skills, available capital, and local block demand align exceptionally well with <b>{ib.canonical_business_name}</b> (Score: {score.toFixed(1)}/100).
            </p>
          </div>
        </div>
      ) : score >= 60 ? (
        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start space-x-3 text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-blue-900 text-base">Promising choice, but there are important considerations.</h4>
            <p className="mt-1 text-xs text-blue-800">
              Your choice <b>{ib.canonical_business_name}</b> is viable (Score: {score.toFixed(1)}/100), but alternative businesses show even stronger market demand and capital alignment.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start space-x-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-amber-950 text-base">Your chosen business may require additional consideration.</h4>
            <p className="mt-1 text-xs text-amber-900">
              <b>{ib.canonical_business_name}</b> scores {score.toFixed(1)}/100 due to competition density or capital requirements. DrishtiX recommends examining higher-suiting alternatives below, or continuing with additional loan backing.
            </p>
          </div>
        </div>
      )}

      {/* 7-Factor Breakdown */}
      <FactorBreakdown factors={ib.score_breakdown} />

      {/* Interest VS Suitability Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>Interest vs Suitability Alignment</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visual representation of how your personal desire compares with profile fit, market demand, and financial feasibility.
            </p>
          </div>
          <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            DrishtiX Dual Signal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">User Interest</span>
            <span className="text-base font-black text-blue-700 block mt-1">High</span>
            <span className="text-[10px] text-slate-400">Entered Preference</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Personal Fit</span>
            <span className="text-base font-black text-slate-900 block mt-1">{ib.suitability_metrics.personal_fit}</span>
            <span className="text-[10px] text-slate-400">Skills &amp; Experience</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Market Fit</span>
            <span className="text-base font-black text-slate-900 block mt-1">{ib.suitability_metrics.market_fit}</span>
            <span className="text-[10px] text-slate-400">Demand &amp; Supply</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Financial Fit</span>
            <span className="text-base font-black text-slate-900 block mt-1">{ib.suitability_metrics.financial_fit}</span>
            <span className="text-[10px] text-slate-400">Capital &amp; Risk</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Overall Score</span>
            <span className="text-base font-black text-blue-700 block mt-1">{score.toFixed(1)}</span>
            <span className="text-[10px] text-blue-600">Composite Score</span>
          </div>
        </div>
      </div>

      {/* Better-Suited Alternatives Section */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Businesses you may be even better suited for
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Based on your skills, capital, location, resources, and local market conditions evaluated deterministically.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {evalData.alternatives.map((alt, idx) => (
            <AlternativeOpportunityCard
              key={alt.business_id}
              item={alt}
              rank={idx + 1}
              onExplore={(selectedAlt) => handleSelectAlternative(selectedAlt)}
            />
          ))}
        </div>
      </div>

      {/* How Does Your Choice Compare? */}
      <OpportunityComparison
        userChoiceName={ib.canonical_business_name}
        userChoiceScore={score}
        bestAltName={bestAlt.business_name}
        bestAltScore={bestAlt.opportunity_score}
        factors={evalData.comparison.factor_matrix}
      />

      {/* Decision Point Component */}
      <SelectionDecision
        userChoiceName={ib.canonical_business_name}
        userChoiceScore={score}
        bestAltName={bestAlt.business_name}
        bestAltScore={bestAlt.opportunity_score}
        onSelectAlternative={() => handleSelectAlternative()}
        onContinueUserChoice={handleContinueMyBusiness}
      />
    </main>
  );
}

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-700">Loading discovery engine...</p>
          </div>
        }
      >
        <DiscoverContent />
      </Suspense>
      <CopilotDrawer />
      <Footer />
    </div>
  );
}
