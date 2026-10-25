import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, HeartPulse, FileCheck, AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a192f] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Med<span className="text-teal-400">Vault</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation clinical record vault, automated lab report extraction, and smart dispensary platform engineered for patient privacy, granular caregiver sharing, and continuous health intelligence.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-teal-400 text-[11px] font-medium border border-slate-700">
                <Lock className="w-3 h-3" /> Supabase Storage (Private)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-teal-400 text-[11px] font-medium border border-slate-700">
                <FileCheck className="w-3 h-3" /> HIPAA Compatible RLS
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-teal-400 text-[11px] font-medium border border-slate-700">
                <HeartPulse className="w-3 h-3" /> AI Biomarker Extraction
              </span>
            </div>
          </div>

          {/* Quick Links: Vault & AI */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Clinical Vault
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                  Patient Health Dashboard
                </Link>
              </li>
              <li>
                <Link href="/records" className="hover:text-teal-400 transition-colors">
                  Encrypted Document Vault
                </Link>
              </li>
              <li>
                <Link href="/analyzer" className="hover:text-teal-400 transition-colors">
                  AI Lab Report Analyzer
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-teal-400 transition-colors">
                  MedVault AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Pharmacy & Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Care & Pharmacy
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/pharmacy" className="hover:text-teal-400 transition-colors">
                  Medicine Store & Refills
                </Link>
              </li>
              <li>
                <Link href="/reminders" className="hover:text-teal-400 transition-colors">
                  Medication Reminders
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-teal-400 transition-colors">
                  Orders & Tracking
                </Link>
              </li>
              <li>
                <Link href="/sharing" className="hover:text-teal-400 transition-colors">
                  Doctor Access Sharing
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Platform & Setup
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors">
                  Supabase & Backend Setup
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-teal-400 transition-colors">
                  Patient Profile & Records
                </Link>
              </li>
              <li>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-400 transition-colors"
                >
                  Supabase Documentation ↗
                </a>
              </li>
              <li>
                <span className="text-slate-500">Version 1.0.0 (Release)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical & Emergency Disclaimer Banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              Medical Disclaimer & Emergency Notice
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              MedVault is a personal health information management system. It does not provide medical diagnosis, treatment, or clinical prescriptions. If you are experiencing a medical emergency, call 911 or your local emergency services immediately.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MedVault Inc. All rights reserved. Zero-Knowledge Private Storage Architecture.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
