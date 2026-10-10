"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "@/features/studio/context";
import { EventTypeFilter } from "@/features/studio/types";
import { useRouter } from "next/navigation";
import {
  FiFilter,
  FiChevronDown,
  FiChevronRight,
  FiCreditCard,
  FiArrowRight,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";

export function RecentActivity() {
  const {
    filteredActivity,
    eventTypeFilter,
    setEventTypeFilter,
    openDrawer,
    refreshDashboard,
    isRefreshing,
  } = useStudio();
  const router = useRouter();

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eventFilterOptions: EventTypeFilter[] = [
    "All Events",
    "Generations",
    "Credits",
    "Transactions",
    "User Activity",
    "System Events",
    "Errors",
    "API Events",
  ];

  const handleSelectFilter = (opt: EventTypeFilter) => {
    setEventTypeFilter(opt);
    setFilterDropdownOpen(false);
  };

  const handleNavigateLedger = () => {
    router.push("/dashboard/studio/activity");
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8785A]" />
            <h2 className="text-base font-bold font-syne text-[#111111] tracking-tight">
              Recent Studio Activity
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#006A61]/15 text-[#006A61] border border-[#006A61]/30">
              REAL-TIME EVENTS
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Completed generations, credit deductions, top-ups, and account events
          </p>
        </div>

        {/* Right Controls: Filter Event Type Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2.5 bg-[#006A61]/15 border border-[#006A61]/30 hover:border-[#D1D5DB] rounded-lg text-xs font-semibold text-[#374151] hover:bg-[#FAFAFB] transition-colors shadow-xs"
            >
              <FiFilter className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>{eventTypeFilter === "All Events" ? "Filter Event Type" : eventTypeFilter}</span>
              <FiChevronDown
                className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${filterDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 z-30 animate-fade-in text-xs">
                {eventFilterOptions.map((opt) => {
                  const isSelected = eventTypeFilter === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectFilter(opt)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#FFF5F2] transition-colors ${isSelected
                        ? "text-[#E8785A] font-semibold bg-[#FFF8F6]"
                        : "text-[#374151]"
                        }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <FiCheck className="w-3.5 h-3.5 text-[#E8785A]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={refreshDashboard}
            disabled={isRefreshing}
            className="p-2.5 bg-[#006A61]/15 border border-[#006A61]/30 hover:bg-[#006A61]/10 rounded-lg text-[#41454d] hover:text-[#111111] transition-colors"
            aria-label="Refresh activity"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#006A61]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Activity Items List */}
      <div className="overflow-hidden bg-white space-y-2">
        {filteredActivity.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7280]">
            No activity events recorded for filter: <strong>{eventTypeFilter}</strong>
          </div>
        ) : (
          filteredActivity.slice(0, 5).map((act) => {
            return (
              <button
                key={act.id}
                onClick={() =>
                  openDrawer({ type: "activityDetails", activityId: act.id })
                }
                className="group rounded-xl w-full p-4 flex items-center justify-between text-left bg-[#006A61]/5 hover:bg-[#006A61]/10 transition-colors cursor-pointer"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${act.isStripe
                      ? "bg-[#CCFBF1] text-[#0F766E]"
                      : act.avatarBg || "bg-stone-100 text-stone-700"
                      }`}
                  >
                    {act.isStripe ? (
                      <FiCreditCard className="w-4 h-4" />
                    ) : (
                      act.userName.charAt(0)
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-[#111111] group-hover:text-[#E8785A] transition-colors">
                        {act.userName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {act.userBadge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] truncate">
                      {act.description}
                    </p>
                  </div>
                </div>

                {/* Right: Credits Change & Time */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right space-y-0.5">
                    {act.eventType === "Transactions" ? (
                      <div className="text-xs font-mono font-bold text-[#059669]">
                        {act.details}
                      </div>
                    ) : act.eventType === "Credits" ? (
                      <div
                        className={`text-xs font-mono font-bold ${act.creditsChange > 0
                          ? "text-[#059669]"
                          : "text-[#E8785A]"
                          }`}
                      >
                        {act.creditsChange > 0 ? "+" : ""}
                        {act.creditsChange.toLocaleString()} credits
                      </div>
                    ) : null}

                    <div className="text-[11px] text-[#9CA3AF] font-mono">
                      {act.timeAgo}
                    </div>
                  </div>

                  <FiChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Ledger Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6B7280] pt-1 gap-2">
        <span>
          Showing latest {Math.min(filteredActivity.length, 5)} of{" "}
          {filteredActivity.length} activity records
        </span>

        <button
          onClick={handleNavigateLedger}
          className="group flex items-center gap-1.5 font-bold text-[#111111] hover:text-[#E8785A] transition-colors self-start sm:self-auto"
        >
          <span>View Full Activity Ledger</span>
          <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
