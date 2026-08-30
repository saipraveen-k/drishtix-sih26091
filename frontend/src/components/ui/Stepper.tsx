import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((label, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={label}
              onClick={() => onStepClick && idx <= currentStep && onStepClick(idx)}
              className={`relative z-10 flex flex-col items-center group ${
                onStepClick && idx <= currentStep ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : isCurrent
                    ? "bg-white text-blue-600 border-2 border-blue-600 shadow-md"
                    : "bg-slate-100 text-slate-400 border border-slate-300"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold hidden sm:block ${
                  isCurrent ? "text-blue-900 font-bold" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
