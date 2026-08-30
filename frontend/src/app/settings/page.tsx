"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Settings, ShieldCheck, Cpu, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h1 className="text-2xl font-extrabold text-white">Platform Configuration & Settings</h1>
          <p className="text-xs text-slate-400 mt-1">DrishtiX Decision Intelligence System (SIH 2026)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300 font-semibold">Backend API Endpoint:</span>
            <span className="font-mono text-emerald-400">http://127.0.0.1:8000/api</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300 font-semibold">LLM Provider Mode:</span>
            <span className="font-mono text-white">Auto (Gemini / OpenAI / Mock Provider)</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-300 font-semibold">Dataset Processing Status:</span>
            <span className="font-mono text-emerald-400">Dataset-Agnostic Engine Ready</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 font-semibold">Vector Store Index:</span>
            <span className="font-mono text-blue-400">FAISS / JSON Index Active</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
