"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  CheckCircle2,
  Sun,
  Sunset,
  Moon,
  Trash2,
  X,
  ShoppingBag,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { medicationSchema, MedicationInput } from "@/lib/validations";

export default function RemindersPage() {
  const { medications, toggleMedicationTaken, addMedication, deleteMedication } = useStore();
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<MedicationInput>({
    name: "",
    dosage: "",
    frequency: "Once daily",
    instructions: "Take with water after breakfast",
    prescribedBy: "Dr. Elena Rostova",
    timeOfDay: ["Morning"],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const slots = [
    { id: "Morning", label: "Morning (08:00 AM)", icon: Sun, color: "text-amber-500" },
    { id: "Afternoon", label: "Afternoon (01:00 PM)", icon: Sun, color: "text-amber-600" },
    { id: "Evening", label: "Evening (07:00 PM)", icon: Sunset, color: "text-orange-500" },
    { id: "Night", label: "Night (10:00 PM)", icon: Moon, color: "text-indigo-500" },
  ] as const;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = medicationSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    addMedication({
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      instructions: formData.instructions,
      prescribedBy: formData.prescribedBy,
      timeOfDay: formData.timeOfDay,
      startDate: new Date().toISOString().split("T")[0],
      remainingRefills: 3,
    });

    setAddModalOpen(false);
    setFormData({
      name: "",
      dosage: "",
      frequency: "Once daily",
      instructions: "Take with water after breakfast",
      prescribedBy: "Dr. Elena Rostova",
      timeOfDay: ["Morning"],
    });
    setFormErrors({});
  };

  const toggleSlotSelection = (slot: "Morning" | "Afternoon" | "Evening" | "Night") => {
    setFormData((prev) => {
      const exists = prev.timeOfDay.includes(slot);
      const next: ("Morning" | "Afternoon" | "Evening" | "Night")[] = exists
        ? prev.timeOfDay.filter((s) => s !== slot)
        : [...prev.timeOfDay, slot];
      return { ...prev, timeOfDay: next };
    });
  };

  const completedCount = medications.filter((m) => m.isTakenToday).length;
  const adherenceRate = medications.length > 0
    ? Math.round((completedCount / medications.length) * 100)
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Medication Schedule & Adherence
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Active Schedule
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized dose timings with refill tracking and clinical adherence logs.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Adherence Streak Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Today&apos;s Adherence Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-700">{adherenceRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              ({completedCount} of {medications.length} taken)
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Continuous Streak</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">14 Days</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Excellent Adherence
            </span>
          </div>
        </div>

        <div className="flex justify-start md:justify-end">
          <Link
            href="/pharmacy"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />
            <span>Order Medication Refills</span>
          </Link>
        </div>
      </div>

      {/* Schedule by Time of Day */}
      <div className="space-y-6">
        {slots.map((slot) => {
          const SlotIcon = slot.icon;
          const medsInSlot = medications.filter((m) =>
            m.timeOfDay.includes(slot.id)
          );

          return (
            <div
              key={slot.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Slot Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlotIcon className={`w-4 h-4 ${slot.color}`} />
                  <h3 className="text-sm font-bold text-slate-900">{slot.label}</h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({medsInSlot.length} prescriptions)
                  </span>
                </div>
              </div>

              {/* Meds List */}
              <div className="p-4 divide-y divide-slate-100">
                {medsInSlot.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 px-2">
                    No medications scheduled for this time slot.
                  </p>
                ) : (
                  medsInSlot.map((med) => (
                    <div
                      key={med.id}
                      className="py-3 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleMedicationTaken(med.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 transition-colors cursor-pointer ${
                            med.isTakenToday
                              ? "bg-teal-600 border-teal-600 text-white"
                              : "border-slate-300 bg-white hover:border-teal-400"
                          }`}
                          aria-label={`Toggle dose for ${med.name}`}
                        >
                          {med.isTakenToday && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-bold ${
                                med.isTakenToday ? "line-through text-slate-400" : "text-slate-900"
                              }`}
                            >
                              {med.name}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {med.dosage}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {med.instructions} • Prescribed by {med.prescribedBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-[11px] font-medium text-slate-500">
                          {med.remainingRefills} refills remaining
                        </span>
                        <button
                          onClick={() => deleteMedication(med.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete medication"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Add Prescribed Medication
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Name & Dosage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Atorvastatin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.name && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20 mg, 1 tablet"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.dosage && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.dosage}</p>
                  )}
                </div>
              </div>

              {/* Schedule Slots */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Schedule Time of Day *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Morning", "Afternoon", "Evening", "Night"] as const).map((slot) => {
                    const isSelected = formData.timeOfDay.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlotSelection(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-teal-50 border-teal-500 text-teal-800"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <span>{slot}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      </button>
                    );
                  })}
                </div>
                {formErrors.timeOfDay && (
                  <p className="text-rose-600 text-[11px] mt-1">{formErrors.timeOfDay}</p>
                )}
              </div>

              {/* Frequency & Instructions */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Food Instructions & Timing *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Take with dinner; do not crush tablet"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Prescribed By */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prescribing Physician *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Elena Rostova"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Save Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
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
