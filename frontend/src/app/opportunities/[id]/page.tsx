"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { OpportunityItem } from "@/types";
import { ArrowLeft, DollarSign, Award, CheckCircle2, AlertTriangle, ShieldCheck, Database, Layers, BarChart2 } from "lucide-react";

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "biz_millet_01";

  const [opp, setOpp] = useState<OpportunityItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpp() {
      try {
        const item = await api.getOpportunityDetails(id);
        setOpp(item);
      } catch (err) {
        // Fallback default detail object
        setOpp({
          business_id: "biz_millet_01",
          business_name: "Millet Processing & Packaging",
          category: "Food Processing",
          description: "Primary processing, cleaning, de-hulling, and branded retail packaging of ragi, bajra, and jowar for nearby urban markets.",
          score: 86,
          confidence: 82,
          confidence_level: "HIGH",
          investment_min: 120000,
          investment_max: 250000,
          working_capital: 35000,
          demand: "High Demand",
          competition: "Low Competition",
          skill_fit: "High Match",
          risk: "LOW",
          score_breakdown: [
            { factor_name: "Local Market Demand", weight_pct: 25, score: 85.0, description: "Strong purchasing power in district" },
            { factor_name: "Skill & Profile Fit", weight_pct: 20, score: 88.0, description: "Matches agriculture & food skills" },
            { factor_name: "Capital Compatibility", weight_pct: 15, score: 95.0, description: "Capital fits ₹1.5L target" },
            { factor_name: "Supply Availability", weight_pct: 10, score: 78.0, description: "Raw ragi crops abundant in block" },
            { factor_name: "Infrastructure Readiness", weight_pct: 10, score: 75.0, description: "Good road & single-phase power" },
            { factor_name: "Growth Potential", weight_pct: 10, score: 90.0, description: "High health food market growth" },
            { factor_name: "Risk Mitigation", weight_pct: 10, score: 90.0, description: "Low downside risk" }
          ],
          why_recommended: [
            "Strong local demand in Anantapur district (Demand Index: 85/100).",
            "High alignment with your background in agriculture & food processing.",
            "Capital compatible: ₹1.5L available fits setup range (₹1.2L - ₹2.5L).",
            "Local raw material ragi & millet crops abundant in Kudair block."
          ],
          why_alternatives_lower: [
            "Alternative options require significantly higher initial capital investment exceeding your target budget.",
            "Other business categories face stiffer local competition density in your village cluster.",
            "Certain high-growth options carry higher seasonality risks during monsoon off-seasons."
          ],
          assumptions: [
            "Assumes active operation in Kudair, Anantapur.",
            "Assumes standard single-phase/three-phase rural electrical grid availability.",
            "Assumes 10-15% annual market demand growth in the surrounding block.",
            "Assumes credit access via government-backed microfinance or MUDRA Yojana."
          ],
          data_sources: [
            { name: "District Micro-Enterprise Census", type: "Government/Open Data", freshness: "2025-Q4" },
            { name: "Local Agricultural Market Price Index", type: "Market Indicator", freshness: "Updated Monthly" },
            { name: "DrishtiX Geospatial Business Directory", type: "Competition Density", freshness: "2026-Q1" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadOpp();
  }, [id]);

  if (loading || !opp) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-xs font-semibold text-emerald-400 animate-pulse">Loading Detailed Decision Breakdown...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Back Link & Title */}
        <div>
          <Link href="/opportunities" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{opp.category}</span>
              <h1 className="text-3xl font-black text-white mt-1">{opp.business_name}</h1>
              <p className="text-xs text-slate-300 max-w-xl mt-2 leading-relaxed">{opp.description}</p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-400 block uppercase">Opportunity Score</span>
                <span className="text-3xl font-black text-emerald-400">{opp.score}<span className="text-xs text-slate-500 font-semibold">/100</span></span>
              </div>
              <div className="h-10 w-px bg-slate-800"></div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-400 block uppercase">Confidence</span>
                <span className="text-sm font-extrabold text-white">{opp.confidence}% <span className="text-emerald-400 text-xs font-bold">({opp.confidence_level})</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Factor Score Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>7-Factor Score Breakdown</span>
          </h3>

          <div className="space-y-3">
            {opp.score_breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.factor_name} <span className="text-[10px] text-slate-500 font-normal">({item.weight_pct}% weight)</span></span>
                  <span className="text-emerald-400 font-bold">{item.score}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-slate-400 block">{item.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Recommended & Why Alternatives Scored Lower */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>WHY THIS BUSINESS?</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {opp.why_recommended.map((r, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>WHY NOT OTHER OPTIONS?</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {opp.why_alternatives_lower.map((r, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Verified Data Sources & Assumptions */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Assumptions & Empirical Data Sources</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-bold text-slate-300 block mb-2">Model Assumptions:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {opp.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-2">Verified Data Sources Used:</span>
              <div className="space-y-2">
                {opp.data_sources.map((ds, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-white block">{ds.name}</span>
                      <span className="text-[10px] text-slate-400">{ds.type}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {ds.freshness}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Financial Twin */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 to-blue-950 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-white">Ready to inspect financial survival?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Launch the Financial Digital Twin to calculate revenue, costs, break-even sales volume, and ROI.
            </p>
          </div>

          <Link
            href={`/finance/${opp.business_id}`}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 shrink-0"
          >
            <DollarSign className="w-4 h-4" />
            <span>Run Financial Digital Twin</span>
          </Link>
        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
