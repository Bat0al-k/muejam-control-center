"use client";

import React, { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useStudio } from "@/features/studio/context";
import { FiDownload } from "react-icons/fi";

export function ExportModal() {
  const { activeModal, closeModal, exportData, dateRange } = useStudio();

  const [scope, setScope] = useState("current");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const isOpen = activeModal?.type === "export";

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    await exportData({ scope, format });
    setIsExporting(false);
    closeModal();
  };

  const getRangeLabel = () => {
    switch (dateRange) {
      case "7d":
        return "Last 7 Days";
      case "30d":
        return "Last 30 Days";
      case "this_month":
        return "This Month";
      case "prev_month":
        return "Previous Month";
      case "custom":
        return "Custom Range";
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Export Dashboard Data"
      subtitle="Extract historical synthesis telemetry, credit combustion, and activity logs"
    >
      <form onSubmit={handleExport} className="space-y-4">
        {/* Export Scope */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
            Export Scope
          </label>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAFB] cursor-pointer">
              <input
                type="radio"
                name="scope"
                value="current"
                checked={scope === "current"}
                onChange={(e) => setScope(e.target.value)}
                className="text-[#E8785A] focus:ring-[#E8785A]"
              />
              <div>
                <span className="font-semibold text-[#111111] block">
                  Current View ({getRangeLabel()})
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Exports active filter window KPIs and daily cumulative tokens
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAFB] cursor-pointer">
              <input
                type="radio"
                name="scope"
                value="full"
                checked={scope === "full"}
                onChange={(e) => setScope(e.target.value)}
                className="text-[#E8785A] focus:ring-[#E8785A]"
              />
              <div>
                <span className="font-semibold text-[#111111] block">
                  Full Dashboard Data (All Time)
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Complete ledger history, model fine-tuning telemetry, and all events
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAFB] cursor-pointer">
              <input
                type="radio"
                name="scope"
                value="daterange"
                checked={scope === "daterange"}
                onChange={(e) => setScope(e.target.value)}
                className="text-[#E8785A] focus:ring-[#E8785A]"
              />
              <div>
                <span className="font-semibold text-[#111111] block">
                  Date Range Window
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Selected interval: <span className="font-medium text-[#111111]">{getRangeLabel()}</span>
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
            File Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={`p-3 rounded-xl border text-xs text-left transition-all ${
                format === "csv"
                  ? "border-[#E8785A] bg-[#FFF5F2] text-[#111111] font-semibold"
                  : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#FAFAFB]"
              }`}
            >
              <span className="font-bold block font-mono">CSV</span>
              <span className="text-[10px] text-[#6B7280]">Spreadsheet format</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("json")}
              className={`p-3 rounded-xl border text-xs text-left transition-all ${
                format === "json"
                  ? "border-[#E8785A] bg-[#FFF5F2] text-[#111111] font-semibold"
                  : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#FAFAFB]"
              }`}
            >
              <span className="font-bold block font-mono">JSON</span>
              <span className="text-[10px] text-[#6B7280]">Raw object payload</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F0F2]">
          <button
            type="button"
            onClick={closeModal}
            disabled={isExporting}
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D96948] transition-colors shadow-sm disabled:opacity-50"
          >
            <FiDownload className="w-3.5 h-3.5" />
            {isExporting ? "Generating..." : "Export"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
