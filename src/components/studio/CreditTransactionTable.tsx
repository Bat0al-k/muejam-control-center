"use client";

import React, { useState } from "react";
import { useStudio } from "@/features/studio/context";
import { FiCheckCircle, FiSearch, FiFilter } from "react-icons/fi";

const mockLedgerTransactions = [
  { id: "TX-9902", account: "Studio Pool Auto-Recharge", type: "Stripe Enterprise Auto-Provision", amount: 50000, date: "Oct 07, 2026 04:04 UTC", status: "Settled", checksum: "sha256:49c0...a12" },
  { id: "TX-9901", account: "Sarah Lin", type: "Neural Model v4 Voice Synthesis", amount: -240, date: "Oct 07, 2026 04:28 UTC", status: "Settled", checksum: "sha256:77b1...f94" },
  { id: "TX-9900", account: "Marcus Vance", type: "Batch Text Generation Enterprise Prompt", amount: -80, date: "Oct 07, 2026 04:21 UTC", status: "Settled", checksum: "sha256:12e4...31b" },
  { id: "TX-9899", account: "Dr. Aris Thorne", type: "Audio Transcription Alignment", amount: -120, date: "Oct 07, 2026 03:50 UTC", status: "Settled", checksum: "sha256:90aa...58c" },
  { id: "TX-9898", account: "Elena Gomez", type: "4K ProRes Video Reel Generation", amount: -650, date: "Oct 07, 2026 03:28 UTC", status: "Settled", checksum: "sha256:56df...291" },
  { id: "TX-9891", account: "Apex Media Labs", type: "Enterprise Credits Allocation", amount: 25000, date: "Oct 07, 2026 02:15 UTC", status: "Settled", checksum: "sha256:68cc...83a" },
  { id: "TX-9884", account: "NeuralWorks Studio", type: "StyleGAN Latent Batch Iteration", amount: -480, date: "Oct 06, 2026 23:40 UTC", status: "Settled", checksum: "sha256:34ee...99a" },
];

export function CreditTransactionTable() {
  const { showToast } = useStudio();
  const [filter, setFilter] = useState("");

  const filtered = mockLedgerTransactions.filter(
    (tx) =>
      tx.id.toLowerCase().includes(filter.toLowerCase()) ||
      tx.account.toLowerCase().includes(filter.toLowerCase()) ||
      tx.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-[#F0F0F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAFB]">
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-[#E8785A]" />
          <h3 className="font-bold font-syne text-[#111111] text-sm">
            Audited Transaction Ledger
          </h3>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by account, ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F0F0F2] bg-[#FAFAFB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Account / Tenant</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Credits Amount</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
            {filtered.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <tr
                  key={tx.id}
                  onClick={() => showToast("info", `Inspecting transaction ${tx.id}`)}
                  className="hover:bg-[#FAFAFB] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#111111]">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#111111]">
                    {tx.account}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{tx.type}</td>
                  <td
                    className={`py-3.5 px-4 font-mono font-bold text-right ${
                      isPositive ? "text-emerald-600" : "text-[#111111]"
                    }`}
                  >
                    {isPositive ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280] font-mono text-[11px]">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200">
                      <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
