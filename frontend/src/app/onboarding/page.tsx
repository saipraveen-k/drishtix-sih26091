"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BusinessInterestInput } from "@/components/discovery/BusinessInterestInput";
import { api } from "@/lib/api";
import { ProfileData } from "@/types";
import dynamic from "next/dynamic";
import { MapPin, ArrowRight, ArrowLeft, Check, Sparkles, Navigation, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

const SKILL_OPTIONS = [
  "Agriculture",
  "Food Processing",
  "Livestock",
  "Handicraft",
  "Retail",
  "Manufacturing",
  "Services",
  "Digital",
  "Mechanical",
  "Construction",
  "Transport",
  "Hospitality",
  "Other"
];

const RESOURCE_OPTIONS = [
  "Land",
  "Shop",
  "Vehicle",
  "Equipment",
  "Electricity",
  "Internet",
  "Water",
  "Raw Materials",
  "Storage",
  "Existing Workforce"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    name: "Ramesh Kumar",
    age: 29,
    gender: "Male",
    language: "en",
    business_goal: "Start a new business",
    experience_level: "1–3 years",
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
    interests: ["Land", "Equipment", "Raw Materials"]
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const village = addr.village || addr.suburb || addr.town || addr.hamlet || addr.neighbourhood || formData.village;
        const block = addr.county || addr.state_district || addr.subdistrict || formData.block;
        const district = addr.state_district || addr.district || addr.county || formData.district;
        const state = addr.state || formData.state;
        const pincode = addr.postcode || formData.pincode;

        setFormData((prev) => ({
          ...prev,
          state,
          district,
          block,
          village,
          pincode: pincode || prev.pincode,
          latitude: lat,
          longitude: lng
        }));
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsFetchingLocation(true);
    setLocationError(null);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));

        await reverseGeocode(lat, lng);
        setIsFetchingLocation(false);
        setLocationSuccess(true);
      },
      (error) => {
        setIsFetchingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Please allow GPS access or click on the visual map below.");
        } else {
          setLocationError("Unable to fetch GPS location. You can select coordinates directly on the map.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    await reverseGeocode(lat, lng);
    setLocationSuccess(true);
  };

  const [interestedBusiness, setInterestedBusiness] = useState("Restaurant");
  const [businessScale, setBusinessScale] = useState("Small");
  const [businessReason, setBusinessReason] = useState("Personal interest");
  const [businessExp, setBusinessExp] = useState("Some experience");

  const steps = [
    "Goal",
    "Skills",
    "Experience",
    "Capital",
    "Location",
    "Resources",
    "Business Interest"
  ];

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
      if (typeof window !== "undefined") {
        localStorage.setItem("drishtix_user_profile", JSON.stringify(formData));
        localStorage.setItem("drishtix_interested_business", interestedBusiness);
      }
      router.push(`/discover?interest=${encodeURIComponent(interestedBusiness)}`);
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.setItem("drishtix_user_profile", JSON.stringify(formData));
        localStorage.setItem("drishtix_interested_business", interestedBusiness);
      }
      router.push(`/discover?interest=${encodeURIComponent(interestedBusiness)}`);
    } finally {
      setLoading(false);
    }
  };

  const fundingGap = Math.max(0, formData.expected_investment - formData.available_capital);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
            RuralBiz Entrepreneurship Onboarding • Team DrishtiX
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Business Profile &amp; Interest</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Tell RuralBiz what business you want to start. We evaluate its local feasibility and analyze better-suited micro-enterprises.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <Stepper steps={steps} currentStep={step} onStepClick={(s) => setStep(s)} />
        </div>

        {/* Form Wizard Step Cards */}
        <Card className="shadow-md">
          
          {/* SECTION 1: ABOUT YOU (GOAL) */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SECTION 1 — ABOUT YOU</h3>
                <p className="text-xs text-slate-500 mt-1">What is your primary entrepreneurial goal?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "Start a new business", title: "Start a New Business", desc: "First-time micro-enterprise creation as your primary income." },
                  { id: "Expand an existing business", title: "Expand an Existing Business", desc: "Scale up your operational unit with added machinery or lines." },
                  { id: "Find an additional income source", title: "Find Additional Income Source", desc: "Part-time or seasonal micro-business to supplement household income." }
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

          {/* SECTION 2: YOUR SKILLS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SECTION 2 — YOUR SKILLS</h3>
                <p className="text-xs text-slate-500 mt-1">Select all categories you have practical background or interest in (multiple selections allowed).</p>
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
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
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

          {/* SECTION 3: EXPERIENCE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SECTION 3 — EXPERIENCE</h3>
                <p className="text-xs text-slate-500 mt-1">Select your duration of operational experience.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "No experience", title: "No Experience", desc: "First-time entrepreneur; requiring operational templates and high guidance." },
                  { id: "Less than 1 year", title: "Less than 1 year", desc: "Basic exposure to trade, customer interactions, or family shop." },
                  { id: "1–3 years", title: "1–3 years", desc: "Familiar with local purchasing, operational management, and accounting." },
                  { id: "3+ years", title: "3+ years", desc: "Experienced in managing workforce, machinery, credit, and supply chains." }
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

          {/* SECTION 4: CAPITAL */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SECTION 4 — CAPITAL</h3>
                <p className="text-xs text-slate-500 mt-1">Specify your available equity capital and target investment budget.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Suggested Equity Capital Amounts:</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "₹50,000", val: 50000 },
                      { label: "₹1 Lakh", val: 100000 },
                      { label: "₹2 Lakh", val: 200000 },
                      { label: "₹5 Lakh", val: 500000 },
                      { label: "₹10 Lakh+", val: 1000000 }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            available_capital: item.val,
                            desired_loan_amount: Math.max(0, formData.expected_investment - item.val)
                          })
                        }
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                          formData.available_capital === item.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Available Capital (₹ Custom):</label>
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
                    <span className="font-bold text-blue-900 block">Calculated Loan / Scheme Funding Gap:</span>
                    <span className="text-slate-600 text-[11px]">Recommended PMEGP / MUDRA scheme support</span>
                  </div>
                  <span className="text-base font-black text-blue-700">₹{fundingGap.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: LOCATION */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">SECTION 5 — LOCATION</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Specify state, district, block, and village or auto-detect via GPS for hyper-local intelligence.</p>
                </div>
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={isFetchingLocation}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-60 shrink-0 cursor-pointer"
                >
                  {isFetchingLocation ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Navigation className="w-4 h-4 text-white" />
                  )}
                  <span>{isFetchingLocation ? "Fetching GPS Location..." : "Fetch Current Location (GPS)"}</span>
                </button>
              </div>

              {/* Status Alert Banners */}
              {locationSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Location successfully fetched &amp; mapped to <strong>{formData.village}, {formData.district}</strong>!</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {(formData.latitude ?? 14.6819).toFixed(4)}° N, {(formData.longitude ?? 77.4521).toFixed(4)}° E
                  </span>
                </div>
              )}

              {locationError && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}

              {/* Location Input Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State:</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">District:</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Block / Mandal:</label>
                  <input
                    type="text"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Village / Gram Panchayat:</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Visual Interactive Map Preview */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Visual Location Map Verification</h4>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Click anywhere on the map to re-position pin
                  </span>
                </div>

                <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                  <MapComponent
                    lat={formData.latitude}
                    lng={formData.longitude}
                    locationName={`${formData.village || formData.block}, ${formData.district}`}
                    zoom={13}
                    onLocationSelect={handleMapLocationSelect}
                    height="h-[320px]"
                  />
                </div>

                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-semibold text-slate-800">
                      Current Target Hub: {formData.village}, {formData.block}, {formData.district}, {formData.state}
                    </span>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 font-bold">
                    <span>GPS: {(formData.latitude ?? 14.6819).toFixed(4)}° N, {(formData.longitude ?? 77.4521).toFixed(4)}° E</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: AVAILABLE RESOURCES */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SECTION 6 — AVAILABLE RESOURCES</h3>
                <p className="text-xs text-slate-500 mt-1">Select existing assets to lower initial capital expenditure requirements (multiple allowed).</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

          {/* SECTION 7: BUSINESS INTEREST */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SECTION 7 — BUSINESS INTEREST</h3>
                <p className="text-xs text-slate-500 mt-1">Tell RuralBiz what business you would like to start.</p>
              </div>

              <BusinessInterestInput
                value={interestedBusiness}
                onChange={(val) => setInterestedBusiness(val)}
                scale={businessScale}
                onScaleChange={(s) => setBusinessScale(s)}
                reason={businessReason}
                onReasonChange={(r) => setBusinessReason(r)}
                experience={businessExp}
                onExperienceChange={(e) => setBusinessExp(e)}
              />
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
              <span>
                {step === steps.length - 1
                  ? loading
                    ? "Evaluating Interest & Alternatives..."
                    : "EVALUATE MY BUSINESS INTEREST →"
                  : "Next Step"}
              </span>
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
