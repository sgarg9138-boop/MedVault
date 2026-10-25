"use client";

import React, { useState } from "react";
import { Activity, Heart } from "lucide-react";
import { MedicalRecord } from "@/lib/types";
import { formatDate } from "@/lib/formatters";

interface VitalsTrendChartProps {
  records?: MedicalRecord[];
}

export function VitalsTrendChart({ records = [] }: VitalsTrendChartProps) {
  const [activeVital, setActiveVital] = useState<"bp" | "hr">("bp");

  // Chart coordinate geometry (Consistent viewBox: 0 0 500 200)
  const width = 500;
  const height = 200;
  const paddingLeft = 46;
  const paddingRight = 20;
  const paddingTop = 28;
  const paddingBottom = 35;
  const plotWidth = width - paddingLeft - paddingRight; // 434
  const plotHeight = height - paddingTop - paddingBottom; // 137

  // Actual recorded clinical readings from patient record history
  // rec-003: 2026-07-22 (Cardiology Consult) - BP: 128/82 mmHg, HR: 68 bpm
  // Recent log: 2026-10-23 (Health Dashboard) - BP: 118/76 mmHg, HR: 72 bpm
  const bpReadings = [
    { date: "Jul 22, 2026", systolic: 128, diastolic: 82, note: "Consultation" },
    { date: "Oct 23, 2026", systolic: 118, diastolic: 76, note: "Recent Log" },
  ];

  const hrReadings = [
    { date: "Jul 22, 2026", hr: 68, note: "Resting Sinus" },
    { date: "Oct 23, 2026", hr: 72, note: "Current Baseline" },
  ];

  // Specific, non-overlapping scales for each vital
  const bpMin = 60;
  const bpMax = 160;
  const bpTicks = [160, 140, 120, 100, 80, 60];

  const hrMin = 50;
  const hrMax = 100;
  const hrTicks = [100, 90, 80, 70, 60, 50];

  const getBpY = (val: number) =>
    paddingTop + plotHeight * (1 - (val - bpMin) / (bpMax - bpMin));

  const getHrY = (val: number) =>
    paddingTop + plotHeight * (1 - (val - hrMin) / (hrMax - hrMin));

  // Point X coordinates across the timeline
  const getX = (index: number, total: number) => {
    if (total <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + plotWidth * (0.2 + (index / (total - 1)) * 0.6);
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            {activeVital === "bp" ? (
              <Activity className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Vitals Trends</h3>
            <p className="text-[11px] text-slate-500">
              {activeVital === "bp"
                ? "Blood Pressure Trend (mmHg)"
                : "Resting Heart Rate (bpm)"}
            </p>
          </div>
        </div>

        {/* Vital Selector Tabs (Prevents scale collision) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveVital("bp")}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition-all ${
              activeVital === "bp"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Blood Pressure
          </button>
          <button
            type="button"
            onClick={() => setActiveVital("hr")}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition-all ${
              activeVital === "hr"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Heart Rate
          </button>
        </div>
      </div>

      {/* SVG Plotting Area */}
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 sm:h-56 select-none"
          shapeRendering="geometricPrecision"
          aria-label="Vitals Trends Chart"
        >
          {/* Subtle Horizontal Grid Lines & Left Y-Axis Numerical Labels */}
          {activeVital === "bp" &&
            bpTicks.map((tick) => {
              const y = getBpY(tick);
              return (
                <g key={`bp-grid-${tick}`}>
                  {/* Subtle horizontal gridline */}
                  <line
                    x1={paddingLeft}
                    x2={width - paddingRight}
                    y1={y}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  {/* Vertical Y-axis numbers stacked along the left */}
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

          {activeVital === "hr" &&
            hrTicks.map((tick) => {
              const y = getHrY(tick);
              return (
                <g key={`hr-grid-${tick}`}>
                  <line
                    x1={paddingLeft}
                    x2={width - paddingRight}
                    y1={y}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

          {/* Left Y-Axis Unit Indicator */}
          <text
            x={paddingLeft}
            y={paddingTop - 12}
            textAnchor="start"
            fill="#94a3b8"
            fontSize="9"
            fontWeight="600"
          >
            {activeVital === "bp" ? "mmHg" : "bpm"}
          </text>

          {/* Left Y-axis boundary line */}
          <line
            x1={paddingLeft}
            x2={paddingLeft}
            y1={paddingTop - 6}
            y2={paddingTop + plotHeight}
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Bottom X-axis baseline */}
          <line
            x1={paddingLeft}
            x2={width - paddingRight}
            y1={paddingTop + plotHeight}
            y2={paddingTop + plotHeight}
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Blood Pressure Plot */}
          {activeVital === "bp" && (
            <>
              {/* Clearly labelled reference line: Systolic Normal (120 mmHg) */}
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={getBpY(120)}
                y2={getBpY(120)}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={width - paddingRight}
                y={getBpY(120) - 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="9"
                fontWeight="600"
              >
                Normal Systolic Target: 120 mmHg
              </text>

              {/* Clearly labelled reference line: Diastolic Normal (80 mmHg) */}
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={getBpY(80)}
                y2={getBpY(80)}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={width - paddingRight}
                y={getBpY(80) - 4}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="9"
                fontWeight="500"
              >
                Diastolic Target: 80 mmHg
              </text>

              {/* Trend Lines between actual recorded dates */}
              <line
                x1={getX(0, bpReadings.length)}
                y1={getBpY(bpReadings[0].systolic)}
                x2={getX(1, bpReadings.length)}
                y2={getBpY(bpReadings[1].systolic)}
                stroke="#0d9488"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={getX(0, bpReadings.length)}
                y1={getBpY(bpReadings[0].diastolic)}
                x2={getX(1, bpReadings.length)}
                y2={getBpY(bpReadings[1].diastolic)}
                stroke="#0284c7"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Data Points with Values & Date Labels */}
              {bpReadings.map((reading, idx) => {
                const x = getX(idx, bpReadings.length);
                const sysY = getBpY(reading.systolic);
                const diaY = getBpY(reading.diastolic);
                return (
                  <g key={`bp-pt-${idx}`}>
                    {/* Vertical guideline between systolic and diastolic */}
                    <line
                      x1={x}
                      x2={x}
                      y1={sysY}
                      y2={diaY}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />

                    {/* Systolic Dot */}
                    <circle
                      cx={x}
                      cy={sysY}
                      r="4.5"
                      fill="#0d9488"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={sysY - 8}
                      textAnchor="middle"
                      fill="#0f766e"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {reading.systolic}
                    </text>

                    {/* Diastolic Dot */}
                    <circle
                      cx={x}
                      cy={diaY}
                      r="4"
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={diaY + 14}
                      textAnchor="middle"
                      fill="#0369a1"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {reading.diastolic}
                    </text>

                    {/* X-axis Date Label */}
                    <text
                      x={x}
                      y={paddingTop + plotHeight + 16}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {formatDate(reading.date)}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Heart Rate Plot */}
          {activeVital === "hr" && (
            <>
              {/* Clearly labelled reference baseline: Resting target (70 bpm) */}
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={getHrY(70)}
                y2={getHrY(70)}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={width - paddingRight}
                y={getHrY(70) - 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="9"
                fontWeight="600"
              >
                Resting Baseline Target: 70 bpm
              </text>

              {/* Trend Line connecting actual measurements */}
              <line
                x1={getX(0, hrReadings.length)}
                y1={getHrY(hrReadings[0].hr)}
                x2={getX(1, hrReadings.length)}
                y2={getHrY(hrReadings[1].hr)}
                stroke="#e11d48"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Data points */}
              {hrReadings.map((reading, idx) => {
                const x = getX(idx, hrReadings.length);
                const y = getHrY(reading.hr);
                return (
                  <g key={`hr-pt-${idx}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#e11d48"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      fill="#be123c"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {reading.hr} bpm
                    </text>

                    <text
                      x={x}
                      y={paddingTop + plotHeight + 16}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {formatDate(reading.date)}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Chart Footer / Clinical Legend */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        {activeVital === "bp" ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" /> Systolic
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> Diastolic
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span className="w-4 border-t border-dashed border-slate-400" /> Normal (120/80)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" /> Resting Heart Rate
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span className="w-4 border-t border-dashed border-slate-400" /> Baseline (70 bpm)
            </span>
          </div>
        )}

        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
          2 Clinical Logs ({records.length} Vault Records)
        </span>
      </div>
    </div>
  );
}
