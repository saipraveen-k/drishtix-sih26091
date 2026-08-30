import Link from "next/link";
import { Shield, Database, Award, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs">
                DX
              </div>
              <span>DrishtiX</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Hyper-Local Entrepreneurship Decision Intelligence Platform. Designed for rural and semi-urban micro-entrepreneurs.
            </p>
            <div className="inline-flex items-center space-x-1.5 bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono">
              <span>SIH26091 • Smart India Hackathon 2026</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Core Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/onboarding" className="hover:text-white transition-colors">Reverse Opportunity Search</Link></li>
              <li><Link href="/location" className="hover:text-white transition-colors">Hyper-Local GIS Map</Link></li>
              <li><Link href="/finance/biz_millet_01" className="hover:text-white transition-colors">Business Survival Simulator</Link></li>
              <li><Link href="/schemes" className="hover:text-white transition-colors">Government Scheme Matcher</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Governance & Trust</h4>
            <ul className="space-y-2">
              <li><Link href="/admin" className="hover:text-white transition-colors">Data Quality Inspector</Link></li>
              <li><Link href="/business-plan" className="hover:text-white transition-colors">20-Section DPR Generator</Link></li>
              <li><span className="text-slate-500">Deterministic Engine: LLM ≠ Decision Engine</span></li>
              <li><span className="text-slate-500">Census & District Survey 2026 Compatible</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Accessibility</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multilingual: EN | HI | TE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Offline & Keyless Fallback Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ministry / Bank Scheme Integrated</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 DrishtiX Decision Engine. Built for SIH26091.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Powered by</span>
            <span className="text-slate-300 font-semibold">Deterministic Math + FAISS RAG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
