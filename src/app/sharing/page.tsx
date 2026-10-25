"use client";

import React, { useState } from "react";
import {
  Share2,
  Plus,
  ShieldCheck,
  Clock,
  Eye,
  X,
  Copy,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { shareLinkSchema, ShareLinkInput } from "@/lib/validations";
import { formatDate } from "@/lib/formatters";

export default function SharingPage() {
  const { shareLinks, addShareLink, revokeShareLink } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ShareLinkInput>({
    recipientName: "",
    recipientRole: "Doctor",
    organization: "",
    accessLevel: "Lab Reports Only",
    expiresInDays: 7,
    requirePin: true,
    pinCode: "5921",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleGenerateShare = (e: React.FormEvent) => {
    e.preventDefault();
    const result = shareLinkSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + formData.expiresInDays);

    addShareLink({
      recipientName: formData.recipientName,
      recipientRole: formData.recipientRole,
      organization: formData.organization,
      expiresAt: expiryDate.toISOString().split("T")[0],
      accessLevel: formData.accessLevel,
      pinRequired: formData.requirePin,
      pinCode: formData.requirePin ? formData.pinCode || "4820" : undefined,
    });

    setModalOpen(false);
    setFormData({
      recipientName: "",
      recipientRole: "Doctor",
      organization: "",
      accessLevel: "Lab Reports Only",
      expiresInDays: 7,
      requirePin: true,
      pinCode: "5921",
    });
    setFormErrors({});
  };

  const copyShareUrl = (id: string) => {
    const url = `${window.location.origin}/portal/share/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Doctor & Caregiver Access Sharing
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Zero-Trust Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grant time-expiring, PIN-protected viewing credentials for specific doctors, hospitals, or insurance claims.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Share Pass</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs text-teal-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Cryptographic Access Revocation Guarantee</p>
          <p className="text-[11px] text-teal-900 leading-relaxed">
            Shared links expire automatically on their scheduled timestamp. You can revoke access immediately at any moment, invalidating the session token across all external physician portals.
          </p>
        </div>
      </div>

      {/* Active Shares Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Active Clinical Access Passes ({shareLinks.filter((s) => s.isActive).length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shareLinks.map((share) => (
            <div
              key={share.id}
              className={`rounded-2xl p-5 border shadow-xs transition-all space-y-4 ${
                share.isActive
                  ? "bg-white border-slate-200 hover:border-teal-300"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        share.isActive
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {share.isActive ? "Active Pass" : "Revoked"}
                    </span>
                    <span className="text-xs text-slate-400">• ID: {share.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {share.recipientName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {share.recipientRole} • {share.organization}
                  </p>
                </div>

                {share.isActive && (
                  <button
                    onClick={() => revokeShareLink(share.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                  >
                    Revoke Now
                  </button>
                )}
              </div>

              {/* Scope & Pin */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Scope</span>
                  <span className="font-semibold text-slate-800">{share.accessLevel}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">PIN Code</span>
                  <span className="font-mono font-bold text-teal-700">
                    {share.pinRequired ? share.pinCode || "Protected" : "None required"}
                  </span>
                </div>
              </div>

              {/* Expiry & Views */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expires: {formatDate(share.expiresAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Viewed {share.viewCount} times</span>
                </div>
              </div>

              {/* Copy URL */}
              {share.isActive && (
                <button
                  onClick={() => copyShareUrl(share.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-teal-600" />
                  <span>{copiedId === share.id ? "Link Copied!" : "Copy Secure Portal Link"}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Immutable Audit Trail */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900">
          Access Verification Audit Trail
        </h3>
        <p className="text-slate-500 text-[11px]">
          Every time a doctor or insurer accesses your shared files, an immutable access log is registered.
        </p>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">
                Dr. Rajesh Sharma accessed &quot;Lipid Profile &amp; CMP&quot;
              </p>
              <p className="text-[11px] text-slate-500">
                PIN Verified • IP: 103.21.244.12 (Metro Healthcare Network Demo)
              </p>
            </div>
            <span className="text-[11px] text-slate-400">21/10/2026 at 02:22 PM IST</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">
                National Star Health Insurance Adjuster downloaded verification summary
              </p>
              <p className="text-[11px] text-slate-500">
                PIN Verified • IP: 103.14.120.45 (Star Claims Gateway Demo)
              </p>
            </div>
            <span className="text-[11px] text-slate-400">24/09/2026 at 09:15 AM IST</span>
          </div>
        </div>
      </div>

      {/* Create Share Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Generate Doctor Access Pass
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateShare} className="space-y-4 text-xs">
              {/* Recipient Name & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Recipient Doctor/Specialist *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.recipientName && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role Category *
                  </label>
                  <select
                    value={formData.recipientRole}
                    onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value as ShareLinkInput["recipientRole"] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Doctor">Doctor / PCP</option>
                    <option value="Specialist">Specialist</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Insurance">Insurance Adjuster</option>
                    <option value="Family">Family Member</option>
                  </select>
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hospital / Clinical Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro Multi-Speciality Clinic"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
                {formErrors.organization && (
                  <p className="text-rose-600 text-[11px] mt-1">{formErrors.organization}</p>
                )}
              </div>

              {/* Access Scope & Expiration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Scope of Records
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as ShareLinkInput["accessLevel"] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Lab Reports Only">Lab Reports Only</option>
                    <option value="Single Document">Single Document</option>
                    <option value="Full Vault">Full Health Vault</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time to Live (Days)
                  </label>
                  <select
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value={1}>24 Hours (Urgent Care)</option>
                    <option value={7}>7 Days (Standard Visit)</option>
                    <option value={30}>30 Days (Care Coordinator)</option>
                  </select>
                </div>
              </div>

              {/* PIN Code */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requirePin}
                    onChange={(e) => setFormData({ ...formData, requirePin: e.target.checked })}
                    className="text-teal-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Require 4-digit Security PIN for doctor unlock
                  </span>
                </label>

                {formData.requirePin && (
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 5921"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="w-32 px-3 py-1.5 text-center font-mono font-bold text-sm rounded-lg border border-slate-300 bg-white"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Give this PIN code verbally or via SMS to the physician.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Create Secure Pass
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
