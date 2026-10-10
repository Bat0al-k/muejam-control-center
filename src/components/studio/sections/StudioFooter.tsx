"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";

export function StudioFooter() {
  const { clusterLatency, showToast } = useStudio();

  return (
    <footer className="pt-6 border-t border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between text-xs text-[#6B7280] ">
      {/* Left: Latency & Quick Links */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-medium text-[#374151]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Cluster Latency: <strong className="font-mono text-[#111111]">{clusterLatency}ms</strong></span>
        </div>

        <button
          onClick={() => showToast("info", "Opening Distributed Core Protocol docs...")}
          className="hover:text-[#111111] transition-colors"
        >
          Documentation
        </button>

        <button
          onClick={() => showToast("info", "Node Security & mTLS certificates healthy.")}
          className="hover:text-[#111111] transition-colors"
        >
          Node Security
        </button>
      </div>

      {/* Right: Copyright & System Sync Note */}
      <div className="text-[11px] text-[#9CA3AF] text-left md:text-right">
        © 2026 Muejam Studio. Realtime synthesis nodes operated under Distributed Core Protocol. System synchronized.
      </div>
    </footer>
  );
}
