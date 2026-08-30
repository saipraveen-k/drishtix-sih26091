"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import { ProfileData } from "@/types";
import { User, MapPin, IndianRupee, Award, Edit } from "lucide-react";

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
          skills: ["agriculture", "food processing"],
          interests: ["food", "manufacturing"]
        });
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Entrepreneur Profile</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">{profile?.name || "Ramesh Kumar"}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Location: {profile?.village}, {profile?.district}, {profile?.state}
            </p>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center space-x-1.5 transition-all shrink-0"
          >
            <Edit className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <span>Capital Breakdown</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Available Capital:</span>
                <span className="font-mono font-bold text-emerald-400">₹{profile?.available_capital.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Investment:</span>
                <span className="font-mono font-bold text-white">₹{profile?.expected_investment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Desired Loan:</span>
                <span className="font-mono font-bold text-blue-400">₹{profile?.desired_loan_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Skills & Experience</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Experience Level:</span>
                <span className="font-bold text-white capitalize">{profile?.experience_level}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Primary Goal:</span>
                <span className="font-bold text-white capitalize">{profile?.business_goal}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {profile?.skills.map((s) => (
                    <span key={s} className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded border border-slate-800 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
