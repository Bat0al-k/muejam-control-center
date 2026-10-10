"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiCpu, FiServer, FiLayers } from "react-icons/fi";

export function GpuUsageDrawer() {
  const { activeDrawer, closeDrawer, gpuUsage } = useStudio();

  const isOpen = activeDrawer?.type === "gpuUsage";

  const usedPercent = Math.round((gpuUsage.usedVram / gpuUsage.totalVram) * 100);

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="GPU Resource Usage"
      subtitle="Cluster Tensor memory allocation and accelerator node pressure"
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          75.4% Allocated
        </span>
      }
    >
      {/* VRAM Gauge Card */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCpu className="w-5 h-5 text-[#E8785A]" />
            <div>
              <span className="text-xs text-[#6B7280] block">VRAM Saturation</span>
              <span className="text-2xl font-bold font-syne text-[#111111]">
                {gpuUsage.usedVram} GB{" "}
                <span className="text-sm font-normal text-[#6B7280]">
                  / {gpuUsage.totalVram} GB Total
                </span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#6B7280] block">Available Headroom</span>
            <span className="text-base font-bold font-syne text-emerald-600">
              {gpuUsage.availableVram} GB
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#E8785A] transition-all duration-500"
            style={{ width: `${usedPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-[#6B7280] pt-1">
          <span>Queue Pressure: {gpuUsage.queuePressure}</span>
          <span>Cluster: US-East Tensor Pool</span>
        </div>
      </div>

      {/* Active Pipelines Consuming VRAM */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiLayers className="w-3.5 h-3.5 text-[#E8785A]" />
          VRAM Allocation by Active Pipelines
        </h4>
        <div className="divide-y divide-[#F0F0F2] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white text-xs">
          {gpuUsage.activePipelines.map((pipe) => (
            <div
              key={pipe.name}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAFAFB] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#111111]">{pipe.name}</span>
                  <span className="text-[10px] font-mono text-[#6B7280]">{pipe.jobId}</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">{pipe.node}</div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#E8785A]">
                  {pipe.vramGb} GB
                </span>
                <div className="text-[10px] text-[#6B7280]">
                  {Math.round((pipe.vramGb / gpuUsage.totalVram) * 100)}% slice
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPU Node Distribution */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiServer className="w-3.5 h-3.5 text-[#6B7280]" />
          Accelerator Node Distribution
        </h4>
        <div className="space-y-2.5">
          {gpuUsage.nodeDistribution.map((node) => (
            <div
              key={node.node}
              className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#111111]">{node.node}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    node.load > 90
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {node.status} · {node.load}% Load
                </span>
              </div>
              <div className="w-full bg-[#F3F4F6] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    node.load > 90 ? "bg-amber-500" : "bg-[#0F766E]"
                  }`}
                  style={{ width: `${node.load}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#6B7280]">
                <span>
                  VRAM: {node.vramUsed} GB / {node.totalVram} GB
                </span>
                <span>8x H100 SXM5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DrawerShell>
  );
}
