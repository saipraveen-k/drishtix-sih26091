"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Compass,
  MapPin,
  TrendingUp,
  Calculator,
  Award,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Database
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200/80 py-16 lg:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Hero Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold text-blue-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>SIH 2026 Problem SIH26091 • Rural Entrepreneurship Intelligence</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Discover the business that's <span className="text-blue-600 underline decoration-blue-200">right for you</span>.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                  Instead of asking what business you want to start, <strong>DrishtiX</strong> combines your skills, available capital, location, local market demand, and infrastructure to discover what business you are <strong>most likely to succeed in</strong>.
                </p>

                {/* Core Equation Pill */}
                <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-700 flex flex-wrap items-center gap-2">
                  <span className="bg-white px-2 py-0.5 rounded shadow-xs text-slate-900 font-bold">Your Skills</span>
                  <span>+</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-xs text-slate-900 font-bold">Your Location</span>
                  <span>+</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-xs text-slate-900 font-bold">Your Capital</span>
                  <span>+</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-xs text-slate-900 font-bold">Local Market Data</span>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link href="/onboarding">
                    <Button size="lg" variant="primary" className="w-full sm:w-auto">
                      <span>FIND MY BUSINESS</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/opportunities">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      <span>EXPLORE OPPORTUNITIES</span>
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex items-center space-x-6 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Deterministic Engine</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>District Census 2026 Compatible</span>
                  </div>
                </div>
              </div>

              {/* Right Sample Card Preview */}
              <div className="lg:col-span-5">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
                  <div className="flex justify-between items-start">
                    <Badge variant="success">Top Opportunity #1</Badge>
                    <Badge variant="info">High Confidence (100%)</Badge>
                  </div>

                  <div className="flex items-center space-x-4">
                    <ScoreRing score={84.8} size="md" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Millet Processing & Packaging</h3>
                      <p className="text-xs text-slate-500">Food Processing • Kudair, Anantapur</p>
                      <p className="text-xs font-semibold text-slate-700 mt-1">
                        Est. Capital: <span className="text-slate-900 font-bold">₹1.2L – ₹2.5L</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Why Recommended?</span>
                    <div className="space-y-1 text-xs text-slate-700">
                      <p className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Strong local market demand in Anantapur (85/100).</span>
                      </p>
                      <p className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Matches agriculture & food processing skills.</span>
                      </p>
                    </div>
                  </div>

                  <Link href="/opportunities" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Analysis & Breakdown
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Decision Flow Pipeline Section */}
        <section className="py-16 bg-slate-100/60 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
                Core Product Loop
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How DrishtiX Works</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                A 6-step deterministic pipeline that turns hyper-local data into entrepreneur success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {[
                { step: "01", title: "Entrepreneur Profile", desc: "Skills, capital, experience" },
                { step: "02", title: "Location GIS", desc: "Village, district, coordinates" },
                { step: "03", title: "Market Indicators", desc: "Demand, competition, infra" },
                { step: "04", title: "7-Factor Scoring", desc: "Weighted deterministic fit" },
                { step: "05", title: "Financial Twin", desc: "Survival simulator & break-even" },
                { step: "06", title: "Launch Roadmap", desc: "Schemes, DPR & 90-day plan" },
              ].map((s) => (
                <div key={s.step} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-center">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs inline-flex items-center justify-center">
                    {s.step}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6 Key Modules Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Complete Decision Support Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Everything a rural entrepreneur needs to discover, stress-test, finance, and launch a micro-enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card hoverEffect className="space-y-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Reverse Business Discovery</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ranks opportunities using a 7-factor model (Demand 25%, Skill 20%, Capital 15%, Supply 10%, Infra 10%, Growth 10%, Risk 10%).
                </p>
              </Card>

              <Card hoverEffect className="space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Hyper-Local GIS Map</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interactive Leaflet map showing competitor clusters, catchment radius, road connectivity, and market gap opportunities.
                </p>
              </Card>

              <Card hoverEffect className="space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 w-fit">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Business Survival Simulator</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deterministic financial twin predicting monthly revenue, break-even units, ROI %, loan EMI, and stress testing (-20% sales).
                </p>
              </Card>

              <Card hoverEffect className="space-y-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Government Scheme Matcher</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Matches PMEGP, PMFME, Mudra, NRLM, AIF with loan limits, subsidies, and an Application Readiness Meter (88%).
                </p>
              </Card>

              <Card hoverEffect className="space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">20-Section Business Plan (DPR)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates bankable Detailed Project Reports with verified financial figures for loan application submissions.
                </p>
              </Card>

              <Card hoverEffect className="space-y-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Ask DrishtiX AI Copilot</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Context-aware assistant in English, Hindi, and Telugu with speech-to-text input and FAISS vector RAG citations.
                </p>
              </Card>

            </div>
          </div>
        </section>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
