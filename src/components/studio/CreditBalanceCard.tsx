"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";
import { FiCreditCard, FiPlus, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

export function CreditBalanceCard() {
  const { kpiStats, openModal } = useStudio();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF3EE] text-[#E8785A] flex items-center justify-center text-xl shrink-0">
          <FiCreditCard className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Enterprise Credits Pool Balance
          </span>
          <div className="text-3xl font-extrabold font-syne text-[#111111]">
            {(kpiStats.creditsAdded - kpiStats.creditsConsumed).toLocaleString()}{" "}
            <span className="text-sm font-normal text-[#6B7280]">credits available</span>
          </div>
          <div className="flex items-center gap-4 text-xs pt-1">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <FiArrowUpRight className="w-3.5 h-3.5" />
              Total Added: {kpiStats.creditsAdded.toLocaleString()}
            </span>
            <span className="text-[#DC2626] font-semibold flex items-center gap-1">
              <FiArrowDownRight className="w-3.5 h-3.5" />
              Total Consumed: {kpiStats.creditsConsumed.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <button
          onClick={() => openModal({ type: "addCredits" })}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E8785A] hover:bg-[#D96948] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Enterprise Credits</span>
        </button>
      </div>
    </div>
  );
}
