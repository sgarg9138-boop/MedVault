"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Lock,
  Sparkles,
  Trash2,
  Calendar,
  User,
  Building,
  CheckCircle2,
  X,
  UploadCloud,
  FileCheck,
  Share2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { MedicalRecord, RecordCategory } from "@/lib/types";
import { recordUploadSchema, RecordUploadInput } from "@/lib/validations";
import { formatDate } from "@/lib/formatters";

export default function RecordsPage() {
  const { records, addRecord, deleteRecord, setActiveAnalyzerRecord } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<RecordUploadInput>({
    title: "",
    category: "lab-report",
    doctorName: "",
    facility: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    summary: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [simulatedFileName, setSimulatedFileName] = useState<string>("");

  const categories = [
    { id: "all", label: "All Documents" },
    { id: "lab-report", label: "Lab Reports" },
    { id: "prescription", label: "Prescriptions" },
    { id: "radiology", label: "Radiology & Scans" },
    { id: "vaccination", label: "Vaccinations" },
    { id: "discharge", label: "Discharge Summaries" },
  ];

  const filteredRecords = records.filter((r) => {
    const matchesCategory =
      selectedCategory === "all" || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = recordUploadSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Manual Upload", "Patient Portal"];

    addRecord({
      title: formData.title,
      category: formData.category as RecordCategory,
      doctorName: formData.doctorName,
      facility: formData.facility,
      date: formData.date,
      fileSize: simulatedFileName ? "1.8 MB" : "1.2 MB",
      fileType: "PDF (Encrypted)",
      summary:
        formData.summary ||
        `Clinical document uploaded by patient on ${formData.date}. Awaiting automated laboratory parsing.`,
      keyFindings: [
        "Document uploaded to encrypted vault storage.",
        "Verified by patient digital signature.",
      ],
      tags: tagsArray,
      isEncrypted: true,
      status: "verified",
    });

    setUploadModalOpen(false);
    setFormData({
      title: "",
      category: "lab-report",
      doctorName: "",
      facility: "",
      date: new Date().toISOString().split("T")[0],
      tags: "",
      summary: "",
    });
    setFormErrors({});
    setSimulatedFileName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Medical Records Vault
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {records.length} Documents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero-Knowledge encrypted personal health records with granular doctor access control.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, doctor, clinic, or tag (e.g. cholesterol, x-ray)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? "bg-[#0a192f] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-sm font-bold text-slate-700">No medical records found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filter or upload a new clinical record to this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Top: Category & Encryption Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {record.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
                    <Lock className="w-3 h-3 text-teal-600" />
                    <span>AES-256</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {record.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{record.facility}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{record.doctorName}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(record.date)} • {record.fileSize}</span>
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {record.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewRecord(record)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  View Details
                </button>

                <div className="flex items-center gap-1.5">
                  <Link
                    href="/analyzer"
                    onClick={() => setActiveAnalyzerRecord(record)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
                    title="Analyze Biomarkers with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Analyze</span>
                  </Link>

                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record View Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {viewRecord.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{viewRecord.title}</h2>
                <p className="text-xs text-slate-500">
                  {viewRecord.facility} • {viewRecord.doctorName} • {formatDate(viewRecord.date)}
                </p>
              </div>
              <button
                onClick={() => setViewRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Summary */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Clinical Summary
              </h4>
              <p className="p-3.5 rounded-xl bg-slate-50 text-slate-700 leading-relaxed border border-slate-200/80">
                {viewRecord.summary}
              </p>
            </div>

            {/* Key Clinical Findings */}
            {viewRecord.keyFindings && viewRecord.keyFindings.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Key Extracted Findings
                </h4>
                <div className="space-y-1.5">
                  {viewRecord.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security & File Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[11px] block">File Size</span>
                <span className="font-bold text-slate-800">{viewRecord.fileSize}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Encryption</span>
                <span className="font-bold text-teal-700">Client AES-256</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Storage Engine</span>
                <span className="font-bold text-slate-800">Supabase Private</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5 justify-end">
              <Link
                href="/analyzer"
                onClick={() => {
                  setActiveAnalyzerRecord(viewRecord);
                  setViewRecord(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with AI</span>
              </Link>
              <Link
                href="/sharing"
                onClick={() => setViewRecord(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Share with Doctor</span>
              </Link>
              <button
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Upload Medical Document
                </h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* File Dropzone Simulator */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Document File (PDF, DICOM, or JPG)
                </label>
                <div
                  onClick={() => setSimulatedFileName("CBC_Metabolic_Report_2026.pdf")}
                  className="p-4 border-2 border-dashed border-teal-300 rounded-xl bg-teal-50/40 text-center cursor-pointer hover:bg-teal-50 transition-colors"
                >
                  <FileCheck className="w-8 h-8 text-teal-600 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700">
                    {simulatedFileName || "Click to attach simulated lab report PDF"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Max size: 25 MB • Zero-Knowledge client encryption enabled
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Blood Panel & Thyroid Profile"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
                {formErrors.title && (
                  <p className="text-rose-600 text-[11px] mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RecordCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="lab-report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="radiology">Radiology & Scan</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="discharge">Discharge Summary</option>
                    <option value="other">Other Record</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date of Record *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                  </input>
                  {formErrors.date && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.date}</p>
                  )}
                </div>
              </div>

              {/* Doctor & Facility */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Doctor / Specialist *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma, MD"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.doctorName && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.doctorName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Facility / Hospital *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Central Diagnostic Laboratory"
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.facility && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.facility}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bloodwork, Lipids, Annual"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Notes / Summary (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief clinical context or diagnosis..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Save to Encrypted Vault
                </button>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
