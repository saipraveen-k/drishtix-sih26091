"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { BusinessJourneyStepper } from "@/components/discovery/BusinessJourneyStepper";
import { SelectionSourceBadge } from "@/components/discovery/SelectionSourceBadge";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Timeline } from "@/components/ui/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ProfileData, JourneyStateResponse } from "@/types";
import { Compass, Calculator, Award, FileText, TrendingUp, MapPin, ArrowRight, ArrowRightLeft, ShieldCheck, UserCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [journeyState, setJourneyState] = useState<JourneyStateResponse>({
    user_id: "demo_user",
    interested_business_name: "Restaurant",
    interested_business_id: "biz_restaurant_10",
    selected_business_id: "biz_millet_01",
    selected_business_name: "Millet Processing & Packaging",
    selection_source: "recommended_alternative",
    opportunity_score: 91.0,
    confidence_level: "HIGH",
    updated_at: "2026-08-31T21:30:00"
  });

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getProfile();
        setProfile(p);
      } catch (err) {}

      try {
        const j = await api.getJourneyState();
        setJourneyState(j);
      } catch (err) {}
    }
    load();
  }, []);

  const handleSwitchBackToOriginal = async () => {
    try {
      const updated = await api.selectBusinessJourney({
        interested_business_name: journeyState.interested_business_name,
        interested_business_id: journeyState.interested_business_id,
        selected_business_id: journeyState.interested_business_id,
        selected_business_name: journeyState.interested_business_name,
        selection_source: "user_interest",
        opportunity_score: 61.0
      });
      setJourneyState(updated);
    } catch (err) {
      setJourneyState((prev) => ({
        ...prev,
        selected_business_id: prev.interested_business_id,
        selected_business_name: prev.interested_business_name,
        selection_source: "user_interest",
        opportunity_score: 61.0
      }));
    }
  };

  const isAlternativeSelected = journeyState.selection_source === "recommended_alternative";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Stepper Progress */}
        <BusinessJourneyStepper currentStepIndex={7} activeBusinessId={journeyState.selected_business_id} />

        {/* Header Banner */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Location: {profile?.village || "Kudair"}, {profile?.district || "Anantapur"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Entrepreneur Decision &amp; Execution Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Track your profile, active business journey, financial digital twin, scheme approval, DPR generator, and 90-day roadmap.
            </p>
          </div>

          <Badge variant="success">SIH Demo Journey Active</Badge>
        </div>

        {/* YOUR BUSINESS JOURNEY SUMMARY CARD */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 bg-blue-900/80 px-3 py-1 rounded-full border border-blue-700">
                YOUR BUSINESS JOURNEY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Active Business: {journeyState.selected_business_name}
              </h2>
            </div>
            <SelectionSourceBadge source={journeyState.selection_source} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase">Interested In:</span>
              <span className="text-base font-black text-white block">{journeyState.interested_business_name}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase">Selected Business:</span>
              <span className="text-base font-black text-emerald-300 block">{journeyState.selected_business_name}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase">Opportunity Score:</span>
              <span className="text-base font-black text-blue-200 block">{journeyState.opportunity_score.toFixed(1)} / 100</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase">Selection Source:</span>
              <span className="text-xs font-black text-amber-300 block">
                {isAlternativeSelected ? "DrishtiX Recommendation" : "Your Choice"}
              </span>
            </div>
          </div>

          {/* Journey Steps Progress Pill Checklist */}
          <div className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px]">
              {[
                { title: "Opportunity", done: true },
                { title: "Details", done: true },
                { title: "Financials", done: true },
                { title: "Stress Test", done: true },
                { title: "Schemes", done: true },
                { title: "Readiness", done: true },
                { title: "Business Plan", done: true },
                { title: "90-Day Roadmap", done: true }
              ].map((s, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center space-x-1.5 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold truncate">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHY NOT MY BUSINESS? PANEL (If user chose recommended alternative) */}
        {isAlternativeSelected && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-amber-950 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Autonomy preserved: You can switch back anytime
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Why Not My Original Business?</h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  You originally entered <b>{journeyState.interested_business_name}</b> (Score: 61.4/100). DrishtiX recommended <b>{journeyState.selected_business_name}</b> (Score: {journeyState.opportunity_score.toFixed(1)}/100) due to higher market demand and resource fit.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Link href={`/discover?interest=${encodeURIComponent(journeyState.interested_business_name)}`}>
                  <Button variant="outline" size="sm" className="bg-white border-amber-300 text-slate-800 hover:bg-amber-100">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Compare Again</span>
                  </Button>
                </Link>

                <Button
                  variant="primary"
                  size="sm"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
                  onClick={handleSwitchBackToOriginal}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch Back to {journeyState.interested_business_name}</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Canonical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Available Capital"
            value={`₹${((profile?.available_capital || 150000) / 100000).toFixed(1)}L`}
            subtext="Funding Gap: ₹50,000 Scheme Loan"
            icon={TrendingUp}
            variant="blue"
          />

          <MetricCard
            label="Active Opportunity Score"
            value={`${journeyState.opportunity_score.toFixed(1)} / 100`}
            subtext={journeyState.selected_business_name}
            icon={Compass}
            variant="emerald"
          />

          <MetricCard
            label="Scheme Readiness"
            value="88%"
            subtext="PMEGP & MUDRA Potentially Eligible"
            icon={Award}
            variant="amber"
          />

          <MetricCard
            label="Business Plan (DPR)"
            value="20 / 20"
            subtext="Sections Ready for Bank Submission"
            icon={FileText}
            variant="slate"
          />
        </div>

        {/* Downstream Actions Grid */}
        <Card className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Execute Downstream Journey Modules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link href={`/opportunities/${journeyState.selected_business_id}`}>
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 w-fit">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">1. Opportunity Details</h4>
                <p className="text-[11px] text-slate-500">View 7-factor breakdown &amp; data sources.</p>
              </div>
            </Link>

            <Link href={`/finance/${journeyState.selected_business_id}`}>
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
                  <Calculator className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">2. Financial Twin &amp; Stress</h4>
                <p className="text-[11px] text-slate-500">Simulate monthly ROI, EMI &amp; cash flows.</p>
              </div>
            </Link>

            <Link href="/schemes">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 w-fit">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">3. Government Schemes</h4>
                <p className="text-[11px] text-slate-500">Match PMEGP subsidy &amp; 88% readiness.</p>
              </div>
            </Link>

            <Link href="/business-plan">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 w-fit">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">4. 20-Section Business Plan</h4>
                <p className="text-[11px] text-slate-500">Download printable DPR for bank loans.</p>
              </div>
            </Link>

          </div>
        </Card>

        {/* 90-Day Launch Roadmap */}
        <Card>
          <Timeline />
        </Card>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
