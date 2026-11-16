"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLibrary } from "@/features/library/context";
import { LibraryDateRangeOption } from "@/features/library/library.types";
import {
  FiCalendar,
  FiDownload,
  FiPlus,
  FiChevronDown,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";

export function LibraryHeader() {
  const {
    dateRange,
    setDateRange,
    isRefreshing,
    refreshLibrary,
    openModal,
    openDrawer,
    showToast,
  } = useLibrary();

  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateOptions: { label: string; value: LibraryDateRangeOption }[] = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "This Month", value: "this_month" },
    { label: "Previous Month", value: "prev_month" },
  ];

  const currentDateLabel =
    dateOptions.find((o) => o.value === dateRange)?.label || "Last 30 Days";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1">
      {/* Left: Breadcrumbs, Title & Live Sync Badge */}
      <div className="space-y-1">
        {/* <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
          <span>Verticals</span>
          <span>&gt;</span>
          <span>Digital Library</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#111111]">Overview</span>
        </div> */}

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-syne tracking-tight">
            Library Overview
          </h1>

          <button
            type="button"
            onClick={() => openDrawer({ type: "environment" })}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAFBF1] hover:bg-[#DDF8E7] text-[#065F46] rounded-full text-xs font-semibold border border-[#A7F3D0] shadow-2xs transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#0ea472] animate-pulse" />
            <span>Live Sync Active</span>
          </button>
        </div>
      </div>

      {/* Right: Controls & Primary CTA */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Date Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-2xs cursor-pointer"
          >
            <FiCalendar className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>{currentDateLabel}</span>
            <FiChevronDown
              className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${dateDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 z-30 animate-fade-in text-xs">
              {dateOptions.map((opt) => {
                const isSelected = dateRange === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDateRange(opt.value);
                      setDateDropdownOpen(false);
                      showToast("info", `Filtered Library metrics for ${opt.label}`);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#FFF5F2] transition-colors ${isSelected
                      ? "text-[#E8785A] font-semibold bg-[#FFF8F6]"
                      : "text-[#374151]"
                      }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <FiCheck className="w-3.5 h-3.5 text-[#E8785A]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={refreshLibrary}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          title="Refresh catalog metrics"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 text-[#6B7280] ${isRefreshing ? "animate-spin text-[#E8785A]" : ""
              }`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Export Report */}
        <button
          type="button"
          onClick={() => openModal({ type: "exportReport" })}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-2xs cursor-pointer"
        >
          <FiDownload className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>Export Report</span>
        </button>

        {/* Submit New Book */}
        <button
          type="button"
          onClick={() => openModal({ type: "submitBook" })}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#ff6131] bg-[#E8785A] hover:bg-[#D96948] active:scale-[0.99] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Submit New Book</span>
        </button>
      </div>
    </div>
  );
}

