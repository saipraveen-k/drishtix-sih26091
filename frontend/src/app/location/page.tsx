"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { MapPin, TrendingUp, Users, Building2, ShieldCheck, Zap } from "lucide-react";

// Dynamically import MapComponent to prevent SSR Leaflet window error
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading Map Layer...</div>
});

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Hyper-Local GIS Intelligence • Kudair, Anantapur, Andhra Pradesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Location & Market Intelligence Map
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Geospatial analysis of market demand, competitor density, infrastructure connectivity, and local raw material availability within 5km radius.
            </p>
          </div>

          <Badge variant="info">Catchment Radius: 5.0 km</Badge>
        </div>

        {/* Map & Market Snapshot Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Map Container */}
          <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Interactive OpenStreetMap GIS Layer</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">14.6819° N, 77.4521° E</span>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 min-h-[380px]">
              <MapComponent
                center={[14.6819, 77.4521]}
                zoom={13}
                markers={[
                  { lat: 14.6819, lng: 77.4521, title: "Entrepreneur Target Site (Kudair)", type: "entrepreneur" },
                  { lat: 14.6900, lng: 77.4600, title: "Competitor Unit A (Spice Trader)", type: "competitor" },
                  { lat: 14.6750, lng: 77.4450, title: "District Market Hub", type: "market" }
                ]}
              />
            </div>
          </div>

          {/* RIGHT: Market Snapshot Metrics */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
              Local Market Snapshot
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Market Demand"
                value="85 / 100"
                subtext="High Purchasing Power"
                icon={TrendingUp}
                variant="emerald"
              />
              <MetricCard
                label="Competition"
                value="38 / 100"
                subtext="Low Competitor Density"
                icon={Building2}
                variant="blue"
              />
              <MetricCard
                label="Resource Score"
                value="78 / 100"
                subtext="Abundant Raw Millets"
                icon={Zap}
                variant="amber"
              />
              <MetricCard
                label="Infrastructure"
                value="75 / 100"
                subtext="Single-Phase Power & Road"
                icon={ShieldCheck}
                variant="slate"
              />
            </div>

            {/* Market Opportunity Gaps */}
            <Card className="space-y-3 bg-blue-50/40 border-blue-200/80">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Identified Local Market Gaps
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-slate-900 block">High Demand + Low Local Supply:</span>
                  <span className="text-slate-600">Processed ragi & packaged millets currently imported from Anantapur town (4.5km away).</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-slate-900 block">Raw Material Advantage:</span>
                  <span className="text-slate-600">12 local agricultural farms within 3km producing raw crops.</span>
                </div>
              </div>
            </Card>

            <DataSourceBadge
              sourceName="AP District GIS & Census Data 2026"
              freshness="2026-Q1"
              confidence={86}
            />
          </div>

        </div>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
