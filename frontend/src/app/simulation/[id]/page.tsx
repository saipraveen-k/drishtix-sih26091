"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { api } from "@/lib/api";
import { WhatIfSimulationResponse, FinanceCalculateRequest } from "@/types";
import { ArrowLeft, Sliders, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function SimulationPage() {
  const params = useParams();
  const id = (params?.id as string) || "biz_millet_01";

  const [salesPct, setSalesPct] = useState(-20);
  const [costPct, setCostPct] = useState(15);
  const [loading, setLoading] = useState(false);

  const baseFinance: FinanceCalculateRequest = {
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
  };

  const [data, setData] = useState<WhatIfSimulationResponse | null>(null);

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation(baseFinance, salesPct, costPct);
      setData(res);
    } catch (err) {
      // Fallback calculations
      const baseRev = 85000;
      const baseNet = 21648;
      
      const customRev = baseRev * (1 + salesPct / 100);
      const customExpenses = (85000 - 21648) * (1 + costPct / 100);
      const customNet = customRev - customExpenses;

      setData({
        base_case: { scenario_name: "Base Case", monthly_revenue: 85000, monthly_expenses: 63352, net_profit: 21648, cash_flow: 21648, break_even_units: 218, risk_level: "LOW" },
        optimistic_case: { scenario_name: "Optimistic (+20%)", monthly_revenue: 102000, monthly_expenses: 60184, net_profit: 41816, cash_flow: 41816, break_even_units: 185, risk_level: "LOW" },
        realistic_case: { scenario_name: "Realistic (+5%)", monthly_revenue: 89250, monthly_expenses: 64619, net_profit: 24631, cash_flow: 24631, break_even_units: 222, risk_level: "LOW" },
        stress_case: { scenario_name: "Stress (-20% Sales)", monthly_revenue: 68000, monthly_expenses: 72854, net_profit: -4854, cash_flow: -4854, break_even_units: 295, risk_level: "HIGH" },
        custom_scenario: { scenario_name: `Custom (${salesPct}% Sales)`, monthly_revenue: customRev, monthly_expenses: customExpenses, net_profit: customNet, cash_flow: customNet, break_even_units: 250, risk_level: customNet > 0 ? "MEDIUM" : "HIGH" }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSim();
  }, [salesPct, costPct]);

  const chartData = data ? [
    { name: "Base Case", Revenue: data.base_case.monthly_revenue, Expenses: data.base_case.monthly_expenses, Profit: data.base_case.net_profit },
    { name: "Optimistic", Revenue: data.optimistic_case.monthly_revenue, Expenses: data.optimistic_case.monthly_expenses, Profit: data.optimistic_case.net_profit },
    { name: "Realistic", Revenue: data.realistic_case.monthly_revenue, Expenses: data.realistic_case.monthly_expenses, Profit: data.realistic_case.net_profit },
    { name: "Stress Case", Revenue: data.stress_case.monthly_revenue, Expenses: data.stress_case.monthly_expenses, Profit: data.stress_case.net_profit },
    { name: "Custom", Revenue: data.custom_scenario.monthly_revenue, Expenses: data.custom_scenario.monthly_expenses, Profit: data.custom_scenario.net_profit },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header */}
        <div>
          <Link href={`/finance/${id}`} className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Financial Digital Twin</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 10 • Scenario Analysis</span>
              <h1 className="text-3xl font-extrabold text-white mt-1">What-If Stress Simulator</h1>
              <p className="text-xs text-slate-300 mt-1">
                Test business survival against market shocks, raw material inflation, and demand downturns.
              </p>
            </div>
          </div>
        </div>

        {/* Sliders & Real-Time Recalculation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-300">Sales Volume Change (%)</label>
              <span className={`font-mono font-bold ${salesPct < 0 ? "text-red-400" : "text-emerald-400"}`}>{salesPct}%</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="5"
              value={salesPct}
              onChange={(e) => setSalesPct(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>-40% Market Downturn</span>
              <span>Base (0%)</span>
              <span>+40% Boom</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-300">Operational Cost Change (%)</label>
              <span className={`font-mono font-bold ${costPct > 0 ? "text-amber-400" : "text-emerald-400"}`}>+{costPct}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={costPct}
              onChange={(e) => setCostPct(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>-20% Efficiency</span>
              <span>Base (0%)</span>
              <span>+40% Raw Material Inflation</span>
            </div>
          </div>

        </div>

        {/* Chart Visualization */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Financial Scenario Comparison Chart</span>
          </h3>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenario Cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 font-sans font-bold text-xs block">BASE CASE</span>
              <div className="text-slate-200">Revenue: ₹{data.base_case.monthly_revenue.toLocaleString()}</div>
              <div className="text-slate-400">Expenses: ₹{data.base_case.monthly_expenses.toLocaleString()}</div>
              <div className="text-emerald-400 font-bold text-sm">Net Profit: ₹{data.base_case.net_profit.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-sans font-bold bg-emerald-950 px-2 py-0.5 rounded inline-block">LOW RISK</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 font-sans font-bold text-xs block">OPTIMISTIC (+20%)</span>
              <div className="text-slate-200">Revenue: ₹{data.optimistic_case.monthly_revenue.toLocaleString()}</div>
              <div className="text-slate-400">Expenses: ₹{data.optimistic_case.monthly_expenses.toLocaleString()}</div>
              <div className="text-emerald-400 font-bold text-sm">Net Profit: ₹{data.optimistic_case.net_profit.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-sans font-bold bg-emerald-950 px-2 py-0.5 rounded inline-block">LOW RISK</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 font-sans font-bold text-xs block">REALISTIC (+5%)</span>
              <div className="text-slate-200">Revenue: ₹{data.realistic_case.monthly_revenue.toLocaleString()}</div>
              <div className="text-slate-400">Expenses: ₹{data.realistic_case.monthly_expenses.toLocaleString()}</div>
              <div className="text-emerald-400 font-bold text-sm">Net Profit: ₹{data.realistic_case.net_profit.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-sans font-bold bg-emerald-950 px-2 py-0.5 rounded inline-block">LOW RISK</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 font-sans font-bold text-xs block">STRESS CASE (-20%)</span>
              <div className="text-slate-200">Revenue: ₹{data.stress_case.monthly_revenue.toLocaleString()}</div>
              <div className="text-slate-400">Expenses: ₹{data.stress_case.monthly_expenses.toLocaleString()}</div>
              <div className={`font-bold text-sm ${data.stress_case.net_profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                Net Profit: ₹{data.stress_case.net_profit.toLocaleString()}
              </div>
              <span className="text-[10px] text-red-400 font-sans font-bold bg-red-950 px-2 py-0.5 rounded inline-block">{data.stress_case.risk_level} RISK</span>
            </div>

          </div>
        )}

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
