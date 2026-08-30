import React from "react";
import { Calendar, CheckCircle2, Circle } from "lucide-react";

export interface TimelineStep {
  phase: string;
  timeframe: string;
  title: string;
  items: string[];
  status: "completed" | "in_progress" | "upcoming";
}

interface TimelineProps {
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  {
    phase: "Phase 1",
    timeframe: "Days 1–15",
    title: "Market Validation & Site Finalization",
    items: [
      "Validate local millet supply with Kudair farmers",
      "Finalize micro-processing unit lease location",
      "Identify machinery suppliers for de-huller & sealing unit"
    ],
    status: "in_progress"
  },
  {
    phase: "Phase 2",
    timeframe: "Days 16–30",
    title: "Finance & Scheme Application",
    items: [
      "Submit PMEGP subsidy application (35% rural subsidy)",
      "Open business bank account & FSSAI registration",
      "Obtain Gram Panchayat NOC"
    ],
    status: "upcoming"
  },
  {
    phase: "Phase 3",
    timeframe: "Days 31–60",
    title: "Procurement & Trial Operations",
    items: [
      "Procure millet processing equipment & packaging bags",
      "Execute electrical connection & trial milling run",
      "Establish retail shop distribution network in Anantapur"
    ],
    status: "upcoming"
  },
  {
    phase: "Phase 4",
    timeframe: "Days 61–90",
    title: "Official Commercial Launch",
    items: [
      "Commence commercial production & branded retail sales",
      "Monitor daily cash flow & break-even metrics",
      "Onboard 2 additional local rural workers"
    ],
    status: "upcoming"
  }
];

export const Timeline: React.FC<TimelineProps> = ({ steps = defaultSteps }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-base">
        <Calendar className="w-5 h-5 text-blue-600" />
        <span>90-Day Entrepreneurship Launch Plan</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <div
            key={step.phase}
            className={`p-5 rounded-2xl border transition-all ${
              step.status === "in_progress"
                ? "bg-blue-50/50 border-blue-200 shadow-sm"
                : "bg-white border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                {step.timeframe}
              </span>
              <span className="text-xs font-semibold text-slate-500">{step.phase}</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-3">{step.title}</h4>

            <ul className="space-y-2 text-xs text-slate-600">
              {step.items.map((item, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
