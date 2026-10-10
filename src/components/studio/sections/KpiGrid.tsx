"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";
import { useRouter } from "next/navigation";
import { FiTrendingUp } from "react-icons/fi";

export function KpiGrid() {
  const { kpiStats, showToast } = useStudio();
  const router = useRouter();

  const handleNavigate = (path: string, label: string) => {
    showToast("info", `Navigating to ${label}...`);
    router.push(path);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Studio Creators */}
      <button
        // onClick={() => openDrawer({ type: "creators" })}
        onClick={() => handleNavigate("/dashboard/studio/users", "Users")}
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            ACTIVE STUDIO CREATORS
          </span>
          <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-[#E8785A] transition-colors" />
        </div>

        <div>
          <div className="text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.activeCreators}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#059669] mt-2">
            <FiTrendingUp className="w-3.5 h-3.5" />
            <span>{kpiStats.creatorsTrend} <span className="font-medium text-[#6b7370]"> vs previous month</span></span>
          </div>
        </div>
      </button>

      {/* 2. Total Credits Added */}
      <button
        onClick={() => handleNavigate("/dashboard/studio/credits", "Credits")}
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            TOTAL CREDITS ADDED
          </span>
          <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-[#E8785A] transition-colors" />
        </div>

        <div>
          <div className="text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.creditsAdded.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#059669] mt-2">
            <FiTrendingUp className="w-3.5 h-3.5" />
            <span>{kpiStats.creditsAddedTrend} <span className="font-medium text-[#6b7370]"> vs previous month</span></span>
          </div>
        </div>
      </button>

      {/* 3. Total Credits Consumed */}
      <button
        onClick={() => handleNavigate("/dashboard/studio/credits?view=consumed", "Credits Consumption")}
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            TOTAL CREDITS CONSUMED
          </span>
          <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-[#E8785A] transition-colors" />
        </div>

        <div>
          <div className="text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.creditsConsumed.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#059669] mt-2">
            <FiTrendingUp className="w-3.5 h-3.5" />
            <span>{kpiStats.creditsConsumedTrend} <span className="font-medium text-[#6b7370]"> vs previous month</span></span>
          </div>
        </div>
      </button>

      {/* 4. Total System Transactions */}
      <button
        onClick={() => handleNavigate("/dashboard/studio/transactions", "Transactions")}
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            TOTAL SYSTEM TRANSACTIONS
          </span>
          <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-[#E8785A] transition-colors" />
        </div>

        <div>
          <div className="text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.totalTransactions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#059669] mt-2">
            <FiTrendingUp className="w-3.5 h-3.5" />
            <span>{kpiStats.transactionsTrend} <span className="font-medium text-[#6b7370]"> vs previous month</span></span>
          </div>
        </div>
      </button>
    </div>
  );
}
