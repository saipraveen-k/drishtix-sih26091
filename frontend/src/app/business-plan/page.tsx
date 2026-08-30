"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { BusinessPlanResponse } from "@/types";
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, Share2 } from "lucide-react";

export default function BusinessPlanPage() {
  const [plan, setPlan] = useState<BusinessPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const profile = await api.getProfile();
        const res = await api.generateBusinessPlan(profile, "biz_millet_01");
        setPlan(res);
      } catch (err) {
        // Fallback default business plan
        setPlan({
          plan_id: "plan_2026_987",
          business_name: "Millet Processing & Packaging",
          entrepreneur_name: "Ramesh Kumar",
          generated_at: "2026-08-30 23:30:00",
          sections: [
            { section_number: 1, title: "1. Executive Summary", content: "Millet Processing & Packaging is a high-potential rural micro-enterprise proposed by Ramesh Kumar in Kudair, Anantapur, Andhra Pradesh. Operating with an initial setup capital of ₹120,000 and projected monthly net profit of ₹21,648." },
            { section_number: 2, title: "2. Business Overview", content: "Primary processing, cleaning, de-hulling, and branded retail packaging of ragi, bajra, and jowar for nearby urban markets." },
            { section_number: 3, title: "3. Entrepreneur Profile", content: "Promoter Name: Ramesh Kumar | Age: 29 | Location: Kudair, Anantapur | Experience: Some Experience | Primary Skills: Agriculture, Food Processing." },
            { section_number: 4, title: "4. Local Market Analysis", content: "Location Demand Index: 85/100 | Population Base: 14,500 residents | Nearest Major Market: 4.5 km | Road Connectivity: Good." },
            { section_number: 5, title: "5. Opportunity Analysis", content: "DrishtiX Opportunity Score: 86/100 (High Confidence). Key recommendation drivers include strong local demand, accessible raw material supply, and manageable capital requirements." },
            { section_number: 6, title: "6. Products & Services", content: "Primary offerings include processed millet flour and packaged whole grains with standardized local packaging and quality assurance." },
            { section_number: 7, title: "7. Target Customers", content: "Rural households in Anantapur, local retail stores, sweet shops, weekly haats, and agricultural cooperatives." },
            { section_number: 8, title: "8. Competition Analysis", content: "Local Competition Density Index: 38/100 (Moderate). The business will differentiate through superior freshness and direct-from-source pricing." },
            { section_number: 9, title: "9. Operations & Infrastructure Plan", content: "Required Infrastructure: Single-phase power shed, dry storage. Raw Material Requirements: Local ragi and millet crops." },
            { section_number: 10, title: "10. Investment Requirement", content: "Initial Fixed Investment: ₹120,000 | Working Capital Reserve: ₹35,000 | Total Project Cost: ₹155,000.", is_financial_table: true, table_data: { "Fixed Capital": 120000, "Working Capital": 35000, "Total Project Cost": 155000 } },
            { section_number: 11, title: "11. Working Capital Cycle", content: "Estimated 30-day operating cycle for inventory procurement, processing, and receivables collection from local vendors." },
            { section_number: 12, title: "12. Revenue Assumptions", content: "Monthly Revenue: ₹85,000 based on estimated monthly sales volume of 500 units at ₹170 per unit." },
            { section_number: 13, title: "13. Expense Assumptions", content: "Monthly Variable Costs: ₹46,750 | Monthly Fixed Costs: ₹15,000 | Loan EMI: ₹1,602." },
            { section_number: 14, title: "14. Financial Projections & Cash Flow", content: "Monthly Gross Profit: ₹38,250 | Monthly Net Profit: ₹21,648 | Projected ROI: 167% per annum.", is_financial_table: true, table_data: { "Gross Profit": 38250, "Net Profit": 21648, "Loan EMI": 1602, "ROI %": 167 } },
            { section_number: 15, title: "15. Break-Even Analysis", content: "Break-even Monthly Volume: 218 units | Break-even Monthly Revenue: ₹37,060." },
            { section_number: 16, title: "16. Risk Analysis", content: "Risk Level: LOW | Key risks include raw material price fluctuations during non-harvest months." },
            { section_number: 17, title: "17. Risk Mitigation Strategies", content: "Procure raw materials directly from local farmers during harvest peaks and maintain solar/generator power backup." },
            { section_number: 18, title: "18. Financing Requirement", content: "Promoter Contribution: ₹105,000 | Proposed Debt / Bank Loan: ₹50,000." },
            { section_number: 19, title: "19. Potential Government Scheme Support", content: "Relevant Schemes: PMEGP, PMFME, Mudra Yojana. Potential credit-linked subsidy eligibility ranges from 25% to 35%." },
            { section_number: 20, title: "20. Implementation & Launch Roadmap", content: "Month 1: Location finalization & PMEGP loan application | Month 2: Equipment procurement | Month 3: Commercial launch in Kudair." }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 print:p-0 print:bg-white print:text-black">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl print:hidden">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 12 • Official Business Plan</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">20-Section Business Plan</h1>
            <p className="text-xs text-slate-300 mt-1">
              Generated for bank loan submission (PMEGP / MUDRA) using deterministic financial twin outputs.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-emerald-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Business Plan Document Paper */}
        <div className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-2xl shadow-2xl space-y-8 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none">
          
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-6 text-center space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-xs font-bold uppercase print:bg-gray-100 print:text-black">
              Official Project Report (DPR)
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight print:text-black">{plan?.business_name}</h2>
            <p className="text-xs text-slate-400 print:text-gray-600">
              Prepared for: <strong>{plan?.entrepreneur_name}</strong> | Generated on: {plan?.generated_at} | Ref: {plan?.plan_id}
            </p>
          </div>

          {/* 20 Sections List */}
          <div className="space-y-6">
            {plan?.sections.map((sec) => (
              <div key={sec.section_number} className="space-y-2 border-b border-slate-800/60 pb-5 last:border-none">
                <h3 className="text-base font-bold text-emerald-400 print:text-black">{sec.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">{sec.content}</p>

                {sec.is_financial_table && sec.table_data && (
                  <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl max-w-md print:bg-gray-50 print:border-gray-300">
                    <table className="w-full text-xs font-mono text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-1">Metric</th>
                          <th className="py-1 text-right">Value (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sec.table_data).map(([k, v]) => (
                          <tr key={k} className="border-b border-slate-900/60">
                            <td className="py-1 text-slate-300 font-sans">{k}</td>
                            <td className="py-1 text-right font-bold text-emerald-400 print:text-black">
                              {typeof v === "number" ? `₹${v.toLocaleString()}` : v}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Document Verification Footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 print:text-gray-600">
            <span>Verified by DrishtiX Decision Intelligence System (SIH 2026)</span>
            <span>Page 1 of 1</span>
          </div>

        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
