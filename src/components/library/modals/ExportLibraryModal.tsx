"use client";

import React, { useState } from "react";
import { useLibrary } from "@/features/library/context";
import { LibraryModalShell } from "./LibraryModalShell";
import { FiDownload } from "react-icons/fi";

export function ExportLibraryModal() {
  const { activeModal, closeModal, exportLibraryReport } = useLibrary();
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [scope, setScope] = useState("Full Catalog & Submissions");

  const isOpen = activeModal?.type === "exportReport";

  return (
    <LibraryModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Export Library Report"
      subtitle="Download editorial submissions, catalog indexing stats, and author telemetry."
      footer={
        <>
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => exportLibraryReport(format, scope)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#E8785A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <FiDownload className="w-3.5 h-3.5" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#374151] mb-1.5">
            Dataset Scope
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-white text-[#111111] focus:outline-none focus:border-[#E8785A]"
          >
            <option>Full Catalog &amp; Submissions</option>
            <option>Pending Editorial Queue</option>
            <option>Approved Books Ledger</option>
            <option>Policy Non-Compliant &amp; Rejections</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#374151] mb-1.5">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(["csv", "json"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  format === fmt
                    ? "bg-[#FFF3EE] border-[#E8785A] text-[#E8785A]"
                    : "bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </LibraryModalShell>
  );
}

