"use client";

import { useState } from "react";
import { Search, Check, ChevronDown, ChevronUp } from "lucide-react";

interface BusinessInterestInputProps {
  value: string;
  onChange: (val: string) => void;
  scale?: string;
  onScaleChange?: (val: string) => void;
  reason?: string;
  onReasonChange?: (val: string) => void;
  experience?: string;
  onExperienceChange?: (val: string) => void;
}

const POPULAR_CHIPS = [
  { label: "🌾 Agriculture", text: "Agriculture & Farming" },
  { label: "🍲 Food Processing", text: "Millet Processing" },
  { label: "🐄 Dairy Farming", text: "Dairy Processing" },
  { label: "🧵 Tailoring", text: "Tailoring & Garments" },
  { label: "🔧 Repair Kiosk", text: "Mobile Repair" },
  { label: "🛍 Retail Store", text: "Retail Kirana Store" },
  { label: "💻 Digital Services", text: "Digital CSC Center" },
  { label: "🍽 Restaurant", text: "Restaurant & Tiffin Center" }
];

export function BusinessInterestInput({
  value,
  onChange,
  scale = "Small",
  onScaleChange,
  reason = "Personal interest",
  onReasonChange,
  experience = "None",
  onExperienceChange
}: BusinessInterestInputProps) {
  const [showOptional, setShowOptional] = useState(false);

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div>
        <label className="block text-sm font-extrabold text-slate-900 mb-1">
          What business are you interested in? <span className="text-blue-600">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Tell DrishtiX what you would like to start. We&apos;ll evaluate how suitable it is for your profile and location, and show better alternatives if they exist.
        </p>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="🔎 Search or enter a business (e.g. Restaurant, Millet Processing, Tailoring...)"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400 placeholder:font-medium"
          />
        </div>
      </div>

      {/* Popular Chips */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Popular Business Categories:
        </span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CHIPS.map((chip) => {
            const isSelected = value.toLowerCase() === chip.text.toLowerCase();
            return (
              <button
                key={chip.text}
                type="button"
                onClick={() => onChange(chip.text)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <span>{chip.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Business Details Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
        >
          <span>{showOptional ? "Hide optional business preferences" : "+ Add optional business details (scale, experience, reason)"}</span>
          {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showOptional && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Scale:</label>
              <select
                value={scale}
                onChange={(e) => onScaleChange?.(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="Small">Micro / Small (₹50k - ₹2L)</option>
                <option value="Medium">Medium (₹2L - ₹5L)</option>
                <option value="Large">Large / Enterprise (₹5L+)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Existing Experience:</label>
              <select
                value={experience}
                onChange={(e) => onExperienceChange?.(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="None">None (First Time)</option>
                <option value="Some experience">Some Experience</option>
                <option value="Experienced">Experienced (3+ Years)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Why Interested?</label>
              <select
                value={reason}
                onChange={(e) => onReasonChange?.(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="Personal interest">Personal Interest</option>
                <option value="Family business">Family Background</option>
                <option value="Local demand">Observed Local Demand</option>
                <option value="Existing skills">Existing Skills</option>
                <option value="Income opportunity">Higher Income Opportunity</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
