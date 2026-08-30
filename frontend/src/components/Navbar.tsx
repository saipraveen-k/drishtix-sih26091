"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  MapPin,
  TrendingUp,
  Calculator,
  Award,
  FileText,
  User,
  Mic,
  Globe,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Layers
} from "lucide-react";
import { Language, getTranslation } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>("en");
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = getTranslation(lang);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md shadow-slate-900/10 group-hover:bg-blue-600 transition-colors">
              DX
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                  DrishtiX
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                  SIH26091
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block">
                Hyper-Local Entrepreneurship Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-semibold text-slate-700">
            
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/") ? "bg-slate-100 text-slate-900 font-bold" : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {t.nav_home}
            </Link>

            {/* Discover Dropdown */}
            <div className="relative" onMouseLeave={() => setDiscoverOpen(false)}>
              <button
                onMouseEnter={() => setDiscoverOpen(true)}
                onClick={() => setDiscoverOpen(!discoverOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname.startsWith("/opportunities") || pathname.startsWith("/location")
                    ? "bg-slate-100 text-slate-900 font-bold"
                    : "hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{t.nav_discover}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {discoverOpen && (
                <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 space-y-1 z-50">
                  <Link
                    href="/opportunities"
                    className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>{t.nav_opportunities}</span>
                  </Link>
                  <Link
                    href="/location"
                    className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{t.nav_map}</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>{t.nav_market}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Finance Dropdown */}
            <div className="relative" onMouseLeave={() => setFinanceOpen(false)}>
              <button
                onMouseEnter={() => setFinanceOpen(true)}
                onClick={() => setFinanceOpen(!financeOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname.startsWith("/finance") || pathname.startsWith("/schemes") || pathname.startsWith("/simulation")
                    ? "bg-slate-100 text-slate-900 font-bold"
                    : "hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{t.nav_finance}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {financeOpen && (
                <div className="absolute top-full left-0 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-2 space-y-1 z-50">
                  <Link
                    href="/finance/biz_millet_01"
                    className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <span>{t.nav_simulator}</span>
                  </Link>
                  <Link
                    href="/schemes"
                    className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>{t.nav_schemes}</span>
                  </Link>
                  <Link
                    href="/schemes#readiness"
                    className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>{t.nav_readiness}</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/business-plan"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/business-plan") ? "bg-slate-100 text-slate-900 font-bold" : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {t.nav_plan}
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/dashboard") ? "bg-slate-100 text-slate-900 font-bold" : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {t.nav_journey}
            </Link>

          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* SIH Demo Mode Badge */}
            <div className="flex items-center space-x-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>SIH Demo Mode</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              {(["en", "hi", "te"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded transition-all uppercase ${
                    lang === l ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Voice Assistant Button */}
            <button
              onClick={() => {
                const event = new CustomEvent("open-copilot-drawer");
                window.dispatchEvent(event);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 transition-all"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{t.ask_copilot_btn}</span>
            </button>

            {/* Profile Link */}
            <Link
              href="/profile"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Entrepreneur Profile"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 font-medium text-sm">
          <Link href="/" className="block py-1.5 text-slate-900 font-semibold" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_home}
          </Link>
          <Link href="/opportunities" className="block py-1.5 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_opportunities}
          </Link>
          <Link href="/location" className="block py-1.5 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_map}
          </Link>
          <Link href="/finance/biz_millet_01" className="block py-1.5 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_simulator}
          </Link>
          <Link href="/schemes" className="block py-1.5 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_schemes}
          </Link>
          <Link href="/business-plan" className="block py-1.5 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_plan}
          </Link>
          <Link href="/dashboard" className="block py-1.5 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
            {t.nav_journey}
          </Link>
        </div>
      )}
    </header>
  );
}
