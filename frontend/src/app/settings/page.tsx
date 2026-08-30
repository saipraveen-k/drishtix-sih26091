"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Settings, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex items-center space-x-3">
          <Settings className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">Platform Settings</h1>
            <p className="text-xs text-slate-500">Configure LLM providers, map tiles, and offline data fallbacks.</p>
          </div>
        </div>

        <Card className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            System & Provider Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">LLM Assistant Provider:</span>
                <span className="text-slate-500">Auto (Gemini Flash / OpenAI / Mock Fallback)</span>
              </div>
              <Badge variant="success">ONLINE (Mock Active)</Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">GIS Map Engine:</span>
                <span className="text-slate-500">Leaflet + OpenStreetMap Tile Layer</span>
              </div>
              <Badge variant="info">ACTIVE</Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Deterministic Decision Engine:</span>
                <span className="text-slate-500">FastAPI Python backend rules engine v2.0</span>
              </div>
              <Badge variant="success">DETERMINISTIC</Badge>
            </div>
          </div>
        </Card>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
