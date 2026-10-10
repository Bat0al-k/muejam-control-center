"use client";

import React, { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useStudio } from "@/features/studio/context";
import { FiPlus, FiAlertCircle } from "react-icons/fi";

const accounts = [
  "Acme AI Labs",
  "NeuralWorks Studio",
  "Sarah Lin Media",
  "Marcus Vance",
  "Apex Media Labs",
  "Dr. Aris Thorne Academic",
  "Studio Pool Institutional",
];

export function AddCreditsModal() {
  const { activeModal, closeModal, addEnterpriseCredits } = useStudio();

  const [account, setAccount] = useState(accounts[0]);
  const [amount, setAmount] = useState<string>("50000");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = activeModal?.type === "addCredits";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);

    if (!account) {
      setError("Please select an organization or account.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Credit amount must be a positive number greater than 0.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await addEnterpriseCredits({
        account,
        amount: numAmount,
        reason: reason.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setIsLoading(false);
      closeModal();
      // Reset form
      setAmount("50000");
      setReason("");
      setNotes("");
    } catch {
      setIsLoading(false);
      setError("Failed to allocate credits. Please retry.");
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Enterprise Credits"
      subtitle="Direct top-up provisioning into client tenant studio wallet"
      maxWidthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Account / Organization Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
            Account / Organization <span className="text-red-500">*</span>
          </label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] focus:ring-1 focus:ring-[#E8785A]"
          >
            {accounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>
        </div>

        {/* Credit Amount Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
            Credit Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              required
              className="w-full px-3.5 py-2.5 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs font-mono font-bold text-[#111111] focus:outline-none focus:border-[#E8785A] focus:ring-1 focus:ring-[#E8785A]"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#6B7280]">
              credits
            </span>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
            Allocation Reason <span className="text-[10px] text-[#9CA3AF]">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Contract expansion, custom model tuning grant, SLA compensation..."
            className="w-full px-3.5 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] focus:ring-1 focus:ring-[#E8785A]"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
            Internal Notes <span className="text-[10px] text-[#9CA3AF]">(Optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Authorized by Operations Director"
            className="w-full px-3.5 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] focus:ring-1 focus:ring-[#E8785A]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F0F2]">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D96948] transition-colors shadow-sm disabled:opacity-50"
          >
            <FiPlus className="w-3.5 h-3.5" />
            {isLoading ? "Provisioning..." : "Add Credits"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
