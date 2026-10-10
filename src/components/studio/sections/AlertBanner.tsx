"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";
import { FiArrowRight } from "react-icons/fi";

export function AlertBanner() {
  const { openDrawer, alerts } = useStudio();

  return (
    <div className="w-full bg-[#FEF9E7] border border-[#FDE68A] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      {/* Left Message */}
      <div className="flex items-center gap-2.5 text-xs text-[#92400E]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0 animate-pulse" />
        <span className="font-bold text-[#78350F]">
          Attention Required ({alerts.length}):
        </span>
        <span className="text-[#854D0E] line-clamp-1">
          2 generative pipeline timeouts on US-East Node · Video Rendering queue at 88% capacity.
        </span>
      </div>

      {/* Right Action */}
      <button
        onClick={() => openDrawer({ type: "alerts" })}
        className="group flex items-center gap-1.5 text-xs font-bold text-[#92400E] hover:text-[#78350F] transition-colors shrink-0"
      >
        <span>Inspect Alerts</span>
        <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
