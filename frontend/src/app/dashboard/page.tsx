"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Timeline } from "@/components/ui/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ProfileData } from "@/types";
import { Compass, Calculator, Award, FileText, TrendingUp, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getProfile();
        setProfile(p);
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
          skills: ["Agriculture", "Food Processing"],
          interests: ["Food Processing"]
        });
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Location: {profile?.village || "Kudair"}, {profile?.district || "Anantapur"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Where am I in my entrepreneurship journey?
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Track your profile, opportunity score, financial simulation status, scheme readiness, and 90-day launch roadmap.
            </p>
          </div>

          <Badge variant="success">SIH Demo Journey Active</Badge>
        </div>

        {/* Canonical Journey Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <MetricCard
            label="Available Capital"
            value={`₹${((profile?.available_capital || 150000) / 100000).toFixed(1)}L`}
            subtext="Funding Gap: ₹50,000 Loan"
            icon={TrendingUp}
            variant="blue"
          />

          <MetricCard
            label="Top Opportunity Match"
            value="84.8 / 100"
            subtext="Millet Processing & Packaging"
            icon={Compass}
            variant="emerald"
          />

          <MetricCard
            label="Scheme Readiness"
            value="88%"
            subtext="Overall Bank Approval Score"
            icon={Award}
            variant="amber"
          />

          <MetricCard
            label="Business Plan (DPR)"
            value="20 / 20"
            subtext="Sections Complete & Bankable"
            icon={FileText}
            variant="slate"
          />

        </div>

        {/* Continue Your Journey Action Grid */}
        <Card className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Continue Your Entrepreneur Journey
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link href="/opportunities">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 w-fit">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Explore Opportunity</h4>
                <p className="text-[11px] text-slate-500">View 7-factor fit breakdown and recommendations.</p>
              </div>
            </Link>

            <Link href="/finance/biz_millet_01">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
                  <Calculator className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Run Survival Simulator</h4>
                <p className="text-[11px] text-slate-500">Stress test sales drop (-20%) and cost increases.</p>
              </div>
            </Link>

            <Link href="/schemes">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 w-fit">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Check Finance & Schemes</h4>
                <p className="text-[11px] text-slate-500">Match PMEGP subsidy and 88% readiness meter.</p>
              </div>
            </Link>

            <Link href="/business-plan">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer space-y-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 w-fit">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Download Business Plan</h4>
                <p className="text-[11px] text-slate-500">Generate printable 20-Section DPR report.</p>
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
