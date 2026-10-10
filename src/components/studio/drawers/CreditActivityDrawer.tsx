"use client";

import React, { useState } from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiTrendingUp, FiCreditCard, FiArrowUpRight, FiArrowDownRight, FiCheckCircle } from "react-icons/fi";

export function CreditActivityDrawer() {
  const { activeDrawer, closeDrawer, showToast } = useStudio();
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  const isOpen = activeDrawer?.type === "creditActivity";
  const point = isOpen ? activeDrawer.point : null;

  if (!point) return null;

  const mockTransactions = [
    {
      id: "TX-8921",
      account: "Marcus Vance",
      type: "Deduction",
      feature: "Batch Text Generation",
      amount: -80,
      time: "09:42 UTC",
      status: "Settled",
    },
    {
      id: "TX-8924",
      account: "Sarah Lin",
      type: "Deduction",
      feature: "Voice Synthesis tracks",
      amount: -240,
      time: "11:15 UTC",
      status: "Settled",
    },
    {
      id: "TX-8930",
      account: "Studio Pool Institutional",
      type: "Recharge",
      feature: "Stripe Enterprise Automated Top-up",
      amount: 50000,
      time: "14:00 UTC",
      status: "Cleared",
    },
    {
      id: "TX-8942",
      account: "Elena Gomez",
      type: "Deduction",
      feature: "Video Gen & Rendering 4K",
      amount: -650,
      time: "18:20 UTC",
      status: "Settled",
    },
  ];

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title={`Credit Activity — ${point.date}`}
      subtitle={`Daily synthesis token combustion and pool recharge telemetry for ${point.day}`}
      badge={
        point.peak ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            Peak Volume Day
          </span>
        ) : undefined
      }
    >
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block mb-1">
            Credits Used
          </span>
          <span className="text-base font-bold font-syne text-[#111111] block">
            {point.used.toLocaleString()}
          </span>
          <span className="text-[10px] text-red-600 flex items-center justify-center gap-0.5 mt-1">
            <FiArrowDownRight className="w-3 h-3" /> Combustion
          </span>
        </div>

        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block mb-1">
            Recharged
          </span>
          <span className="text-base font-bold font-syne text-[#111111] block">
            {point.recharged.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 flex items-center justify-center gap-0.5 mt-1">
            <FiArrowUpRight className="w-3 h-3" /> Inflow
          </span>
        </div>

        <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block mb-1">
            Net Change
          </span>
          <span className="text-base font-bold font-syne text-[#059669] block">
            {point.difference > 0 ? `+${point.difference.toLocaleString()}` : point.difference.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#6B7280] mt-1 block">Surplus balance</span>
        </div>
      </div>

      {/* Top Consuming Features */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiTrendingUp className="w-3.5 h-3.5 text-[#E8785A]" />
          Top Consuming Features on This Date
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#374151]">AI Text Generation</span>
            <span className="font-mono font-medium text-[#111111]">
              {Math.round(point.used * 0.45).toLocaleString()} credits (45%)
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#374151]">Video Gen & Rendering</span>
            <span className="font-mono font-medium text-[#111111]">
              {Math.round(point.used * 0.32).toLocaleString()} credits (32%)
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#374151]">Voice & Speech Synthesis</span>
            <span className="font-mono font-medium text-[#111111]">
              {Math.round(point.used * 0.15).toLocaleString()} credits (15%)
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#374151]">Image & Artwork Generation</span>
            <span className="font-mono font-medium text-[#111111]">
              {Math.round(point.used * 0.08).toLocaleString()} credits (8%)
            </span>
          </div>
        </div>
      </div>

      {/* Related Transactions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
            <FiCreditCard className="w-3.5 h-3.5 text-[#6B7280]" />
            Associated Ledger Transactions
          </h4>
          <span className="text-[11px] text-[#6B7280]">Click for detail</span>
        </div>

        <div className="divide-y divide-[#F0F0F2] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
          {mockTransactions.map((tx) => {
            const isRecharge = tx.amount > 0;
            const isSelected = selectedTx === tx.id;

            return (
              <div
                key={tx.id}
                onClick={() => {
                  setSelectedTx(isSelected ? null : tx.id);
                  showToast("info", `Selected transaction #${tx.id}`);
                }}
                className={`p-3 text-xs cursor-pointer transition-colors ${
                  isSelected ? "bg-[#FFF8F6]" : "hover:bg-[#FAFAFB]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#111111]">{tx.id}</span>
                      <span className="text-[11px] text-[#4B5563] font-medium">{tx.account}</span>
                    </div>
                    <div className="text-[11px] text-[#6B7280]">{tx.feature}</div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        isRecharge ? "text-emerald-600" : "text-[#111111]"
                      }`}
                    >
                      {isRecharge ? `+${tx.amount.toLocaleString()}` : `${tx.amount.toLocaleString()}`}
                    </span>
                    <div className="text-[10px] text-[#9CA3AF]">{tx.time}</div>
                  </div>
                </div>

                {/* Expandable Transaction Details */}
                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-[#F0F0F2] text-[11px] text-[#4B5563] space-y-1 bg-white p-2.5 rounded-lg border">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" /> {tx.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Settlement Node:</span>
                      <span className="font-mono">US-East-Accounting-01</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audit Checksum:</span>
                      <span className="font-mono text-[#9CA3AF]">sha256:88a7...f32</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DrawerShell>
  );
}
