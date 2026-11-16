"use client";

import React from "react";
import { useLibrary } from "@/features/library/context";

export function LibraryFooter() {
  const { syncLatency, showToast } = useLibrary();

  return (
    <footer className="pt-6 border-t border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-[#6B7280]">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-medium text-[#374151]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>
            Catalog Sync Latency:{" "}
            <strong className="font-mono text-[#111111]">{syncLatency}ms</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            showToast("info", "Opening Editorial Review Guidelines...")
          }
          className="hover:text-[#111111] transition-colors cursor-pointer"
        >
          Editorial Policy
        </button>

        <button
          type="button"
          onClick={() =>
            showToast("info", "ISBN & DRM Index Integrity verified.")
          }
          className="hover:text-[#111111] transition-colors cursor-pointer"
        >
          Index Integrity
        </button>
      </div>

      <div className="text-[11px] text-[#9CA3AF] text-left md:text-right">
        © 2026 Muejam Digital Library. Automated ingestion &amp; editorial review
        pipelines synchronized.
      </div>
    </footer>
  );
}

