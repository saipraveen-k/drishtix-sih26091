"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { ProfileData, RecommendationResponse } from "@/types";
import { BarChart3, Compass, MapPin, ShieldCheck, FileText, ArrowRight, User, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const p = await api.getProfile();
        setProfile(p);
        const rec = await api.getRecommendations(p);
        setData(rec);
      } catch (err) {
        setProfile({
          name: "Ramesh Kumar",
          available_capital: 150000,
          expected_investment: 200000,
          desired_loan_amount: 50000,
          experience_level: "some experience",
          existing_business: false,
          business_goal: "first business",
          state: "Andhra Pradesh",
          district: "Anantapur",
          village: "Kudair",
          skills: ["agriculture", "food processing"],
          interests: ["food", "manufacturing"]
        });
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Entrepreneur Command Center</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Welcome back, {profile?.name || "Ramesh"}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Target Village: <strong className="text-white">{profile?.village}, {profile?.district}, {profile?.state}</strong>
            </p>
          </div>

          <Link
            href="/opportunities"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Top Opportunities</span>
          </Link>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 font-semibold block uppercase">Available Equity Capital</span>
            <span className="text-2xl font-black text-white font-mono">₹{profile?.available_capital.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block font-medium">Ready for Investment</span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 font-semibold block uppercase">Top Opportunity Score</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{data?.recommendations[0]?.score || 86}/100</span>
            <span className="text-[10px] text-slate-400 block font-medium">High Recommendation Match</span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 font-semibold block uppercase">Scheme Readiness</span>
            <span className="text-2xl font-black text-blue-400 font-mono">78%</span>
            <span className="text-[10px] text-blue-400 block font-medium">3 Schemes Matched</span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 font-semibold block uppercase">Business Plan</span>
            <span className="text-2xl font-black text-amber-400 font-mono">20 / 20</span>
            <span className="text-[10px] text-slate-400 block font-medium">Sections Prepared</span>
          </div>

        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/opportunities" className="p-6 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl space-y-3 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">Business Opportunities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore your top 3 ranked business options with 7-factor score breakdowns and why-recommended rationale.
            </p>
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <span>View Top Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link href="/schemes" className="p-6 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl space-y-3 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">Schemes & Readiness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect matched government subsidy schemes (PMEGP, Mudra, PMFME) and check document readiness.
            </p>
            <span className="text-xs font-semibold text-blue-400 flex items-center space-x-1">
              <span>Inspect Readiness</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link href="/business-plan" className="p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl space-y-3 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">Generate Business Plan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export an official 20-section Detailed Project Report (DPR) for bank loan submission.
            </p>
            <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1">
              <span>Open Business Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
