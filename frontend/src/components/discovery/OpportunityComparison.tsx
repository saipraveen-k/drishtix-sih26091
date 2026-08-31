"use client";

import { ComparisonFactorItem } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface OpportunityComparisonProps {
  userChoiceName: string;
  userChoiceScore: number;
  bestAltName: string;
  bestAltScore: number;
  factors: ComparisonFactorItem[];
}

export function OpportunityComparison({
  userChoiceName,
  userChoiceScore,
  bestAltName,
  bestAltScore,
  factors
}: OpportunityComparisonProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">How does your choice compare?</h3>
          <p className="text-xs text-slate-500">
            Side-by-side 7-factor evaluation comparing your entered business against the highest-scoring alternative.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-extrabold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span>
            <span>Your Choice: {userChoiceScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-blue-700">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span>Best Alternative: {bestAltScore.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <th className="py-3 px-4 font-extrabold">Evaluation Factor</th>
              <th className="py-3 px-4 font-extrabold text-slate-900 w-1/3">
                Your Choice ({userChoiceName})
              </th>
              <th className="py-3 px-4 font-extrabold text-blue-800 w-1/3">
                Best Alternative ({bestAltName})
              </th>
              <th className="py-3 px-4 font-extrabold text-center">Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {factors.map((item) => {
              const delta = item.best_alt_score - item.user_choice_score;
              const isAltBetter = delta > 0.5;

              return (
                <tr key={item.factor_key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-800">{item.label}</td>
                  
                  {/* Your Choice Score & Bar */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                        <span>{item.user_choice_score.toFixed(1)}</span>
                      </div>
                      <ProgressBar value={item.user_choice_score} variant="info" size="sm" showLabel={false} />
                    </div>
                  </td>

                  {/* Best Alt Score & Bar */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold text-blue-700">
                        <span>{item.best_alt_score.toFixed(1)}</span>
                      </div>
                      <ProgressBar value={item.best_alt_score} variant="success" size="sm" showLabel={false} />
                    </div>
                  </td>

                  {/* Delta / Advantage */}
                  <td className="py-3 px-4 text-center font-bold">
                    {isAltBetter ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +{delta.toFixed(1)} Alt
                      </span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Match
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
