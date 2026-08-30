import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Compass, ShieldCheck, TrendingUp, Cpu, MapPin, Calculator, FileText, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden border-b border-slate-800/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Smart India Hackathon 2026 • Problem Statement SIH26091</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
              Discover the right business for your <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">skills, capital and location.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              DrishtiX is NOT a generic chatbot. It is a personalized rural entrepreneurship decision-support platform combining local market data, competition density, and financial digital twins.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/opportunities"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Explore Interactive Demo</span>
              </Link>
            </div>

            {/* Architecture Visual Flow Graphic */}
            <div className="mt-16 max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                Decision Intelligence Engine Workflow
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-xs">
                
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">1</div>
                  <span className="font-bold text-white block text-sm">YOU</span>
                  <span className="text-slate-400 text-[11px]">Skills & Capital</span>
                </div>

                <div className="text-emerald-500 font-bold hidden md:block text-xl">+</div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-bold">2</div>
                  <span className="font-bold text-white block text-sm">LOCATION</span>
                  <span className="text-slate-400 text-[11px]">Village & Market</span>
                </div>

                <div className="text-emerald-500 font-bold hidden md:block text-xl">↓</div>

                <div className="p-4 rounded-xl bg-gradient-to-tr from-emerald-950 to-blue-950 border border-emerald-500/40 text-center space-y-1 md:col-span-1 shadow-lg shadow-emerald-500/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center font-bold">3</div>
                  <span className="font-bold text-emerald-400 block text-sm">DRISHTIX AI</span>
                  <span className="text-slate-300 text-[11px]">Explainable Scoring</span>
                </div>

              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Output 1</span>
                  <p className="text-xs font-semibold text-white">Top 3 Opportunity Ranking</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Output 2</span>
                  <p className="text-xs font-semibold text-white">Financial Digital Twin</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Output 3</span>
                  <p className="text-xs font-semibold text-white">What-If Stress Simulation</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Output 4</span>
                  <p className="text-xs font-semibold text-white">20-Section Business Plan</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Core Product Features Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Rural Entrepreneurs Trust DrishtiX
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Decision support based on empirical formulas, not fabricated hallucinated statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Explainable Opportunity Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                7-Factor Scoring Model combining Demand (25%), Skill Fit (20%), Capital (15%), Resources (10%), Infra (10%), Growth (10%), and Risk (10%).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Financial Digital Twin</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic cost structure modeling for monthly revenue, break-even sales volume, gross/net profit, and loan amortization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Scheme & Finance Readiness</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated matching against PMEGP, Mudra Yojana, PMFME, and DAY-NRLM with a document readiness checklist (0-100%).
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
