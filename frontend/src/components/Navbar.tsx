"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, MapPin, BarChart3, ShieldCheck, FileText, Bot, Settings, Database } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/opportunities", label: "Opportunities", icon: Compass },
    { href: "/location", label: "Location Map", icon: MapPin },
    { href: "/schemes", label: "Schemes & Readiness", icon: ShieldCheck },
    { href: "/business-plan", label: "Business Plan", icon: FileText },
    { href: "/copilot", label: "AI Copilot", icon: Bot },
    { href: "/admin", label: "Data Inspector", icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & SIH Tag */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-emerald-500/20">
                DX
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wider text-white">DRISHTIX</span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">Hyper-Local Business Intelligence</span>
              </div>
            </Link>
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SIH 2026 • SIH26091
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Demo Badge */}
          <div className="flex items-center space-x-3">
            <Link
              href="/onboarding"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>Entrepreneur Profile</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
