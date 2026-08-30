"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ProfileData } from "@/types";
import { User, MapPin, SlidersHorizontal, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getProfile();
        setProfile(p);
      } catch (err) {
        setProfile({
          name: "Ramesh Kumar",
          age: 29,
          gender: "Male",
          language: "en",
          available_capital: 150000,
          expected_investment: 200000,
          desired_loan_amount: 50000,
          experience_level: "some experience",
          existing_business: false,
          business_goal: "first business",
          state: "Andhra Pradesh",
          district: "Anantapur",
          block: "Kudair",
          village: "Kudair",
          skills: ["Agriculture", "Food Processing"],
          interests: ["Food Processing", "Manufacturing"]
        });
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center">
              RK
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{profile?.name || "Ramesh Kumar"}</h1>
              <p className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{profile?.village || "Kudair"}, {profile?.district || "Anantapur"}, {profile?.state || "Andhra Pradesh"}</span>
              </p>
            </div>
          </div>

          <Link href="/onboarding">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>

        <Card className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Registered Profile & Financial Parameters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">AVAILABLE CAPITAL:</span>
              <span className="font-bold text-slate-900 text-sm">₹{profile?.available_capital.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">EXPECTED INVESTMENT:</span>
              <span className="font-bold text-slate-900 text-sm">₹{profile?.expected_investment.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">FUNDING GAP / LOAN:</span>
              <span className="font-bold text-blue-700 text-sm">₹{profile?.desired_loan_amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block">Registered Skills & Background:</span>
            <div className="flex flex-wrap gap-2">
              {profile?.skills.map((s) => (
                <Badge key={s} variant="info">{s}</Badge>
              ))}
            </div>
          </div>
        </Card>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
