"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ProfileData } from "@/types";
import { MapPin, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from "lucide-react";

const SKILL_OPTIONS = [
  "Agriculture",
  "Food Processing",
  "Livestock & Dairy",
  "Handicraft & Textiles",
  "Retail & Trade",
  "Manufacturing",
  "Repair & Services",
  "Digital Services",
  "Transport & Logistics"
];

const RESOURCE_OPTIONS = [
  "Owned Land",
  "Commercial Shop",
  "Vehicle (2/4 Wheeler)",
  "Machinery / Equipment",
  "Electricity Connection",
  "Internet / Mobile Connectivity",
  "Water Supply",
  "Raw Materials Nearby"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    name: "Ramesh Kumar",
    age: 29,
    gender: "Male",
    language: "en",
    business_goal: "first business",
    experience_level: "some experience",
    existing_business: false,
    available_capital: 150000,
    expected_investment: 200000,
    desired_loan_amount: 50000,
    state: "Andhra Pradesh",
    district: "Anantapur",
    block: "Kudair",
    village: "Kudair",
    pincode: "515711",
    latitude: 14.6819,
    longitude: 77.4521,
    skills: ["Agriculture", "Food Processing"],
    interests: ["Food Processing", "Manufacturing"]
  });

  const steps = ["Goal", "Skills", "Experience", "Capital", "Location", "Resources"];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]
      };
    });
  };

  const toggleResource = (resource: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(resource);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((r) => r !== resource) : [...prev.interests, resource]
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.saveProfile(formData);
      router.push("/opportunities");
    } catch (err) {
      router.push("/opportunities");
    } finally {
      setLoading(false);
    }
  };

  const fundingGap = Math.max(0, formData.expected_investment - formData.available_capital);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Entrepreneurship Setup Wizard
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tell DrishtiX About Yourself</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            We use your background and location data to discover micro-enterprises you are most likely to succeed in.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <Stepper steps={steps} currentStep={step} onStepClick={(s) => setStep(s)} />
        </div>

        {/* Form Wizard Step Cards */}
        <Card className="shadow-md">
          
          {/* STEP 1: GOAL */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 1: What is your primary business goal?</h3>
                <p className="text-xs text-slate-500 mt-1">Select the option that best describes your intent.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "first business", title: "Start a New Business", desc: "First-time entrepreneur looking for a primary micro-enterprise." },
                  { id: "expand business", title: "Expand Existing Enterprise", desc: "Scale up your current unit with new product lines or machinery." },
                  { id: "additional income", title: "Find Additional Income", desc: "Part-time or seasonal micro-business to supplement household income." }
                ].map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setFormData({ ...formData, business_goal: g.id })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                      formData.business_goal === g.id
                        ? "bg-blue-50/50 border-blue-600 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900">{g.title}</span>
                      {formData.business_goal === g.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 2: What skills or experience do you have?</h3>
                <p className="text-xs text-slate-500 mt-1">Select all categories you have practical background or interest in.</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {SKILL_OPTIONS.map((skill) => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 3: What is your level of business experience?</h3>
                <p className="text-xs text-slate-500 mt-1">This helps us match manageable operational complexity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "no experience", title: "First-Time Entrepreneur (No Experience)", desc: "Requires simple operations, ready templates, and high guidance." },
                  { id: "some experience", title: "Some Experience (1–3 Years)", desc: "Familiar with local trade, purchasing, and basic accounting." },
                  { id: "experienced", title: "Experienced (3+ Years)", desc: "Capable of managing workforce, machinery, and credit relations." }
                ].map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setFormData({ ...formData, experience_level: exp.id })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                      formData.experience_level === exp.id
                        ? "bg-blue-50/50 border-blue-600 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900">{exp.title}</span>
                      {formData.experience_level === exp.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CAPITAL */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 4: Available Capital & Financing</h3>
                <p className="text-xs text-slate-500 mt-1">Specify how much capital you can invest and your funding requirements.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Select Available Personal Capital:</label>
                  <div className="flex flex-wrap gap-2">
                    {[50000, 100000, 150000, 200000, 500000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            available_capital: amt,
                            desired_loan_amount: Math.max(0, formData.expected_investment - amt)
                          })
                        }
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                          formData.available_capital === amt
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        ₹{(amt / 1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Available Capital (₹):</label>
                    <input
                      type="number"
                      value={formData.available_capital}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          available_capital: val,
                          desired_loan_amount: Math.max(0, formData.expected_investment - val)
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Total Investment (₹):</label>
                    <input
                      type="number"
                      value={formData.expected_investment}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          expected_investment: val,
                          desired_loan_amount: Math.max(0, val - formData.available_capital)
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-blue-900 block">Calculated Funding Gap:</span>
                    <span className="text-slate-600 text-[11px]">Suggested scheme loan requirement</span>
                  </div>
                  <span className="text-base font-black text-blue-700">₹{fundingGap.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LOCATION */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 5: Target Business Location</h3>
                <p className="text-xs text-slate-500 mt-1">We analyze demand, competition, and infrastructure in your specific village.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State:</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">District:</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Block / Mandal:</label>
                  <input
                    type="text"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Village / Gram Panchayat:</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">
                    Selected Location: {formData.village}, {formData.district}, {formData.state}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("GPS Location set to Kudair, Anantapur (14.6819° N, 77.4521° E)")}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-[11px] text-slate-700 hover:bg-slate-50"
                >
                  Use Current GPS
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: RESOURCES */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 6: Available Infrastructure & Resources</h3>
                <p className="text-xs text-slate-500 mt-1">Select existing assets to lower initial capital expenditure requirements.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RESOURCE_OPTIONS.map((res) => {
                  const isSelected = formData.interests.includes(res);
                  return (
                    <div
                      key={res}
                      onClick={() => toggleResource(res)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span>{res}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleNext}
              disabled={loading}
            >
              <span>{step === steps.length - 1 ? (loading ? "Analyzing Data..." : "DISCOVER MY OPPORTUNITIES →") : "Next Step"}</span>
              {step < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>

        </Card>

      </main>

      <CopilotDrawer />
      <Footer />
    </div>
  );
}
