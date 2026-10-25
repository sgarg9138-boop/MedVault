"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  Bell,
  Share2,
  ShieldCheck,
  Menu,
  X,
  Database,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/lib/store";

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, isSupabaseConnected } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Activity },
    { name: "Records Vault", href: "/records", icon: FileText },
    { name: "AI Analyzer", href: "/analyzer", icon: Sparkles },
    { name: "MedVault AI", href: "/assistant", icon: MessageSquare },
    { name: "Pharmacy", href: "/pharmacy", icon: ShoppingBag },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Sharing", href: "/sharing", icon: Share2 },
    { name: "Admin Setup", href: "/admin", icon: ShieldCheck },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a192f] via-[#0d9488] to-[#14b8a6] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0a192f] rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-teal-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                    Med<span className="text-teal-600">Vault</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200">
                      SaaS
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium leading-tight">
                    Clinical Record Vault & AI
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden xl:flex items-center space-x-1 ml-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? "bg-teal-50 text-teal-800 shadow-xs border border-teal-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? "text-teal-600" : "text-slate-400"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Icons & Actions */}
            <div className="flex items-center gap-2.5">
              {/* Environment Status Badge */}
              <button
                onClick={() => setStatusModalOpen(true)}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                  isSupabaseConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                }`}
                title="View Environment Status"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isSupabaseConnected ? "Cloud Sync (Supabase)" : "Demo Mode (Mock DB)"}</span>
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Shortcut */}
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  SJ
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">Sarah J.</span>
                  <span className="text-[10px] text-slate-500 leading-none">Patient (Demo)</span>
                </div>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  SJ
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sarah Jenkins (Demo Patient)</p>
                  <p className="text-[11px] text-slate-500">Apex Health Plan • Blood A+</p>
                </div>
              </div>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold"
              >
                {isSupabaseConnected ? "Connected" : "Demo Mode"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      active
                        ? "bg-teal-50 text-teal-800 border border-teal-200 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-teal-600" : "text-slate-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                View Patient Profile
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                Pharmacy Cart ({cartCount})
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Connection Status Dialog */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <Database className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">System Backend Status</h3>
              </div>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80">
                <p className="font-semibold text-amber-900 mb-1">
                  {isSupabaseConnected ? "Cloud Sync Active" : "Interactive Demo Mode Active"}
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  {isSupabaseConnected
                    ? "Supabase Auth and PostgreSQL client are configured and active."
                    : "MedVault is currently operating in local interactive demo mode. All actions (adding to cart, uploading records, updating reminders) are functional and persist in your browser session."}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Database Engine</span>
                  <span className="font-medium text-slate-800">
                    {isSupabaseConnected ? "Supabase PostgreSQL (Active)" : "Browser Mock State Engine"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Medical Storage Vault</span>
                  <span className="font-medium text-slate-800">
                    {isSupabaseConnected ? "Private Bucket (S3/Supabase)" : "Client Vault Storage"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">AI Clinical Engine</span>
                  <span className="font-medium text-slate-800">Deterministic Clinical Engine</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Link
                href="/admin"
                onClick={() => setStatusModalOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <span>Open Admin Setup Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
