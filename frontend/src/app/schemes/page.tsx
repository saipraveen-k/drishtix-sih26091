"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Checklist, ChecklistItem } from "@/components/ui/Checklist";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { SchemeItem, ReadinessScoreResponse } from "@/types";
import { Award, CheckCircle2, FileCheck, ShieldCheck, ArrowRight, Info } from "lucide-react";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [readiness, setReadiness] = useState<ReadinessScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: "1", label: "Identity & Address Verification (Aadhaar / PAN)", category: "identity", status: "verified" },
    { id: "2", label: "Gram Panchayat NOC / Business Premises Proof", category: "business", status: "verified" },
    { id: "3", label: "Machinery Cost Quotation & Estimate", category: "financial", status: "verified" },
    { id: "4", label: "Hyper-Local Market Demand Analysis", category: "business", status: "verified" },
    { id: "5", label: "20-Section Detailed Project Report (DPR)", category: "compliance", status: "action_required" },
    { id: "6", label: "FSSAI Food Safety License Registration", category: "compliance", status: "action_required" }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await api.getProfile();
        const schemeRes = await api.matchSchemes(prof, "biz_millet_01", "Food Processing", 120000);
        setSchemes(schemeRes.schemes);
        const readRes = await api.calculateReadiness(prof, "biz_millet_01", ["Aadhaar Card", "PAN Card"]);
        setReadiness(readRes);
      } catch (err) {
        setSchemes([
          {
            scheme_id: "sch_pmegp_01",
            name: "Prime Minister's Employment Generation Programme (PMEGP)",
            nodal_agency: "KVIC / Khadi Board",
            relevance_reason: "Matches rural food processing manufacturing micro-enterprise setup.",
            eligibility_status: "Potentially Eligible (Preliminary Match)",
            potential_benefit: "35% Rural Financial Subsidy (Up to ₹50 Lakh Loan)",
            required_documents: ["Aadhaar Card", "PAN Card", "Project Report (DPR)", "Gram Panchayat NOC"],
            description: "Credit-linked subsidy program for setting up new micro-enterprises in rural areas."
          },
          {
            scheme_id: "sch_pmfme_02",
            name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
            nodal_agency: "Ministry of Food Processing Industries (MoFPI)",
            relevance_reason: "Direct fit for millet milling, grinding & packaging units.",
            eligibility_status: "Potentially Eligible (Preliminary Match)",
            potential_benefit: "35% Capital Subsidy (Up to ₹10 Lakh Limit)",
            required_documents: ["Aadhaar Card", "FSSAI License", "Machinery Quotation", "DPR"],
            description: "Support for individual micro food processing units with credit-linked capital subsidy."
          },
          {
            scheme_id: "sch_mudra_03",
            name: "Pradhan Mantri MUDRA Yojana (Kishore Category)",
            nodal_agency: "SIDBI / Nationalized Banks",
            relevance_reason: "Provides collateral-free loan for working capital requirement.",
            eligibility_status: "Potentially Eligible (Preliminary Match)",
            potential_benefit: "Collateral-Free Loan from ₹50K to ₹5 Lakh",
            required_documents: ["Aadhaar Card", "Bank Statement", "Business Proposal"],
            description: "Collateral-free loans for non-farm micro and small enterprises."
          }
        ]);

        setReadiness({
          overall_readiness_score: 88,
          profile_readiness: 100,
          business_readiness: 100,
          financial_readiness: 100,
          document_readiness: 50,
          eligibility_readiness: 90,
          missing_requirements: ["Final Business Plan (DPR) Submission", "FSSAI Food License Application"],
          document_checklist: { "Aadhaar Card": true, "PAN Card": true, "DPR": false }
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 mb-1">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Government Financing & Subsidies • SIH26091 Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Finance Options for You
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Matched government subsidy schemes and collateral-free loan pathways tailored for your location and business category.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 max-w-xs space-y-0.5">
            <span className="font-bold flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Preliminary Match Disclaimer</span>
            </span>
            <p className="text-[10px] text-amber-800">
              Final subsidy approval and eligibility determination are subject to verification by concerned bank authorities.
            </p>
          </div>
        </div>

        {/* Section 1: Application Readiness Meter (Canonical 88% Score) */}
        <div id="readiness" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                Application Readiness Meter
              </span>
              <h2 className="text-2xl font-black text-slate-900">Your Bank Application Readiness</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated against bank loan approval checklists and scheme compliance requirements.
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 shrink-0">
              <ScoreRing score={readiness?.overall_readiness_score || 88} size="md" label="Readiness" />
            </div>
          </div>

          {/* 4 Pillars Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Profile Fit</span>
              <span className="text-lg font-black text-emerald-700">100%</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Business Fit</span>
              <span className="text-lg font-black text-emerald-700">100%</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Financial Fit</span>
              <span className="text-lg font-black text-emerald-700">100%</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Document Compliance</span>
              <span className="text-lg font-black text-amber-700">50%</span>
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Document Compliance Checklist
            </h3>
            <Checklist items={checklistItems} />
          </div>

          <div className="pt-2 flex justify-end">
            <Link href="/business-plan">
              <Button variant="secondary" size="md">
                <span>IMPROVE READINESS BY GENERATING DPR →</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 2: Matched Government Scheme Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider">
            Matched Subsidy & Credit Schemes
          </h2>

          <div className="space-y-4">
            {schemes.map((s, idx) => (
              <Card key={s.scheme_id} className="space-y-4 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                      <Badge variant="success">92% MATCH</Badge>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Nodal Agency: {s.nodal_agency}</span>
                  </div>

                  <Badge variant="info">{s.eligibility_status}</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs flex justify-between items-center">
                  <span className="font-bold text-emerald-900">Potential Subsidy & Financial Benefit:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{s.potential_benefit}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700">Why This Scheme?</span>
                  <p className="text-slate-600">{s.relevance_reason}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => alert(`Scheme details for ${s.name}: Contact district Nodal Officer or apply online with your generated DPR.`)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    View Scheme Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
