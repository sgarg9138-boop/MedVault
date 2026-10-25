"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Activity,
  Layers,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Biomarker } from "@/lib/types";

export default function AnalyzerPage() {
  const { records, activeAnalyzerRecord, setActiveAnalyzerRecord } = useStore();
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"biomarkers" | "summary" | "questions">("biomarkers");

  // Fallback preset demo data if current record has no parsed biomarkers
  const defaultBiomarkers: Biomarker[] = activeAnalyzerRecord?.biomarkers || [
    { name: "Total Cholesterol", value: "215", unit: "mg/dL", referenceRange: "< 200", status: "borderline", clinicalNote: "Mild elevation. Correlate with lifestyle and dietary saturated fats." },
    { name: "LDL Cholesterol", value: "132", unit: "mg/dL", referenceRange: "< 100", status: "borderline", clinicalNote: "Sub-optimal; target <100 for standard cardiovascular baseline." },
    { name: "HDL Cholesterol", value: "58", unit: "mg/dL", referenceRange: "> 50", status: "normal", clinicalNote: "Favorable high-density lipoprotein levels." },
    { name: "Fasting Blood Glucose", value: "92", unit: "mg/dL", referenceRange: "70 - 99", status: "normal", clinicalNote: "Normoglycemic; no evidence of insulin resistance." },
    { name: "Serum Creatinine", value: "0.82", unit: "mg/dL", referenceRange: "0.60 - 1.10", status: "normal", clinicalNote: "Normal glomerular clearance." },
    { name: "eGFR (MDRD)", value: "> 90", unit: "mL/min/1.73m²", referenceRange: "> 60", status: "normal", clinicalNote: "Preserved renal filtration rate." },
    { name: "Alanine Aminotransferase (ALT)", value: "24", unit: "U/L", referenceRange: "7 - 35", status: "normal", clinicalNote: "No active hepatic transaminitis." },
  ];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Clinical Report Analyzer
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Deterministic Demo Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated OCR & natural language entity extraction for laboratory documents and blood panels.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
          <span>{isScanning ? "Extracting Biomarkers..." : "Re-Scan Current Document"}</span>
        </button>
      </div>

      {/* Model Transparency Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Clinical AI Transparency Notice</p>
          <p className="text-amber-800/90 leading-relaxed text-[11px]">
            This analyzer is operating in simulated demo mode with pre-mapped reference ranges. To enable live document OCR and Gemini/OpenAI clinical summarization, configure your API keys in{" "}
            <Link href="/admin" className="underline font-semibold hover:text-amber-950">
              Admin Settings
            </Link>
            . MedVault does not make medical diagnoses; always consult your physician.
          </p>
        </div>
      </div>

      {/* Select Document Selector */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-semibold text-slate-700">Active Document:</span>
          <span className="font-bold text-slate-900 truncate">
            {activeAnalyzerRecord ? activeAnalyzerRecord.title : "No record chosen"}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400 hidden sm:inline">Switch record:</span>
          <select
            value={activeAnalyzerRecord?.id || ""}
            onChange={(e) => {
              const rec = records.find((r) => r.id === e.target.value);
              if (rec) setActiveAnalyzerRecord(rec);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
          >
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scanning State Loader */}
      {isScanning && (
        <div className="p-8 rounded-2xl bg-white border border-teal-200 shadow-xs text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Running Clinical Extraction Pipeline...
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Parsing DICOM/PDF tokens, detecting standard LOINC biomarkers, and matching against clinical reference ranges.
          </p>
        </div>
      )}

      {/* Main Analysis View */}
      {!isScanning && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
            <button
              onClick={() => setActiveTab("biomarkers")}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "biomarkers"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Extracted Biomarkers ({defaultBiomarkers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "summary"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Patient Plain-Language Summary</span>
            </button>

            <button
              onClick={() => setActiveTab("questions")}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "questions"
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Doctor Discussion Guide</span>
            </button>
          </div>

          {/* Tab 1: Biomarkers Table */}
          {activeTab === "biomarkers" && (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Biomarker Name</th>
                      <th className="py-3 px-4">Observed Value</th>
                      <th className="py-3 px-4">Clinical Reference Range</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Clinical Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {defaultBiomarkers.map((bio, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {bio.name}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {bio.value} <span className="text-[10px] font-normal text-slate-500">{bio.unit}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {bio.referenceRange} {bio.unit}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bio.status === "normal"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : bio.status === "borderline"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {bio.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                          {bio.clinicalNote || "Within acceptable parameters."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Plain Language Patient Summary */}
          {activeTab === "summary" && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Plain-Language Clinical Interpretation
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Generated by MedVault Medical NLP Engine
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-slate-700 leading-relaxed">
                <p>
                  <strong>Overall Assessment:</strong> This report represents a routine comprehensive metabolic and lipid panel. The primary area requiring attention is your cholesterol profile.
                </p>
                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                  <p className="font-semibold text-teal-900">Key Takeaways:</p>
                  <ul className="list-disc list-inside space-y-1 text-teal-950">
                    <li><strong>Blood Sugar Control:</strong> Fasting glucose is at 92 mg/dL, which is within the optimal healthy range (70-99 mg/dL).</li>
                    <li><strong>Kidney & Liver Health:</strong> Serum Creatinine (0.82 mg/dL) and eGFR (&gt;90) indicate healthy, normal renal function. Hepatic ALT levels are optimal.</li>
                    <li><strong>Cholesterol Balance:</strong> Total cholesterol is mildly elevated at 215 mg/dL (target is under 200). LDL (often termed &quot;bad&quot; cholesterol) is at 132 mg/dL, which is considered borderline high.</li>
                  </ul>
                </div>
                <p>
                  <strong>Recommended Next Steps:</strong> Discuss whether dietary adjustments (e.g., increasing soluble fiber and reducing saturated fats) or cholesterol-lowering medication (such as low-dose Atorvastatin) are appropriate for your cardiovascular risk profile.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Chat with MedVault AI about this report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Tab 3: Doctor Questions Guide */}
          {activeTab === "questions" && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Physician Discussion Preparation
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Targeted questions prepared for your next appointment with Dr. Rostova
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">1. Cholesterol Management Strategy</span>
                  <p className="text-slate-600">
                    &quot;My total cholesterol is 215 mg/dL and LDL is 132 mg/dL. Would you suggest a 3-month trial of lifestyle changes first, or should we evaluate a statin?&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">2. Blood Pressure Medication Interaction</span>
                  <p className="text-slate-600">
                    &quot;Does my current dosage of Lisinopril 10mg interact with any omega-3 or CoQ10 supplements I might take for heart health?&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">3. Retest Frequency</span>
                  <p className="text-slate-600">
                    &quot;When should we schedule a follow-up lipid panel to measure progress after making dietary modifications?&quot;
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/sharing"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Create Doctor Share Pass for this Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
