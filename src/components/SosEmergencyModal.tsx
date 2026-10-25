"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  X,
  MapPin,
  Clock,
  PhoneCall,
  ShieldAlert,
  Navigation,
  Edit3,
  Loader2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDateTime } from "@/lib/formatters";

interface SosEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function SosEmergencyModal({ isOpen, onClose }: SosEmergencyModalProps) {
  const { patient, medications } = useStore();

  const [step, setStep] = useState<"confirm" | "active">("confirm");
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestTime, setRequestTime] = useState<string>("");

  // Location state
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "requesting" | "acquired" | "denied" | "unavailable" | "manual"
  >("idle");
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [manualAddress, setManualAddress] = useState<string>("");
  const [manualInput, setManualInput] = useState<string>("");
  const [showManualInput, setShowManualInput] = useState(false);

  // Guards to reliably prevent duplicate requests & invalidate stale in-flight callbacks
  const activeSessionIdRef = useRef(0);
  const isConfirmingRef = useRef(false);
  const isLocationRequestedRef = useRef(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const activeHeadingRef = useRef<HTMLHeadingElement>(null);

  const handleCancel = useCallback(() => {
    // Invalidate session so any pending geolocation callback is completely discarded
    activeSessionIdRef.current = 0;
    isConfirmingRef.current = false;
    isLocationRequestedRef.current = false;
    setIsProcessing(false);
    onClose();
  }, [onClose]);

  // Focus trap, lifecycle guards, and keyboard handlers
  useEffect(() => {
    if (!isOpen) return;

    // Increment session ID to invalidate any prior in-flight requests upon reopening
    activeSessionIdRef.current += 1;
    setStep("confirm");
    setIsProcessing(false);
    isConfirmingRef.current = false;
    isLocationRequestedRef.current = false;
    setRequestTime("");
    setLocationStatus("idle");
    setCoordinates(null);
    setLocationError("");
    setManualAddress("");
    setManualInput("");
    setShowManualInput(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
        return;
      }

      // Accessible modal focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial accessible focus onto Cancel button to prevent accidental emergency confirmation
    const timer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    return () => {
      // Invalidate session on unmount or close
      activeSessionIdRef.current = 0;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleCancel]);

  // Focus active heading upon transitioning to active view
  useEffect(() => {
    if (step === "active") {
      const timer = setTimeout(() => {
        activeHeadingRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const requestBrowserLocation = () => {
    const currentSessionId = activeSessionIdRef.current;
    if (!currentSessionId) return;

    setLocationStatus("requesting");
    setLocationError("");

    if (typeof window === "undefined" || !navigator.geolocation) {
      if (activeSessionIdRef.current !== currentSessionId) return;
      setLocationStatus("unavailable");
      setLocationError("Geolocation is not supported by your browser environment.");
      setShowManualInput(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Guard: ensure modal is still open in this exact active session
        if (activeSessionIdRef.current !== currentSessionId) return;

        setCoordinates({
          latitude: Number(pos.coords.latitude.toFixed(5)),
          longitude: Number(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLocationStatus("acquired");
      },
      (err) => {
        // Guard: ensure modal is still open in this exact active session
        if (activeSessionIdRef.current !== currentSessionId) return;

        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setLocationError("Location permission was denied. You may enter your location manually below.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationStatus("unavailable");
          setLocationError("Location information is currently unavailable from your device.");
        } else if (err.code === err.TIMEOUT) {
          setLocationStatus("unavailable");
          setLocationError("Location request timed out. Please enter your location manually.");
        } else {
          setLocationStatus("unavailable");
          setLocationError("Unable to acquire location. Please enter manually.");
        }
        setShowManualInput(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirmEmergency = () => {
    // Reliable guard: prevent duplicate confirmation clicks and multiple location triggers
    if (isConfirmingRef.current || isProcessing || isLocationRequestedRef.current) return;
    isConfirmingRef.current = true;
    isLocationRequestedRef.current = true;
    setIsProcessing(true);

    const now = new Date();
    setRequestTime(formatDateTime(now));

    // Transition to active view
    setStep("active");

    // Initiate single guarded location request
    requestBrowserLocation();
  };

  const handleSaveManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setManualAddress(manualInput.trim());
    setLocationStatus("manual");
    setShowManualInput(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-assistance-title"
      ref={modalRef}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden my-8">
        {/* Top Emergency Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
              <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 id="emergency-assistance-title" className="text-lg font-extrabold tracking-tight">
                Emergency Assistance
              </h2>
              <span className="text-[11px] font-semibold text-rose-100 uppercase tracking-wider">
                Phase 1 • Interactive Clinical Demo
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Confirmation Screen */}
        {step === "confirm" && (
          <div className="p-6 space-y-5">
            {/* Explanation Alert */}
            <div className="p-4 rounded-xl bg-red-50/90 border border-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-950 space-y-1">
                <p className="font-bold text-red-900 text-sm">Emergency Protocol Demonstration</p>
                <p className="leading-relaxed text-red-800">
                  Starting this demo prepares a clinical summary containing your documented
                  blood group, allergies, medications, and emergency contact from your active profile,
                  and requests browser location to simulate emergency coordination.
                </p>
              </div>
            </div>

            {/* Privacy & Fictional Demo Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                <LockIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Privacy Notice</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                This demo does not transmit SOS location or clinical details to an emergency-response server
                or external emergency dispatch. Location and details entered during this demo remain in your
                local browser session.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900">
                <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800">
                  Fictional Demo Environment
                </span>
                <p className="text-[11px] leading-relaxed mt-0.5">
                  All displayed patient details are simulated demonstration data. In this Phase 1 demo,
                  no external responders, hospital services, or notification channels are contacted.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                ref={cancelBtnRef}
                onClick={handleCancel}
                disabled={isProcessing}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                ref={confirmBtnRef}
                onClick={handleConfirmEmergency}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all border border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Starting SOS Demo...</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-4 h-4" />
                    <span>Start SOS Demo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Active SOS Status & Emergency Summary */}
        {step === "active" && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Prominent Demo Notice Banner */}
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3
                  ref={activeHeadingRef}
                  tabIndex={-1}
                  className="font-extrabold text-amber-900 tracking-wide uppercase text-[11px] focus:outline-none"
                >
                  DEMO MODE — Simulated Emergency Profile
                </h3>
                <p className="text-amber-900 leading-relaxed">
                  All patient information displayed below is <strong>fictional demonstration data</strong>.
                  No actual SMS, email, ambulance dispatch, hospital alert, or emergency acknowledgement has
                  been sent. If you are experiencing a life-threatening emergency, call emergency authorities directly.
                </p>
              </div>
            </div>

            {/* Official Call Option (India 112) */}
            <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                  Official Emergency Hotline
                </span>
                <p className="text-xs font-bold text-slate-900">
                  National Emergency Services (India 112)
                </p>
                <p className="text-[11px] text-slate-600">
                  Tap to place a direct phone call from your phone/dialer. MedVault never auto-dials.
                </p>
              </div>
              <a
                href="tel:112"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 112 (India)</span>
              </a>
            </div>

            {/* Status Panel with Accurate Demo Status */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900">Request Status Panel</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                  <AlertCircle className="w-3 h-3 text-amber-700" />
                  Local Demo Simulation (No Dispatch)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Timestamp */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Request Timestamp
                    </span>
                    <span className="font-semibold text-slate-800">{requestTime}</span>
                  </div>
                </div>

                {/* Location Sharing Status */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Location Status
                    </span>
                    {locationStatus === "requesting" && (
                      <span className="text-teal-700 font-semibold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Detecting GPS...
                      </span>
                    )}
                    {locationStatus === "acquired" && (
                      <span className="text-emerald-700 font-semibold">GPS Coordinates Acquired</span>
                    )}
                    {locationStatus === "denied" && (
                      <span className="text-rose-700 font-semibold">Permission Denied</span>
                    )}
                    {locationStatus === "unavailable" && (
                      <span className="text-amber-700 font-semibold">GPS Unavailable</span>
                    )}
                    {locationStatus === "manual" && (
                      <span className="text-blue-700 font-semibold">Manual Address Saved</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Coordinates or Manual Entry Display */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                {locationStatus === "acquired" && coordinates && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          Lat: {coordinates.latitude}°, Lng: {coordinates.longitude}°
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Accuracy: ±{coordinates.accuracy} meters • Browser Geolocation API
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="text-xs text-teal-700 hover:text-teal-800 font-medium underline inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{showManualInput ? "Hide Manual Edit" : "Add Address Note"}</span>
                    </button>
                  </div>
                )}

                {(locationStatus === "denied" || locationStatus === "unavailable") && (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-800 font-medium">{locationError}</p>
                    {!showManualInput && (
                      <button
                        type="button"
                        onClick={() => setShowManualInput(true)}
                        className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Enter location manually</span>
                      </button>
                    )}
                  </div>
                )}

                {locationStatus === "manual" && manualAddress && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Manual Location
                      </span>
                      <p className="font-medium text-slate-900">{manualAddress}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowManualInput(true)}
                      className="text-xs text-teal-700 hover:text-teal-800 font-medium underline"
                    >
                      Edit
                    </button>
                  </div>
                )}

                {/* Manual Address Form */}
                {showManualInput && (
                  <form onSubmit={handleSaveManualLocation} className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                    <label htmlFor="manual-location-input" className="block text-[11px] font-bold text-slate-700">
                      Enter Current Location / Landmark:
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="manual-location-input"
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="e.g., Block B, Room 304, Green Park, New Delhi"
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowManualInput(false)}
                        className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Emergency Clinical Summary (Relevant Details Only, Clearly Fictional Demo) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Emergency Clinical Summary (Fictional Demo Data)
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Simulated Record
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Patient Identifier & Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Patient Identifier
                    </span>
                    <span className="font-semibold text-slate-900">{patient.fullName}</span>
                    <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                      (Fictional Demo Patient)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="text-[10px] text-rose-700 uppercase font-bold block">
                      Blood Group
                    </span>
                    <span className="font-extrabold text-rose-900 text-base">{patient.bloodGroup}</span>
                  </div>
                </div>

                {/* Allergies & Chronic Conditions */}
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <div>
                    <span className="font-bold text-amber-900 text-[11px] block">
                      ⚠️ Documented Allergies:
                    </span>
                    <p className="text-amber-800 font-semibold">
                      {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None documented"}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 text-[11px] block">
                      Chronic Conditions:
                    </span>
                    <p className="text-slate-800">
                      {patient.chronicConditions.length > 0
                        ? patient.chronicConditions.join(", ")
                        : "None documented"}
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Primary Emergency Contact
                    </span>
                    <p className="font-semibold text-slate-900">
                      {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                    </p>
                    <p className="text-slate-700">{patient.emergencyContact.phone}</p>
                  </div>
                  <a
                    href={`tel:${patient.emergencyContact.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call Contact</span>
                  </a>
                </div>

                {/* Medication List (Unverified Active Status) */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                    Medication List ({medications.length})
                  </span>
                  {medications.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {medications.map((m) => (
                        <li key={m.id}>
                          <span className="font-semibold text-slate-900">{m.name}</span> — {m.dosage} ({m.frequency})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No medications registered.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Close Emergency View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      ></path>
    </svg>
  );
}
