"use client";

import React, { useState } from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiCheckCircle, FiServer, FiGitBranch, FiClock, FiShield } from "react-icons/fi";

export function EnvironmentDrawer() {
  const { activeDrawer, closeDrawer, showToast } = useStudio();
  const [selectedEnv, setSelectedEnv] = useState("Production");

  const isOpen = activeDrawer?.type === "environment";

  const environments = [
    {
      name: "Production",
      version: "v2.4.0",
      status: "Live",
      cluster: "US-East Cluster",
      releaseDate: "Oct 04, 2026",
      lastDeployment: "14 hours ago (Automated CI/CD)",
      deploymentStatus: "Operational · 0 Rollbacks",
      health: "100% SLA uptime",
      commit: "af4b3d5 (main)",
    },
    {
      name: "Staging",
      version: "v2.4.1-rc2",
      status: "Active Testing",
      cluster: "US-East-Stage-01",
      releaseDate: "Oct 06, 2026",
      lastDeployment: "3 hours ago (Nightly Build)",
      deploymentStatus: "Testing · 4 Active Jobs",
      health: "99.9% uptime",
      commit: "c82f91a (staging)",
    },
    {
      name: "Development",
      version: "v2.5.0-dev",
      status: "Experimental",
      cluster: "US-West-Dev-02",
      releaseDate: "Oct 07, 2026",
      lastDeployment: "45 mins ago",
      deploymentStatus: "Build Passing",
      health: "Internal Dev VPC",
      commit: "9fa442b (dev)",
    },
  ];

  const current = environments.find((e) => e.name === selectedEnv) || environments[0];

  const handleSwitch = (envName: string) => {
    setSelectedEnv(envName);
    showToast("info", `Inspecting telemetry for ${envName} environment`);
  };

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Studio Environment"
      subtitle="Cluster deployment configuration and telemetry"
      badge={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {current.status}
        </span>
      }
    >
      {/* Environment Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Available Environments
        </label>
        <div className="grid grid-cols-3 gap-2">
          {environments.map((env) => {
            const isSelected = env.name === selectedEnv;
            return (
              <button
                key={env.name}
                onClick={() => handleSwitch(env.name)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                  isSelected
                    ? "border-[#E8785A] bg-[#FFF5F2] text-[#111111] font-semibold shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#FAFAFB]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-syne">{env.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8785A]" />
                  )}
                </div>
                <div className="text-[10px] text-[#6B7280]">{env.version}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
            <FiServer className="w-4 h-4 text-[#E8785A]" />
            Cluster Node Telemetry
          </div>
          <span className="text-xs text-[#059669] font-medium flex items-center gap-1">
            <FiCheckCircle className="w-3.5 h-3.5" /> Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#6B7280] block mb-1">Environment</span>
            <span className="font-semibold text-[#111111]">{current.name}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Current Version</span>
            <span className="font-mono font-semibold text-[#111111] bg-white px-2 py-0.5 rounded border border-[#E5E7EB] inline-block">
              {current.version}
            </span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Cluster</span>
            <span className="font-semibold text-[#111111]">{current.cluster}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Release Date</span>
            <span className="font-semibold text-[#111111]">{current.releaseDate}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Last Deployment</span>
            <span className="font-semibold text-[#111111]">{current.lastDeployment}</span>
          </div>
          <div>
            <span className="text-[#6B7280] block mb-1">Deployment Status</span>
            <span className="font-semibold text-emerald-700">{current.deploymentStatus}</span>
          </div>
        </div>
      </div>

      {/* Security & Verification */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Deployment Integrity & Protocol
        </h4>
        <div className="border border-[#E5E7EB] rounded-xl divide-y divide-[#F0F0F2] text-xs">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <FiGitBranch className="w-4 h-4 text-[#6B7280]" />
              <span>Git Revision Commit</span>
            </div>
            <span className="font-mono text-[#111111] font-semibold">{current.commit}</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <FiShield className="w-4 h-4 text-[#6B7280]" />
              <span>TLS Security & Mutual Auth</span>
            </div>
            <span className="text-emerald-600 font-medium">mTLS v1.3 Verified</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <FiClock className="w-4 h-4 text-[#6B7280]" />
              <span>Uptime SLA Level</span>
            </div>
            <span className="font-medium text-[#111111]">{current.health}</span>
          </div>
        </div>
      </div>
    </DrawerShell>
  );
}
