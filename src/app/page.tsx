"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  ShoppingBag,
  Share2,
  Bell,
  ArrowRight,
  Lock,
  Database,
  CheckCircle2,
  Activity,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { records, medications } = useStore();

  const coreFeatures = [
    {
      title: "Encrypted Health Vault",
      description: "Store lab reports, scan DICOMs, and prescriptions with patient-controlled encryption and Supabase Private Storage.",
      icon: FileText,
      href: "/records",
      badge: "Private Storage",
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "AI Report Analyzer",
      description: "Extract complex biomarkers, reference ranges, and plain-English medical summaries from raw clinical lab PDFs instantly.",
      icon: Sparkles,
      href: "/analyzer",
      badge: "Clinical NLP",
      color: "from-teal-600 to-emerald-600",
    },
    {
      title: "Verified Medicine Store",
      description: "Order prescription refills and home diagnostic kits with pharmacist review and doorstep delivery tracking.",
      icon: ShoppingBag,
      href: "/pharmacy",
      badge: "Rx Dispensary",
      color: "from-indigo-600 to-teal-600",
    },
    {
      title: "Smart Medication Reminders",
      description: "Never miss a dose. Track daily regimens across morning, afternoon, and evening slots with adherence metrics.",
      icon: Bell,
      href: "/reminders",
      badge: "Adherence Log",
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "Granular Doctor Sharing",
      description: "Generate time-limited, PIN-protected access links for specialists and clinics. Revoke access with a single click.",
      icon: Share2,
      href: "/sharing",
      badge: "Zero-Trust Sharing",
      color: "from-slate-700 to-slate-900",
    },
    {
      title: "MedVault AI Assistant",
      description: "Ask questions about drug interactions, dietary adjustments for your biomarkers, and prep questions for your doctor.",
      icon: Stethoscope,
      href: "/assistant",
      badge: "Clinical Assistant",
      color: "from-teal-600 to-blue-700",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 hero-glow border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Next-Gen Healthcare SaaS • Zero-Trust Patient Privacy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your Health Records. <br />
                <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 bg-clip-text text-transparent">
                  Intelligently Decoded.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                MedVault unites encrypted medical record storage, automated AI lab biomarker analysis, verified prescription dispensary, and time-expiring doctor access sharing in one unified clinical platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>Launch Patient Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/analyzer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-all"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Try AI Lab Analyzer</span>
                </Link>

                <Link
                  href="/admin"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  <Database className="w-4 h-4 text-slate-400" />
                  <span>Setup Guide</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Supabase Private Storage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>PostgreSQL Row-Level Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>HIPAA-Architecture Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-75" />

                <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
                  {/* Top Bar of Mock Card */}
                  <div className="px-5 py-4 bg-[#0a192f] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold leading-tight">Patient Clinical Overview</h2>
                        <p className="text-[10px] text-slate-400">Sarah Jenkins • Blood A+ • ID: pt-88291</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-900/60 text-teal-300 border border-teal-700/50">
                      Live Simulation
                    </span>
                  </div>

                  {/* Body of Mock Card */}
                  <div className="p-5 space-y-4 text-xs">
                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">Blood Pressure</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-base font-bold text-slate-900">118/76</span>
                          <span className="text-[10px] text-slate-500">mmHg</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Optimal
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">Total Cholesterol</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-base font-bold text-amber-600">215</span>
                          <span className="text-[10px] text-slate-500">mg/dL</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          Borderline
                        </span>
                      </div>
                    </div>

                    {/* Latest Document */}
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">
                              Comprehensive Metabolic Panel & Lipid Profile
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Metro Central Diagnostics • Dr. Rostova
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/analyzer"
                          className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-semibold shrink-0 transition-colors"
                        >
                          Analyze
                        </Link>
                      </div>
                    </div>

                    {/* Today's Schedule Snapshot */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Today&apos;s Medications ({medications.length})</span>
                        <Link href="/reminders" className="text-teal-600 hover:underline">
                          View Schedule →
                        </Link>
                      </div>
                      <div className="space-y-1.5">
                        {medications.slice(0, 2).map((med) => (
                          <div
                            key={med.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${med.isTakenToday ? "bg-emerald-500" : "bg-amber-400"}`} />
                              <span className="font-medium text-slate-800">{med.name} {med.dosage}</span>
                            </div>
                            <span className="text-slate-500">{med.timeOfDay.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Shortcut */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Demo Records Available: {records.length} files</span>
                      <Link
                        href="/dashboard"
                        className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                      >
                        Enter Patient Portal <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Integrated Clinical Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Complete Platform for Patient Autonomy
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              From automated lab extraction to dispensary fulfillment and revocable clinical sharing, MedVault puts patients in control of their health data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group relative rounded-2xl p-6 bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-900 to-teal-800 flex items-center justify-center text-teal-300 shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        {feature.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-800 gap-1">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Infrastructure Breakdown */}
      <section className="py-16 md:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/50 text-teal-300 border border-teal-700/60 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Trust Security Posture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Designed for Strict Compliance & Data Isolation
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Traditional healthcare portals lock records behind proprietary hospital silos. MedVault leverages modern PostgreSQL Row-Level Security and private object storage to ensure nobody can access your medical records without your cryptographically verified permission.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors shadow-md"
                >
                  <Database className="w-4 h-4" />
                  <span>View Database Schema & Setup Guide</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Supabase PostgreSQL RLS</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every query is scoped strictly to <code className="text-teal-300">auth.uid()</code>. Cross-tenant leakage is prevented at the database kernel level.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Private Storage Buckets</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Medical PDFs, scans, and imaging are stored in private non-public buckets with time-limited signed download URLs.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Expiring Caregiver Passes</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Share reports with doctors using self-destructing links, PIN verification, and real-time audit logs of every view.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Transparent AI Boundaries</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI insights are clearly labelled with confidence tags and medical review reminders. No hallucinations disguised as diagnoses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-14 bg-teal-50 border-t border-teal-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to test your clinical records platform?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Explore with preloaded mock records, simulated pharmacy orders, and biomarker analysis. When ready, link your Supabase instance in under 3 minutes.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Enter Patient Dashboard
            </Link>
            <Link
              href="/records"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs transition-colors"
            >
              Browse Medical Vault
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
