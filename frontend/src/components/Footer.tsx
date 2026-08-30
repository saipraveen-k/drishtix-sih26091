import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                DX
              </div>
              <span className="font-bold text-white tracking-wider">DRISHTIX</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs. Built for Smart India Hackathon 2026 (Problem Statement SIH26091).
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-lg max-w-md">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                <strong>Trust & Verification Principle:</strong> Financial metrics are computed via deterministic Python backend formulas. Scheme matching lists potentially relevant options; final eligibility is determined by concerned government authorities.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Core Engine</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/opportunities" className="hover:text-emerald-400">Opportunity Discovery</Link></li>
              <li><Link href="/location" className="hover:text-emerald-400">Location Intelligence</Link></li>
              <li><Link href="/schemes" className="hover:text-emerald-400">Scheme Matching</Link></li>
              <li><Link href="/business-plan" className="hover:text-emerald-400">Business Plan Engine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">SIH 2026 Metadata</h4>
            <ul className="space-y-2 text-xs">
              <li>Problem Code: <strong>SIH26091</strong></li>
              <li>Domain: Rural Micro-Entrepreneurship</li>
              <li>Data Mode: <span className="text-emerald-400 font-medium">Dataset-Agnostic Ready</span></li>
              <li><Link href="/admin" className="hover:text-emerald-400 text-slate-300">Data Validation Report</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 DrishtiX Intelligence Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="/copilot" className="hover:text-slate-400">AI Copilot</Link>
            <Link href="/admin" className="hover:text-slate-400">System Metrics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
