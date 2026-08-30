"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Bot, Sparkles, ShieldCheck } from "lucide-react";

export default function CopilotPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-xl shadow-emerald-500/20">
            <Bot className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-white">DrishtiX AI Decision Copilot</h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Context-aware AI advisor connected to your entrepreneur profile, local market indicators, financial digital twin, and government scheme vector store.
          </p>

          <p className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 py-2 px-4 rounded-xl border border-emerald-800/40 inline-block">
            Click the floating Copilot button at the bottom-right of your screen to open the interactive assistant drawer.
          </p>
        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
