"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";
import { FiCheckCircle } from "react-icons/fi";

export function ClusterHealthBar() {
  const { clusterHealth, openDrawer } = useStudio();

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto shadow-xs text-xs">
      {/* Title */}
      <div className="flex items-center gap-2 shrink-0">
        <FiCheckCircle className="w-4 h-4 text-[#10B981]" />
        <span className="font-bold text-[#111111]">Studio Cluster Health:</span>
      </div>

      {/* Services List */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {clusterHealth.map((svc) => (
          <button
            key={svc.id}
            onClick={() => openDrawer({ type: "serviceHealth", serviceId: svc.id })}
            className="flex items-center gap-1.5 text-[#374151] hover:text-[#111111] transition-colors py-0.5 px-1 rounded hover:bg-[#FAFAFB]"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${svc.status === "Healthy"
                ? "bg-[#10B981]"
                : svc.status === "Degraded"
                  ? "bg-[#F59E0B]"
                  : "bg-[#DC2626]"
                }`}
            />
            <span className="font-semibold">
              {svc.name}: <span className="text-[#04563b] font-bold">{svc.status}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
