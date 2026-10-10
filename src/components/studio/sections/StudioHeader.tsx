"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "@/features/studio/context";
import { DateRangeOption } from "@/features/studio/types";
import {
  FiCalendar,
  FiRefreshCw,
  FiDownload,
  FiPlus,
  FiExternalLink,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";

export function StudioHeader() {
  const {
    dateRange,
    setDateRange,
    isRefreshing,
    refreshDashboard,
    openDrawer,
    openModal,
  } = useStudio();

  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateOptions: { label: string; value: DateRangeOption }[] = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "This Month", value: "this_month" },
    { label: "Previous Month", value: "prev_month" },
    { label: "Custom Range...", value: "custom" },
  ];

  const currentLabel =
    dateOptions.find((o) => o.value === dateRange)?.label || "Last 30 Days";

  const handleSelectRange = (opt: { label: string; value: DateRangeOption }) => {
    if (opt.value === "custom") {
      setDateDropdownOpen(false);
      openModal({ type: "customDateRange" });
    } else {
      setDateRange(opt.value);
      setDateDropdownOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-2">
      {/* Left: Titles & Environment Badge */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-syne tracking-tight">
          Studio Admin Console
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Real-time GPU model pipelines, credit transaction nodes, and synthesis telemetry.
        </p>

        {/* Clickable Production Version Badge */}
        <div className="pt-1">
          <button
            onClick={() => openDrawer({ type: "environment" })}
            className="group inline-flex items-center gap-2 px-3 py-1 bg-[#EAFBF1] hover:bg-[#DDF8E7] text-[#065F46] rounded-full text-xs font-medium border border-[#A7F3D0] transition-all cursor-pointer shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#0ea472]" />
            <span className="font-semibold">Production:</span>
            <span>v2.4.0 Live • US-East Cluster</span>
            <FiExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right: Controls & Primary Actions */}
      <div className="flex flex-col sm:items-end gap-2.5">
        {/* Top button row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Global Date Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-sm"
            >
              <FiCalendar className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>{currentLabel}</span>
              <FiChevronDown
                className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${dateDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 z-30 animate-fade-in text-xs divide-y divide-[#F3F4F6]">
                <div className="py-1">
                  {dateOptions.map((opt) => {
                    const isSelected = dateRange === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectRange(opt)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#FFF5F2] transition-colors ${isSelected
                          ? "text-[#E8785A] font-semibold bg-[#FFF8F6]"
                          : "text-[#374151]"
                          }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <FiCheck className="w-3.5 h-3.5 text-[#E8785A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshDashboard}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-sm disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 text-[#6B7280] ${isRefreshing ? "animate-spin text-[#E8785A]" : ""
                }`}
            />
            <span>Refresh</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => openModal({ type: "export" })}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-sm"
          >
            <FiDownload className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Export</span>
          </button>
        </div>

        {/* Add Enterprise Credits Button */}
        <div className="mt-1.5">
          <button
            onClick={() => openModal({ type: "addCredits" })}
            className="flex items-center gap-2 px-4 py-2 bg-[#E8785A] hover:bg-[#D96948] active:scale-[0.99] text-white rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Enterprise Credits</span>
          </button>
        </div>
      </div>
    </div>
  );
}
