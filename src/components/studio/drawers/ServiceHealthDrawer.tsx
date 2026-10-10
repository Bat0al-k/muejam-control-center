"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiActivity, FiServer, FiCheckCircle, FiClock, FiAlertTriangle } from "react-icons/fi";

export function ServiceHealthDrawer() {
  const { activeDrawer, closeDrawer, clusterHealth } = useStudio();

  const isOpen = activeDrawer?.type === "serviceHealth";
  const serviceId = isOpen ? activeDrawer.serviceId : null;

  const service = clusterHealth.find((s) => s.id === serviceId) || clusterHealth[0];

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title={`${service.name} Health`}
      subtitle={`Service telemetry for ${service.cluster}`}
      badge={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {service.status}
        </span>
      }
    >
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
          <span className="text-[11px] text-[#6B7280] block mb-1">Current Load</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-syne text-[#111111]">
              {service.load}%
            </span>
            <span className="text-[11px] text-[#059669]">Nominal</span>
          </div>
          <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                service.load > 80 ? "bg-amber-500" : "bg-[#E8785A]"
              }`}
              style={{ width: `${service.load}%` }}
            />
          </div>
        </div>

        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
          <span className="text-[11px] text-[#6B7280] block mb-1">Queue Size</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-syne text-[#111111]">
              {service.queueSize}
            </span>
            <span className="text-[11px] text-[#6B7280]">jobs pending</span>
          </div>
          <div className="text-[10px] text-[#6B7280] mt-2">
            Average wait: ~{service.avgLatency}
          </div>
        </div>

        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
          <span className="text-[11px] text-[#6B7280] block mb-1">Error Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-syne text-[#111111]">
              {service.errorRate}%
            </span>
            <span className="text-[11px] text-emerald-600">SLA &lt; 0.1%</span>
          </div>
          <div className="text-[10px] text-[#6B7280] mt-2">
            Last 100k requests
          </div>
        </div>

        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
          <span className="text-[11px] text-[#6B7280] block mb-1">Avg Latency</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-syne text-[#111111]">
              {service.avgLatency}
            </span>
            <span className="text-[11px] text-[#6B7280]">P99: 1.8x</span>
          </div>
          <div className="text-[10px] text-[#6B7280] mt-2">
            Uptime: {service.uptime}
          </div>
        </div>
      </div>

      {/* Cluster Node Specs */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiServer className="w-3.5 h-3.5 text-[#E8785A]" />
          Cluster Node Allocation
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Cluster Subnet</span>
            <span className="font-mono font-medium text-[#111111]">{service.cluster}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Active Workers</span>
            <span className="font-medium text-[#111111]">{service.activeNodes}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Last Health Probe</span>
            <span className="font-medium text-[#111111] flex items-center gap-1">
              <FiClock className="w-3 h-3 text-[#6B7280]" />
              {service.lastChecked}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#6B7280]">Availability SLA</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <FiCheckCircle className="w-3 h-3" />
              {service.uptime} (30-day window)
            </span>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiActivity className="w-3.5 h-3.5 text-[#6B7280]" />
          Recent Incident & Telemetry History
        </h4>
        {service.recentIncidents.length === 0 ? (
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white text-center text-xs text-[#6B7280]">
            No service interruptions or degraded states recorded in the last 7 days.
          </div>
        ) : (
          <div className="space-y-2">
            {service.recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3 rounded-xl border border-[#E5E7EB] bg-white flex items-start justify-between text-xs gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle
                      className={`w-3.5 h-3.5 ${
                        inc.resolved ? "text-emerald-500" : "text-amber-500"
                      }`}
                    />
                    <span className="font-semibold text-[#111111]">{inc.message}</span>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">{inc.timestamp}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    inc.resolved
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {inc.resolved ? "Resolved" : "Monitoring"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DrawerShell>
  );
}
