"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useStore } from "@/lib/store";

export function DemoBanner() {
  const { isSupabaseConnected } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (isSupabaseConnected || dismissed) return null;

  return (
    <div className="bg-[#0a192f] text-slate-200 border-b border-teal-900/60 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
          <span className="font-semibold text-teal-300">Interactive Demo Active:</span>
          <span className="text-slate-300 truncate">
            Pre-loaded with fictional patient & lab data. Full state persistence enabled in your browser.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span>Supabase Setup Guide</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
