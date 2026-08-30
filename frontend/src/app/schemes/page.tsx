"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { SchemeItem, ReadinessScoreResponse } from "@/types";
import { ShieldCheck, CheckCircle2, FileText, AlertCircle, Award, CheckSquare, Square, Info } from "lucide-react";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [readiness, setReadiness] = useState<ReadinessScoreResponse | null>(null);
  const [providedDocs, setProvidedDocs] = useState<string[]>(["Aadhaar Card", "PAN Card", "Bank Statement (Last 6 Months)"]);
  const [loading, setLoading] = useState(true);

  const availableDocs = [
    "Aadhaar Card",
    "PAN Card",
    "Bank Statement (Last 6 Months)",
    "Detailed Project Report (DPR)",
    "Educational Qualification Certificate",
    "Rural Area Certificate"
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await api.getProfile();
      const schemeRes = await api.matchSchemes(profile, "biz_millet_01", "Food Processing", 120000);
      setSchemes(schemeRes.schemes);

      const readRes = await api.calculateReadiness(profile, "biz_millet_01", providedDocs);
      setReadiness(readRes);
    } catch (err) {
      // Fallback
      setSchemes([
        {
          scheme_id: "sch_pmegp_01",
          name: "Prime Minister's Employment Generation Programme (PMEGP)",
          nodal_agency: "KVIC / Ministry of MSME",
          relevance_reason: "Directly applicable for Food Processing micro-enterprises in rural areas.",
          eligibility_status: "Potentially Relevant",
          potential_benefit: "Credit-linked subsidy of 25% to 35% on project costs up to ₹50 Lakhs.",
          required_documents: ["Aadhaar Card", "PAN Card", "Project Report (DPR)", "Tehsildar Rural Certificate"],
          description: "Generates self-employment micro-enterprises in non-farm rural sectors."
        },
        {
          scheme_id: "sch_pmfme_02",
          name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
          nodal_agency: "Ministry of Food Processing Industries (MoFPI)",
          relevance_reason: "Provides 35% capital subsidy under One District One Product (ODOP) scheme.",
          eligibility_status: "Potentially Relevant",
          potential_benefit: "35% capital subsidy up to ₹10 Lakhs + FSSAI technical support.",
          required_documents: ["Aadhaar Card", "FSSAI Basic Registration", "Bank Statement"],
          description: "Financial and technical support for individual micro food processing units."
        },
        {
          scheme_id: "sch_mudra_03",
          name: "Pradhan Mantri MUDRA Yojana (PMMY)",
          nodal_agency: "Department of Financial Services",
          relevance_reason: "Collateral-free micro loans under Shishu / Kishore categories.",
          eligibility_status: "Potentially Relevant",
          potential_benefit: "Collateral-free loan up to ₹10 Lakhs at competitive bank rates.",
          required_documents: ["Aadhaar Card", "Voter ID", "Business Address Proof"],
          description: "Micro financing for non-corporate small enterprises."
        }
      ]);

      setReadiness({
        overall_readiness_score: 78.0,
        profile_readiness: 100.0,
        business_readiness: 100.0,
        financial_readiness: 75.0,
        document_readiness: 50.0,
        eligibility_readiness: 90.0,
        missing_requirements: [
          "Missing 3 key documents: Detailed Project Report (DPR), Educational Qualification Certificate, Rural Area Certificate"
        ],
        document_checklist: {
          "Aadhaar Card": true,
          "PAN Card": true,
          "Bank Statement (Last 6 Months)": true,
          "Detailed Project Report (DPR)": false,
          "Educational Qualification Certificate": false,
          "Rural Area Certificate": false
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [providedDocs]);

  const toggleDoc = (doc: string) => {
    setProvidedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 11 • Finance & Scheme Matching</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Scheme & Financing Readiness</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Match your business profile against government subsidy schemes (PMEGP, PMFME, MUDRA) and inspect document compliance readiness.
          </p>
        </div>

        {/* Readiness Meter & Document Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Readiness Score Breakdown Card */}
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Overall Readiness Meter</span>
            </h3>

            <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-4xl font-black text-emerald-400">{readiness?.overall_readiness_score}%</span>
              <span className="text-xs text-slate-400 font-semibold block mt-1">Overall Scheme Readiness</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Profile Readiness:</span>
                <span className="font-bold text-white">{readiness?.profile_readiness}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Business Skill Fit:</span>
                <span className="font-bold text-white">{readiness?.business_readiness}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Financial Fit:</span>
                <span className="font-bold text-white">{readiness?.financial_readiness}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Document Compliance:</span>
                <span className="font-bold text-emerald-400">{readiness?.document_readiness}%</span>
              </div>
            </div>

            {readiness?.missing_requirements && readiness.missing_requirements.length > 0 && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg text-[11px] text-amber-300 space-y-1">
                <span className="font-bold block">Pending Requirements:</span>
                {readiness.missing_requirements.map((m, idx) => (
                  <p key={idx}>• {m}</p>
                ))}
              </div>
            )}
          </div>

          {/* Document Checklist Selection */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Interactive Document Checklist</span>
            </h3>
            <p className="text-xs text-slate-400">Select the documents you currently possess to recalculate your real-time compliance readiness:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {availableDocs.map((doc) => {
                const isChecked = providedDocs.includes(doc);
                return (
                  <div
                    key={doc}
                    onClick={() => toggleDoc(doc)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      isChecked
                        ? "bg-emerald-950/40 border-emerald-500/50 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className="font-medium">{doc}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Matched Schemes List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Potentially Relevant Government Schemes</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {schemes.map((s) => (
              <div key={s.scheme_id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-white">{s.name}</h4>
                    <span className="text-xs text-slate-400 font-medium">Nodal Agency: {s.nodal_agency}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40 self-start sm:self-auto">
                    {s.eligibility_status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Why Relevant?</span>
                    <span className="text-white mt-0.5 block">{s.relevance_reason}</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Potential Benefit</span>
                    <span className="text-emerald-400 font-semibold mt-0.5 block">{s.potential_benefit}</span>
                  </div>
                </div>

                <div className="text-xs pt-1">
                  <span className="text-slate-400 font-semibold block mb-1">Required Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.required_documents.map((rd, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {rd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
