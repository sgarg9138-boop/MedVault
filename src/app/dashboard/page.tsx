"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Heart,
  Droplets,
  TrendingUp,
  FileText,
  Sparkles,
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const {
    patient,
    records,
    medications,
    toggleMedicationTaken,
    orders,
    shareLinks,
    setActiveAnalyzerRecord,
  } = useStore();

  const activeShares = shareLinks.filter((s) => s.isActive);
  const recentOrders = orders.slice(0, 2);
  const recentRecords = records.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Header Card */}
      <div className="p-6 rounded-2xl navy-gradient text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold text-2xl shadow-inner">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {patient.fullName}
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700/60">
                  Demo Patient Record
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                DOB: {patient.dob} • Gender: {patient.gender} • Blood Group:{" "}
                <span className="font-bold text-teal-300">{patient.bloodGroup}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Primary Physician: {patient.primaryPhysician.name} ({patient.primaryPhysician.hospital})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/records"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Record</span>
            </Link>
            <Link
              href="/sharing"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Doctor Passes ({activeShares.length})</span>
            </Link>
          </div>
        </div>

        {/* Clinical Alert Pill */}
        <div className="mt-5 pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Documented Allergies:
            </span>
            <span>{patient.allergies.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Emergency Contact:</span>
            <span className="font-medium text-slate-200">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
          </div>
        </div>
      </div>

      {/* Health Vitals Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Blood Pressure</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">118/76</span>
              <span className="text-xs text-slate-500 font-medium">mmHg</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimal
              </span>
              <span className="text-[11px] text-slate-400">Logged 2d ago</span>
            </div>
          </div>
        </div>

        {/* Resting Heart Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Resting Heart Rate</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">72</span>
              <span className="text-xs text-slate-500 font-medium">bpm</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Normal Rhythm
              </span>
              <span className="text-[11px] text-slate-400">Resting baseline</span>
            </div>
          </div>
        </div>

        {/* Fasting Glucose */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fasting Glucose</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">92</span>
              <span className="text-xs text-slate-500 font-medium">mg/dL</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimal Glycemic
              </span>
              <span className="text-[11px] text-slate-400">Lab CMP panel</span>
            </div>
          </div>
        </div>

        {/* Total Cholesterol */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Cholesterol</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-amber-600">215</span>
              <span className="text-xs text-slate-500 font-medium">mg/dL</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Borderline (Target: &lt;200)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Records & AI Analyzer Trigger */}
        <div className="lg:col-span-7 space-y-6">
          {/* Records Vault Snapshot */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Recent Medical Records ({records.length})
                </h2>
              </div>
              <Link
                href="/records"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                View all vault records <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100/70 text-teal-800 border border-teal-200">
                        {record.category}
                      </span>
                      <span className="text-xs text-slate-400">• {record.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{record.title}</h3>
                    <p className="text-xs text-slate-500">
                      {record.facility} • {record.doctorName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href="/analyzer"
                      onClick={() => setActiveAnalyzerRecord(record)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>AI Analyze</span>
                    </Link>
                    <Link
                      href="/records"
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 via-cyan-50 to-white border border-teal-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    AI Clinical Synthesis (Simulated)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Based on your latest Lipid & Metabolic panel
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Informational Only
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Your recent bloodwork shows excellent glycemic stability (Fasting Glucose: 92 mg/dL) and robust kidney function. Total cholesterol is mildly elevated at 215 mg/dL with LDL at 132 mg/dL. Consider discussing lifestyle or statin therapy adjustments with Dr. Rostova.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                href="/analyzer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Open Full Biomarker Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/assistant"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors"
              >
                <span>Ask MedVault AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Medication & Orders */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Medications Checklist */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Today&apos;s Medication Regimen
                </h2>
              </div>
              <Link
                href="/reminders"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Manage Schedule →
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Check off your doses as you take them today. Your adherence history updates automatically.
            </p>

            <div className="space-y-2.5">
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => toggleMedicationTaken(med.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    med.isTakenToday
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                      : "bg-slate-50 border-slate-200 hover:border-teal-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        med.isTakenToday
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                      aria-label={`Mark ${med.name} as ${med.isTakenToday ? "pending" : "taken"}`}
                    >
                      {med.isTakenToday && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className={`text-xs font-bold ${med.isTakenToday ? "line-through text-slate-400" : ""}`}>
                        {med.name} {med.dosage}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {med.timeOfDay.join(", ")} • {med.instructions}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/80 border border-slate-200 shrink-0">
                    {med.remainingRefills} refills left
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/pharmacy"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <span>Refill Prescriptions in Pharmacy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pharmacy Orders Snapshot */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Pharmacy Orders ({orders.length})
                </h3>
              </div>
              <Link
                href="/orders"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                All orders →
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{order.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")}
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-200/60">
                    <span>Total: ${order.total.toFixed(2)}</span>
                    <span className="text-teal-700 font-medium">{order.estimatedDelivery}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
