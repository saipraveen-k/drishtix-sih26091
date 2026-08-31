"use client";

import Link from "next/link";
import { Check } from "lucide-react";

interface BusinessJourneyStepperProps {
  currentStepIndex: number; // 0 to 7
  activeBusinessId?: string;
  activeBusinessName?: string;
}

const JOURNEY_STEPS = [
  { label: "Interest Analysis", href: "/discover" },
  { label: "Opportunity Details", href: "/opportunities" },
  { label: "Financial Twin", href: "/finance" },
  { label: "Stress Test", href: "/simulation" },
  { label: "Schemes", href: "/schemes" },
  { label: "Readiness", href: "/readiness" },
  { label: "Business Plan (DPR)", href: "/business-plan" },
  { label: "90-Day Roadmap", href: "/dashboard" }
];

export function BusinessJourneyStepper({ currentStepIndex, activeBusinessId }: BusinessJourneyStepperProps) {
  const getHref = (step: typeof JOURNEY_STEPS[0], idx: number) => {
    if (idx === 1 && activeBusinessId) return `/opportunities/${activeBusinessId}`;
    if (idx === 2 && activeBusinessId) return `/finance/${activeBusinessId}`;
    return step.href;
  };

  return (
    <div className="w-full bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px]">
        {JOURNEY_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.label} className="flex items-center space-x-2 flex-1">
              <Link
                href={getHref(step, idx)}
                className={`flex items-center space-x-2 text-xs font-extrabold transition-colors group ${
                  isCurrent
                    ? "text-blue-700 font-black"
                    : isDone
                    ? "text-emerald-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-xs"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
              </Link>

              {idx < JOURNEY_STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-1 bg-slate-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
