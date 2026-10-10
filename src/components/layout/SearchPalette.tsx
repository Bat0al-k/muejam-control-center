"use client";

import React, { useState, useEffect } from "react";
import { useStudio } from "@/features/studio/context";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiCpu, FiUser, FiActivity, FiArrowRight } from "react-icons/fi";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const { openDrawer } = useStudio();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    {
      category: "Pipelines & Jobs",
      items: [
        { label: "Job #3842: StyleGAN HD Cover (94%)", action: () => openDrawer({ type: "pipelineDetails", pipelineId: "3842" }), icon: FiCpu },
        { label: "Job #3847: Arabic Voice Clone (62%)", action: () => openDrawer({ type: "pipelineDetails", pipelineId: "3847" }), icon: FiCpu },
        { label: "Job #3850: Podcast Transcription (Queued)", action: () => openDrawer({ type: "pipelineDetails", pipelineId: "3850" }), icon: FiCpu },
        { label: "Job #3851: Marketing Video Reel (81%)", action: () => openDrawer({ type: "pipelineDetails", pipelineId: "3851" }), icon: FiCpu },
      ],
    },
    {
      category: "Navigation & Telemetry",
      items: [
        { label: "Studio Environment & Cluster Telemetry", action: () => openDrawer({ type: "environment" }), icon: FiActivity },
        { label: "GPU Resource Usage (72.4 GB / 96 GB)", action: () => openDrawer({ type: "gpuUsage" }), icon: FiActivity },
        { label: "Model Fine-Tuning: Muejam Pose-v2", action: () => openDrawer({ type: "modelTraining" }), icon: FiActivity },
        { label: "Navigate to Credits Ledger", action: () => router.push("/dashboard/studio/credits"), icon: FiArrowRight },
        { label: "Navigate to Activity Logs", action: () => router.push("/dashboard/studio/activity"), icon: FiArrowRight },
      ],
    },
    {
      category: "Creators & Accounts",
      items: [
        { label: "Sarah Lin [Creator Pro]", action: () => openDrawer({ type: "creators" }), icon: FiUser },
        { label: "Marcus Vance [Enterprise Studio]", action: () => openDrawer({ type: "creators" }), icon: FiUser },
        { label: "Dr. Aris Thorne [Academic Tier]", action: () => openDrawer({ type: "creators" }), icon: FiUser },
      ],
    },
  ];

  const filtered = quickItems.map((group) => ({
    category: group.category,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 animate-fade-in">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#F0F0F2] flex items-center gap-3">
          <FiSearch className="w-5 h-5 text-[#6B7280] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repository, entries, logs, jobs, creators..."
            autoFocus
            className="w-full text-sm font-medium text-[#111111] placeholder-[#9CA3AF] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9CA3AF] hover:text-[#111111]"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4 text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280]">
              No entries found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleSelect(item.action)}
                      className="w-full p-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#FFF5F2] hover:text-[#E8785A] text-[#374151] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#6B7280] group-hover:text-[#E8785A]" />
                        <span className="font-medium text-xs text-[#111111] group-hover:text-[#E8785A]">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9CA3AF] group-hover:text-[#E8785A]">
                        Select ↵
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-[#F0F0F2] bg-[#FAFAFB] flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-white border rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd></span>
          </div>
          <span>Close: <kbd className="px-1.5 py-0.5 bg-white border rounded">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
}
