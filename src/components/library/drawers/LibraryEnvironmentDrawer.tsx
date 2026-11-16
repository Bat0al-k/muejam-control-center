"use client";

import React from "react";
import { useLibrary } from "@/features/library/context";
import { LibraryDrawerShell } from "./LibraryDrawerShell";

export function LibraryEnvironmentDrawer() {
  const { activeDrawer, closeDrawer, syncLatency, kpiStats } = useLibrary();

  if (activeDrawer?.type !== "environment") return null;

  return (
    <LibraryDrawerShell
      isOpen={true}
      onClose={closeDrawer}
      title="Digital Library Environment"
      subtitle="Live catalog synchronization nodes, ISBN indexing health, and ingestion pipeline status."
      badge={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAFBF1] text-[#065F46] border border-[#A7F3D0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ea472] animate-pulse" />
          Live Sync Active
        </span>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Database Schema</span>
            <span className="font-mono font-bold text-[#111111]">libaray (Isolated)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Catalog Sync Latency</span>
            <span className="font-mono font-bold text-[#059669]">{syncLatency} ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Indexed Catalog Coverage</span>
            <span className="font-mono font-bold text-[#111111]">
              {kpiStats.indexedPercent} ({kpiStats.totalBooks.toLocaleString()} books)
            </span>
          </div>
        </div>
      </div>
    </LibraryDrawerShell>
  );
}

