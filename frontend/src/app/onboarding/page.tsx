"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import { ProfileData } from "@/types";
import { ArrowRight, User, MapPin, IndianRupee, Briefcase, Award, Target, Check } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProfileData>({
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
    pincode: "515711",
    latitude: 14.6819,
    longitude: 77.4521,
    skills: ["agriculture", "food processing"],
    interests: ["food", "manufacturing"],
  });

  const availableSkills = [
    "agriculture",
    "food processing",
    "livestock",
    "handicraft",
    "retail",
    "manufacturing",
    "repair/services",
    "digital services"
  ];

  const availableInterests = [
    "agriculture",
    "food",
    "manufacturing",
    "services",
    "retail",
    "renewable energy",
    "livestock",
    "handicrafts"
  ];

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.saveProfile(form);
      router.push("/opportunities");
    } catch (err) {
      router.push("/opportunities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 1 of 3 • Entrepreneur Onboarding</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Build Your Entrepreneur Profile</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            Tell DrishtiX about your location, capital, skills, and business goals to discover your optimal business opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>1. Personal & Language Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Age</label>
                <input
                  type="number"
                  required
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Preferred Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4 border-t border-slate-800/80 pt-6">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>2. Target Hyper-Local Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">State</label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">District</label>
                <input
                  type="text"
                  required
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Block / Mandal</label>
                <input
                  type="text"
                  value={form.block}
                  onChange={(e) => setForm({ ...form, block: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Village</label>
                <input
                  type="text"
                  required
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Background */}
          <div className="space-y-4 border-t border-slate-800/80 pt-6">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <IndianRupee className="w-4 h-4" />
              <span>3. Financial Capital & Loan Requirement</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Available Capital (₹)</label>
                <input
                  type="number"
                  required
                  value={form.available_capital}
                  onChange={(e) => setForm({ ...form, available_capital: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Expected Investment Target (₹)</label>
                <input
                  type="number"
                  value={form.expected_investment}
                  onChange={(e) => setForm({ ...form, expected_investment: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Desired Loan Amount (₹)</label>
                <input
                  type="number"
                  value={form.desired_loan_amount}
                  onChange={(e) => setForm({ ...form, desired_loan_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Skills & Experience */}
          <div className="space-y-4 border-t border-slate-800/80 pt-6">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>4. Your Skills & Experience Level</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-xs text-slate-300 font-semibold">Select Applicable Skills:</label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((sk) => {
                  const isSelected = form.skills.includes(sk);
                  return (
                    <button
                      type="button"
                      key={sk}
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Experience Level</label>
                <select
                  value={form.experience_level}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="beginner">Beginner (No prior business experience)</option>
                  <option value="some experience">Some Experience (Worked in similar line)</option>
                  <option value="experienced">Experienced (Seasoned entrepreneur)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Primary Business Goal</label>
                <select
                  value={form.business_goal}
                  onChange={(e) => setForm({ ...form, business_goal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="first business">Start First Micro-Business</option>
                  <option value="expand existing business">Expand Existing Unit</option>
                  <option value="increase income">Supplement Household Income</option>
                  <option value="create employment">Create Local Village Employment</option>
                  <option value="use local resources">Value Addition to Local Produce</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Analyzing Local Intelligence..." : "Discover My Opportunities"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}
