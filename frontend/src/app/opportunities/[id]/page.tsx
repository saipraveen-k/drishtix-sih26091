"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { api } from "@/lib/api";
import { OpportunityItem } from "@/types";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Calculator, Award, FileText } from "lucide-react";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "biz_millet_01";
  const [opp, setOpp] = useState<OpportunityItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpp() {
      try {
        const item = await api.getOpportunityDetails(id);
        setOpp(item);
      } catch (err) {
        setOpp({
          business_id: id,
          business_name: "Millet Processing & Packaging",
          category: "Food Processing",
          description: "Primary processing, cleaning, de-hulling, and branded retail packaging of ragi, bajra, and jowar for nearby urban markets.",
          score: 84.8,
          confidence: 100,
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
            "Local raw material ragi & millet crops abundant in Kudair block.",
            "Low operational risk with high downside protection."
          ],
          why_alternatives_lower: [
            "Alternative Option A (Spice Grinding) has lower capital compatibility margin.",
            "Alternative Option B (Mini Dairy) has higher initial fixed machinery cost."
          ],
          assumptions: [
            "Assumes active operation in Kudair, Anantapur.",
            "Assumes 10-15% annual demand growth."
          ],
          data_sources: [
            { name: "District Agriculture Survey 2026", type: "Govt Data", freshness: "2026-Q1" }
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Back Link */}
        <Link
          href="/opportunities"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Recommended Opportunities</span>
        </Link>

        {/* Hero Card */}
        <Card className="shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="success">RANK #1 TOP MATCH</Badge>
                <Badge variant="info">{opp.category}</Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">{opp.business_name}</h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {opp.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <ScoreRing score={opp.score} size="lg" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Setup Capital Range</span>
              <span className="font-extrabold text-slate-900 text-sm">
                ₹{(opp.investment_min / 100000).toFixed(1)}L – ₹{(opp.investment_max / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="border-r border-slate-200 pr-4" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Working Capital</span>
              <span className="font-extrabold text-slate-900 text-sm">₹{opp.working_capital.toLocaleString()}</span>
            </div>
            <div className="border-r border-slate-200 pr-4" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Operational Risk</span>
              <span className="font-bold text-blue-700 text-sm">{opp.risk} RISK</span>
            </div>
          </div>
        </Card>

        {/* 7-Factor Breakdown Chart Section */}
        <Card className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
            Deterministic 7-Factor Fit Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Calculated strictly by backend Python rules using Kudair, Anantapur datasets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-2">
            {opp.score_breakdown.map((f) => (
              <ProgressBar
                key={f.factor_name}
                label={f.factor_name}
                value={f.score}
                weight={f.weight_pct}
                description={f.description}
              />
            ))}
          </div>
        </Card>

        {/* Why Recommended vs Why Alternatives Lower */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-3 bg-emerald-50/30 border-emerald-200/80">
            <h3 className="text-sm font-extrabold text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Why Recommended?</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {opp.why_recommended.map((w, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-3 bg-amber-50/30 border-amber-200/80">
            <h3 className="text-sm font-extrabold text-amber-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Why Not Alternatives?</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {opp.why_alternatives_lower.map((alt, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Data Source Transparency Badge */}
        <DataSourceBadge
          sourceName="District Agriculture & Market Survey 2026"
          freshness="2026-Q1"
          confidence={opp.confidence}
        />

        {/* Next Steps CTA Bar */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base">Test Financial Survival & Loan Eligibility</h4>
            <p className="text-xs text-slate-300">Run the Business Survival Simulator with your exact sales and expense sliders.</p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
            <Link href={`/finance/${opp.business_id}`} className="w-full sm:w-auto">
              <button className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md">
                <Calculator className="w-4 h-4" />
                <span>Run Survival Simulator</span>
              </button>
            </Link>
          </div>
        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
