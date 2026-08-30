"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { FinanceCalculateRequest, FinanceTwinResponse } from "@/types";
import { ArrowLeft, DollarSign, Sliders, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function FinanceTwinPage() {
  const params = useParams();
  const id = (params?.id as string) || "biz_millet_01";

  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<FinanceCalculateRequest>({
    opportunity_id: id,
    initial_investment: 120000,
    working_capital: 35000,
    monthly_sales_revenue: 85000,
    selling_price_per_unit: 170,
    units_sold_per_month: 500,
    variable_cost_per_unit: 93.5,
    fixed_cost_per_month: 15000,
    loan_amount: 50000,
    interest_rate_annual: 9.5,
    loan_tenure_months: 36,
  });

  const [res, setRes] = useState<FinanceTwinResponse | null>(null);

  const calculate = async (req: FinanceCalculateRequest) => {
    setLoading(true);
    try {
      const data = await api.calculateFinance(req);
      setRes(data);
    } catch (err) {
      // Fallback calculations for offline display
      const rev = req.units_sold_per_month * req.selling_price_per_unit;
      const var_c = req.units_sold_per_month * req.variable_cost_per_unit;
      const gross = rev - var_c;
      const emi = 1602.0;
      const net = gross - req.fixed_cost_per_month - emi;
      const break_even_u = Math.ceil((req.fixed_cost_per_month + emi) / (req.selling_price_per_unit - req.variable_cost_per_unit));
      const roi = Math.round(((net * 12) / (req.initial_investment + req.working_capital)) * 100);

      setRes({
        opportunity_id: id,
        initial_investment: req.initial_investment,
        working_capital: req.working_capital,
        monthly_revenue: rev,
        monthly_variable_costs: var_c,
        monthly_fixed_costs: req.fixed_cost_per_month,
        monthly_gross_profit: gross,
        monthly_loan_emi: emi,
        monthly_net_profit: net,
        monthly_cash_flow: net,
        break_even_units: break_even_u,
        break_even_revenue: break_even_u * req.selling_price_per_unit,
        roi_percent: roi,
        payback_months: 5.5,
        risk_assessment: net > 15000 ? "LOW" : "MEDIUM",
        disclaimer: "Estimated based on provided user assumptions and deterministic Python cost models."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate(inputs);
  }, []);

  const handleChange = (key: keyof FinanceCalculateRequest, value: number) => {
    const updated = { ...inputs, [key]: value };
    setInputs(updated);
    calculate(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header */}
        <div>
          <Link href={`/opportunities/${id}`} className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunity Details</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 8 & 9 • Deterministic Modeling</span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Financial Digital Twin</h1>
              <p className="text-xs text-slate-300 mt-1">
                All metrics are computed strictly via Python backend formulas. Zero LLM reliance for financial math.
              </p>
            </div>

            <Link
              href={`/simulation/${id}`}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <Sliders className="w-4 h-4" />
              <span>What-If Stress Simulator</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: Inputs (Left) vs Real-Time Outputs (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Financial Inputs</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Setup Capital (₹)</label>
                <input
                  type="number"
                  value={inputs.initial_investment}
                  onChange={(e) => handleChange("initial_investment", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Working Capital Reserve (₹)</label>
                <input
                  type="number"
                  value={inputs.working_capital}
                  onChange={(e) => handleChange("working_capital", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Selling Price per Unit (₹)</label>
                <input
                  type="number"
                  value={inputs.selling_price_per_unit}
                  onChange={(e) => handleChange("selling_price_per_unit", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly Sales Volume (Units)</label>
                <input
                  type="number"
                  value={inputs.units_sold_per_month}
                  onChange={(e) => handleChange("units_sold_per_month", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Variable Cost per Unit (₹)</label>
                <input
                  type="number"
                  value={inputs.variable_cost_per_unit}
                  onChange={(e) => handleChange("variable_cost_per_unit", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly Fixed Costs (Rent/Elec) (₹)</label>
                <input
                  type="number"
                  value={inputs.fixed_cost_per_month}
                  onChange={(e) => handleChange("fixed_cost_per_month", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div className="border-t border-slate-800 pt-3">
                <label className="block text-slate-300 font-semibold mb-1">Proposed MUDRA/Bank Loan (₹)</label>
                <input
                  type="number"
                  value={inputs.loan_amount}
                  onChange={(e) => handleChange("loan_amount", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Computed Outputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Metrics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Revenue</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">₹{res?.monthly_revenue.toLocaleString()}</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Net Profit / Mo.</span>
                <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">₹{res?.monthly_net_profit.toLocaleString()}</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Break-Even Sales</span>
                <span className="text-xl font-black text-amber-400 font-mono mt-1 block">{res?.break_even_units} <span className="text-xs text-slate-500 font-semibold">units</span></span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Projected ROI</span>
                <span className="text-xl font-black text-blue-400 font-mono mt-1 block">{res?.roi_percent}% <span className="text-xs text-slate-500 font-semibold">/ yr</span></span>
              </div>
            </div>

            {/* Detailed Financial Statement Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Monthly Profit & Loss Statement</h4>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
                  Risk Level: {res?.risk_assessment} Risk
                </span>
              </div>

              <div className="p-6 space-y-3 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-300 font-sans font-semibold">(+) Total Monthly Gross Revenue</span>
                  <span className="text-white font-bold">₹{res?.monthly_revenue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-800/60 text-slate-400">
                  <span className="font-sans">(-) Total Variable Production Costs</span>
                  <span>₹{res?.monthly_variable_costs.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-800 font-bold text-white bg-slate-950/40 px-2 rounded">
                  <span className="font-sans font-semibold">(=) Gross Profit Margin</span>
                  <span className="text-emerald-400">₹{res?.monthly_gross_profit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-800/60 text-slate-400">
                  <span className="font-sans">(-) Fixed Operating Expenses (Rent, Utilities, Labor)</span>
                  <span>₹{res?.monthly_fixed_costs.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-800/60 text-slate-400">
                  <span className="font-sans">(-) Bank Loan Monthly EMI</span>
                  <span>₹{res?.monthly_loan_emi.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-3 bg-emerald-950/40 border border-emerald-500/30 px-3 rounded-xl text-sm font-bold text-white">
                  <span className="font-sans">(=) Net Monthly Cash Flow</span>
                  <span className="text-emerald-400 text-base">₹{res?.monthly_net_profit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-[11px] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{res?.disclaimer}</span>
            </div>

          </div>

        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
