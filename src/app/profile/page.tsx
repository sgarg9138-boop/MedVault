"use client";

import React, { useState } from "react";
import {
  User,
  Heart,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Building,
  CreditCard,
  Edit,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { profileSchema, ProfileInput } from "@/lib/validations";

export default function ProfilePage() {
  const { patient, updatePatient } = useStore();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ProfileInput>({
    fullName: patient.fullName,
    dob: patient.dob,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    height: patient.height,
    weight: patient.weight,
    allergies: patient.allergies.join(", "),
    chronicConditions: patient.chronicConditions.join(", "),
    emergencyName: patient.emergencyContact.name,
    emergencyPhone: patient.emergencyContact.phone,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = profileSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    updatePatient({
      fullName: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      height: formData.height,
      weight: formData.weight,
      allergies: formData.allergies ? formData.allergies.split(",").map((s) => s.trim()) : [],
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(",").map((s) => s.trim()) : [],
      emergencyContact: {
        ...patient.emergencyContact,
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
      },
    });

    setEditModalOpen(false);
    setFormErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Patient Clinical Profile
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              ID: {patient.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Demographic, emergency, and biometric data synced with your encrypted medical records.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              fullName: patient.fullName,
              dob: patient.dob,
              gender: patient.gender,
              bloodGroup: patient.bloodGroup,
              height: patient.height,
              weight: patient.weight,
              allergies: patient.allergies.join(", "),
              chronicConditions: patient.chronicConditions.join(", "),
              emergencyName: patient.emergencyContact.name,
              emergencyPhone: patient.emergencyContact.phone,
            });
            setEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Profile Details</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-extrabold text-2xl">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{patient.fullName}</h2>
              <p className="text-xs text-slate-500">
                DOB: {patient.dob} • Gender: {patient.gender} • Patient ID: {patient.id}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-teal-600" />
              <span>Blood Group: {patient.bloodGroup}</span>
            </span>
          </div>
        </div>

        {/* Clinical Demographics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Height</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">{patient.height}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">{patient.weight}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">BMI</span>
            <span className="text-base font-bold text-emerald-700 mt-1 block">22.7 (Normal)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Storage Vault</span>
            <span className="text-base font-bold text-teal-700 mt-1 block">Encrypted</span>
          </div>
        </div>

        {/* Allergies & Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Known Clinical Allergies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-900 font-medium text-xs shadow-2xs"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Documented Chronic Conditions</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patient.chronicConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium text-xs shadow-2xs"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts & Care Providers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          {/* Emergency Contact */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Emergency Contact</span>
            </div>
            <p className="font-semibold text-slate-900">{patient.emergencyContact.name}</p>
            <p className="text-slate-500">{patient.emergencyContact.relationship}</p>
            <p className="text-slate-700 font-medium pt-1">{patient.emergencyContact.phone}</p>
          </div>

          {/* Primary Doctor */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
              <Building className="w-3.5 h-3.5 text-teal-600" />
              <span>Primary Care Doctor</span>
            </div>
            <p className="font-semibold text-slate-900">{patient.primaryPhysician.name}</p>
            <p className="text-slate-500">{patient.primaryPhysician.hospital}</p>
            <p className="text-slate-700 font-medium pt-1">{patient.primaryPhysician.phone}</p>
          </div>

          {/* Health Insurance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
              <CreditCard className="w-3.5 h-3.5 text-teal-600" />
              <span>Health Insurance Policy</span>
            </div>
            <p className="font-semibold text-slate-900">{patient.insurance.provider}</p>
            <p className="text-slate-500">Policy: {patient.insurance.policyNumber}</p>
            <p className="text-slate-500">Group: {patient.insurance.groupNumber}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Clinical Demographics
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              {/* Full Name & DOB */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.fullName && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              {/* Gender & Blood Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Height *</label>
                  <input
                    type="text"
                    placeholder="e.g. 168 cm"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight *</label>
                  <input
                    type="text"
                    placeholder="e.g. 64 kg"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Emergency Contact Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
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
