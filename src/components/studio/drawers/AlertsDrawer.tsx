"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiAlertTriangle, FiAlertCircle, FiInfo, FiArrowRight, FiCheck } from "react-icons/fi";

export function AlertsDrawer() {
  const { activeDrawer, closeDrawer, alerts, openDrawer, showToast } = useStudio();

  const isOpen = activeDrawer?.type === "alerts";

  const handleInspectTarget = (alert: (typeof alerts)[0]) => {
    if (alert.pipelineId) {
      openDrawer({ type: "pipelineDetails", pipelineId: alert.pipelineId });
    } else if (alert.serviceId) {
      openDrawer({ type: "serviceHealth", serviceId: alert.serviceId });
    } else {
      openDrawer({ type: "gpuUsage" });
    }
  };

  const handleAcknowledgeAll = () => {
    showToast("info", "Alerts acknowledged. Cluster monitoring watchdog updated.");
  };

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Studio Alerts"
      subtitle="Active operational warnings, timeouts, and resource threshold anomalies"
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          {alerts.length} Active
        </span>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#6B7280]">
            Last telemetry check: 12 seconds ago
          </span>
          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
            Acknowledge All
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isHigh = alert.severity === "high";
          const isWarning = alert.severity === "warning";

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                isHigh
                  ? "bg-red-50/60 border-red-200"
                  : isWarning
                  ? "bg-amber-50/60 border-amber-200"
                  : "bg-blue-50/60 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {isHigh && <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                  {isWarning && <FiAlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                  {!isHigh && !isWarning && <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      isHigh ? "text-red-900" : isWarning ? "text-amber-900" : "text-blue-900"
                    }`}
                  >
                    {alert.type}
                  </span>
                </div>
                <span className="text-[11px] text-[#6B7280]">{alert.time}</span>
              </div>

              <p className="text-xs text-[#1F2937] leading-relaxed mb-3">
                {alert.message}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[11px] text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Cluster:</span>
                  <span className="font-mono bg-white/80 px-1.5 py-0.5 rounded border border-black/5">
                    {alert.clusterNode}
                  </span>
                  {alert.jobId && (
                    <span className="font-mono text-[#E8785A] font-semibold">
                      {alert.jobId}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleInspectTarget(alert)}
                  className="flex items-center gap-1 font-semibold text-[#E8785A] hover:text-[#D96948] transition-colors group"
                >
                  View Details
                  <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DrawerShell>
  );
}
