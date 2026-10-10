"use client";

import React, { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useStudio } from "@/features/studio/context";
import { FiCalendar, FiCheck } from "react-icons/fi";

export function CustomDateRangeModal() {
  const {
    activeModal,
    closeModal,
    customRange,
    setCustomRange,
    setDateRange,
    showToast,
  } = useStudio();

  const [start, setStart] = useState(customRange.start);
  const [end, setEnd] = useState(customRange.end);

  const isOpen = activeModal?.type === "customDateRange";

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomRange({ start, end });
    setDateRange("custom");
    closeModal();
    showToast("success", `Custom date range applied: ${start} to ${end}`);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Select Custom Date Range"
      subtitle="Filter historical synthesis KPIs and token volume across custom dates"
    >
      <form onSubmit={handleApply} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[#374151]">
              Start Date
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[#374151]">
              End Date
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
            />
          </div>
        </div>

        <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#6B7280] flex items-center gap-2">
          <FiCalendar className="w-4 h-4 text-[#E8785A] shrink-0" />
          <span>Real-time cluster telemetry remains unaffected by historical date filters.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F0F2]">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D96948] transition-colors shadow-sm"
          >
            <FiCheck className="w-3.5 h-3.5" />
            Apply Filter
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
