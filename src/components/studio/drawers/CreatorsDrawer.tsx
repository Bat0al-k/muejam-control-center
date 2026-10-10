"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiUsers, FiTrendingUp, FiPieChart, FiClock } from "react-icons/fi";

export function CreatorsDrawer() {
  const { activeDrawer, closeDrawer, kpiStats } = useStudio();

  const isOpen = activeDrawer?.type === "creators";

  const topUsers = [
    {
      name: "Sarah Lin",
      role: "Creator Pro",
      generations: 128,
      creditsUsed: 14200,
      favoriteFeature: "Voice & Speech Synthesis",
      lastActive: "4m ago",
    },
    {
      name: "Marcus Vance",
      role: "Enterprise Studio",
      generations: 94,
      creditsUsed: 22100,
      favoriteFeature: "AI Text Generation",
      lastActive: "11m ago",
    },
    {
      name: "Elena Gomez",
      role: "Pro Creator",
      generations: 42,
      creditsUsed: 18450,
      favoriteFeature: "Video Gen & Rendering",
      lastActive: "1h ago",
    },
    {
      name: "Dr. Aris Thorne",
      role: "Academic Tier",
      generations: 67,
      creditsUsed: 8900,
      favoriteFeature: "Audio Transcription",
      lastActive: "42m ago",
    },
    {
      name: "Apex Creative Labs",
      role: "Enterprise Studio",
      generations: 210,
      creditsUsed: 38200,
      favoriteFeature: "Image & Artwork Generation",
      lastActive: "2h ago",
    },
  ];

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Active Studio Creators"
      subtitle="Creator engagement telemetry and feature distribution breakdown"
    >
      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-4">
          <span className="text-xs text-[#6B7280] block mb-1">Active Creators</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-syne text-[#111111]">
              {kpiStats.activeCreators}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <FiTrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {kpiStats.creatorsTrend}
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] mt-1 block">
            Across 14 enterprise workspaces
          </span>
        </div>

        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-4">
          <span className="text-xs text-[#6B7280] block mb-1">Daily Synthesis Volume</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-syne text-[#111111]">
              1,840
            </span>
            <span className="text-xs text-[#6B7280]">jobs/day</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            +22.4% MoM engagement
          </span>
        </div>
      </div>

      {/* Feature Distribution */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiPieChart className="w-3.5 h-3.5 text-[#E8785A]" />
          Creator Activity Distribution
        </h4>
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-[#111111]">Voice & Speech Synthesis</span>
              <span className="text-[#6B7280]">38% (156 creators)</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
              <div className="bg-[#0F766E] h-full rounded-full" style={{ width: "38%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-[#111111]">Video Gen & Rendering</span>
              <span className="text-[#6B7280]">27% (111 creators)</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
              <div className="bg-[#DC2626] h-full rounded-full" style={{ width: "27%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-[#111111]">AI Text Generation</span>
              <span className="text-[#6B7280]">23% (95 creators)</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
              <div className="bg-[#E8785A] h-full rounded-full" style={{ width: "23%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-[#111111]">Image & Artwork Generation</span>
              <span className="text-[#6B7280]">12% (50 creators)</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
              <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: "12%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Active Users */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiUsers className="w-3.5 h-3.5 text-[#6B7280]" />
          Top Active Creators This Sprint
        </h4>
        <div className="divide-y divide-[#F0F0F2] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
          {topUsers.map((u) => (
            <div key={u.name} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#FAFAFB] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111111]">{u.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {u.role}
                  </span>
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  Favored: <span className="text-[#374151] font-medium">{u.favoriteFeature}</span>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <div className="font-mono font-semibold text-[#111111]">
                  {u.generations} jobs
                </div>
                <div className="text-[10px] text-[#6B7280] flex items-center justify-end gap-1">
                  <FiClock className="w-3 h-3" />
                  {u.lastActive}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DrawerShell>
  );
}
