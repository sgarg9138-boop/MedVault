"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Database,
  Lock,
  Key,
  CheckCircle2,
  Copy,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminPage() {
  const { isSupabaseConnected, resetToDemoDefaults } = useStore();
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const sampleEnvText = `# MedVault Environment Setup
# Paste these into your .env.local file:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-public-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=medvault-records-private

# Optional: Live AI Clinical Engine
# GEMINI_API_KEY=your-gemini-key
# OPENAI_API_KEY=your-openai-key`;

  const sampleSqlSchema = `-- Run this in your Supabase Project -> SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  blood_group TEXT,
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Medical Records Vault
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  facility TEXT NOT NULL,
  record_date DATE NOT NULL,
  storage_path TEXT,
  summary TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_encrypted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Extracted Biomarkers
CREATE TABLE IF NOT EXISTS public.biomarkers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  reference_range TEXT,
  status TEXT,
  clinical_note TEXT
);

-- 4. Enable Row Level Security (Zero-Trust)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own records" ON public.medical_records FOR ALL USING (auth.uid() = user_id);`;

  const copyToClipboard = (text: string, type: "sql" | "env") => {
    navigator.clipboard.writeText(text);
    if (type === "sql") {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all mock records, carts, and reminders back to defaults?")) {
      resetToDemoDefaults();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration & Setup
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              System Health
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Environment variable diagnostics, PostgreSQL schema migrations, and zero-trust configuration.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo patient data and state have been restored to initial defaults!</span>
        </div>
      )}

      {/* Infrastructure Health Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Supabase Auth */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Supabase Auth</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-900">
            {isSupabaseConnected ? "Connected" : "Demo Mock Session"}
          </p>
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
              isSupabaseConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isSupabaseConnected ? "JWT Active" : "Config Required in .env.local"}
          </span>
        </div>

        {/* PostgreSQL Database */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">PostgreSQL (RLS)</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-900">
            {isSupabaseConnected ? "Cloud PostgreSQL" : "Local Browser State"}
          </p>
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
              isSupabaseConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isSupabaseConnected ? "Live Sync Active" : "Demo Mode Active"}
          </span>
        </div>

        {/* Storage Vault */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Private Storage</span>
            <Key className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-900">
            {isSupabaseConnected ? "Supabase Bucket" : "Client Vault Storage"}
          </p>
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
              isSupabaseConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-teal-50 text-teal-800 border border-teal-200"
            }`}
          >
            {isSupabaseConnected ? "Private S3 Encrypted" : "Browser Encrypted State"}
          </span>
        </div>

        {/* Clinical AI Engine */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Clinical AI Model</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">Deterministic Engine</p>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            Simulated NLP Active
          </span>
        </div>
      </div>

      {/* Beginner-Friendly Setup Instructions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Terminal className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">
            Beginner-Friendly Supabase Setup Guide
          </h2>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">
                Create a Free Supabase Project
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Visit{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 underline font-semibold inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="w-3 h-3 inline" />
                </a>{" "}
                and sign up for a free account. Click <strong>&quot;New Project&quot;</strong>, enter a name (e.g. <code>MedVault</code>) and set a secure database password.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  Run the Database Migration Script
                </h3>
                <button
                  onClick={() => copyToClipboard(sampleSqlSchema, "sql")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSql ? "Copied SQL!" : "Copy SQL Script"}</span>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                In your Supabase Dashboard, click on <strong>SQL Editor</strong> in the left sidebar, paste the SQL schema below, and click <strong>Run</strong>. This will set up the patient tables and zero-trust security policies.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] max-h-48 overflow-y-auto">
                <pre>{sampleSqlSchema}</pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  Configure Your Environment Variables
                </h3>
                <button
                  onClick={() => copyToClipboard(sampleEnvText, "env")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedEnv ? "Copied .env!" : "Copy .env Template"}</span>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Go to <strong>Project Settings → API</strong> in your Supabase dashboard. Copy your <strong>Project URL</strong> and <strong>anon public key</strong>. Create a file named <code>.env.local</code> in the root of your project:
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px]">
                <pre>{sampleEnvText}</pre>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">
                Restart Next.js Development Server
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Run <code>npm.cmd run dev</code> in PowerShell. MedVault will detect your live Supabase credentials and transition from local demo mode to live encrypted cloud synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
