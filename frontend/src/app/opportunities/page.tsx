"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { RecommendationResponse } from "@/types";
import { OpportunityCard as OppCard } from "@/components/OpportunityCard";
import { Compass, Sparkles, MapPin, SlidersHorizontal, RefreshCw, AlertCircle } from "lucide-react";

export default function OpportunitiesPage() {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await api.getProfile();
        const res = await api.getRecommendations(profile);
        setData(res);
      } catch (err) {
        // Fallback default recommendations for offline resilience
        setData({
          user_location: "Kudair, Anantapur, Andhra Pradesh",
          total_analyzed: 9,
          recommendations: [
            {
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
                "Alternative options require higher initial capital investment.",
                "Stiffer local competition density in other categories."
              ],
              assumptions: [
                "Assumes active operation in Kudair, Anantapur.",
                "Assumes 10-15% annual demand growth."
              ],
              data_sources: [
                { name: "District Agriculture Survey 2025", type: "Govt Data", freshness: "2025-Q4" }
              ]
            },
            {
              business_id: "biz_spice_02",
              business_name: "Micro Spice Grinding & Blending",
              category: "Food Processing",
              description: "Grinding raw turmeric, chilli, coriander, and preparing authentic regional spice blends for local shops.",
              score: 81,
              confidence: 77,
              confidence_level: "HIGH",
              investment_min: 80000,
              investment_max: 180000,
              working_capital: 25000,
              demand: "Steady Demand",
              competition: "Moderate Competition",
              skill_fit: "High Match",
              risk: "LOW",
              score_breakdown: [],
              why_recommended: [
                "Consistent daily household consumption demand across villages.",
                "High profit margins on branded regional spice blends."
              ],
              why_alternatives_lower: [],
              assumptions: [],
              data_sources: []
            },
            {
              business_id: "biz_dairy_03",
              business_name: "Mini Dairy & Milk Product Processing",
              category: "Livestock & Dairy",
              description: "Value addition to raw milk by producing paneer, curd, ghee, and butter for local sweet shops.",
              score: 74,
              confidence: 71,
              confidence_level: "HIGH",
              investment_min: 150000,
              investment_max: 320000,
              working_capital: 45000,
              demand: "High Demand",
              competition: "Moderate Competition",
              skill_fit: "Moderate Match",
              risk: "MEDIUM",
              score_breakdown: [],
              why_recommended: [
                "High value-addition margin on paneer & ghee during festival peaks.",
                "Strong milk supply network in surrounding dairy farms."
              ],
              why_alternatives_lower: [],
              assumptions: [],
              data_sources: []
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Target Location: {data?.user_location || "Kudair, Anantapur"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Businesses That Fit You</h1>
            <p className="text-xs text-slate-400 mt-1">
              Analyzed {data?.total_analyzed || 9} micro-enterprise categories using your profile, skills, capital & local market data.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/onboarding"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Adjust Profile</span>
            </Link>
          </div>
        </div>

        {/* Opportunity Ranking Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {data?.recommendations.map((opp, idx) => (
              <OppCard key={opp.business_id} opportunity={opp} rank={idx + 1} />
            ))}
          </div>
        )}

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
