"use client";

import React, { useState, useId, useMemo } from "react";
import { ModalShell } from "./ModalShell";
import {
    FiCreditCard,
    FiAlertCircle,
    FiCheckCircle,
    FiDollarSign,
    FiInfo,
} from "react-icons/fi";
import { formatBankAmount, isValidPaymentAmount, parseBankAmountInput } from "@/lib/formatters";

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
    onPaymentRecorded: (payment: Record<string, unknown>) => void;
}

const CURRENCIES = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "EGP", symbol: "EGP" },
    { code: "SAR", symbol: "SAR" },
    { code: "AED", symbol: "AED" },
];

const PAYMENT_METHODS = [
    { value: "card", label: "Credit / Debit Card" },
    { value: "stripe", label: "Stripe Enterprise" },
    { value: "bank_transfer", label: "Bank Wire Transfer" },
    { value: "paymob", label: "Paymob Gateway" },
    { value: "paypal", label: "PayPal" },
    { value: "manual", label: "Manual Adjustment" },
];

const AVAILABLE_PLANS = [
    { id: "dead6c08-8596-4be0-a0e0-674e88d0687a", name: "Free Tier (الباقة المجانية)" },
    { id: "d9a1565c-adce-4384-8122-bf0e2c7ad6be", name: "Basic Plan (الباقة الأساسية)" },
    { id: "a9b3ad82-7c63-4648-b8b1-2e19aa0a5140", name: "Pro Plan (PRO)" },
    { id: "67a23eef-cd91-4f51-b35e-74d5232c81cc", name: "Enterprise Plan (باقه شركات)" },
];

export function RecordPaymentModal({
    isOpen,
    onClose,
    userId,
    userName,
    onPaymentRecorded,
}: RecordPaymentModalProps) {
    const amountInputId = useId();
    const currencySelectId = useId();
    const methodSelectId = useId();
    const statusSelectId = useId();
    const planSelectId = useId();
    const txId = useId();

    const [amount, setAmount] = useState<string>("");
    const [currency, setCurrency] = useState<string>("USD");
    const [paymentMethod, setPaymentMethod] = useState<string>("card");
    const [status, setStatus] = useState<string>("successful");
    const [planId, setPlanId] = useState<string>(AVAILABLE_PLANS[0].id);
    const [customTxId, setCustomTxId] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Analysis of the amount input state:
    // 1. Unspecified: user hasn't typed anything -> displays 0.00 as placeholder, cannot record.
    // 2. Default Zero: user typed "0" or "0.00" -> displays 0.00, cannot record.
    // 3. Valid Positive Amount: user entered > 0 -> formatted with 2 decimal digits like a bank, can record.
    const amountState = useMemo(() => {
        const trimmed = amount.trim();
        if (trimmed === "") {
            return {
                type: "unspecified" as const,
                displayPreview: formatBankAmount(0, { currency }),
                isValid: false,
                message:
                    "Amount is not yet specified. In compliance with banking standards, an empty amount defaults visually to 0.00 but cannot be recorded as an actual payment transaction.",
            };
        }

        const parsed = parseBankAmountInput(trimmed);
        if (parsed === null || Number.isNaN(parsed)) {
            return {
                type: "invalid" as const,
                displayPreview: "—",
                isValid: false,
                message: "Please enter a valid numeric monetary amount.",
            };
        }

        if (parsed === 0) {
            return {
                type: "zero" as const,
                displayPreview: formatBankAmount(0, { currency }),
                isValid: false,
                message:
                    "Amount is 0.00 (Zero). Payments cannot be recorded with a zero amount; enter a valid payment value.",
            };
        }

        if (parsed < 0) {
            return {
                type: "negative" as const,
                displayPreview: formatBankAmount(parsed, { currency }),
                isValid: false,
                message: "Payment amounts cannot be negative.",
            };
        }

        return {
            type: "valid" as const,
            displayPreview: formatBankAmount(parsed, { currency }),
            isValid: true,
            message: `Bank-standard format: ${formatBankAmount(parsed, { currency })}`,
        };
    }, [amount, currency]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidPaymentAmount(amount)) {
            setError(
                "Cannot record payment transaction: A valid positive amount greater than 0.00 is required."
            );
            return;
        }

        const parsedNumeric = parseBankAmountInput(amount);
        if (parsedNumeric === null || parsedNumeric <= 0) {
            setError("Invalid amount value.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const generatedTxId =
                customTxId.trim() ||
                `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            const response = await fetch("/api/studio/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    amount: parsedNumeric, // Pure numeric value sent to DB
                    currency,
                    paymentMethod,
                    status,
                    transactionId: generatedTxId,
                    planId,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to record payment transaction.");
            }

            // Successfully recorded
            onPaymentRecorded(result.payment);
            onClose();

            // Reset form
            setAmount("");
            setCustomTxId("");
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalShell
            isOpen={isOpen}
            onClose={onClose}
            title="Record Payment Transaction"
            subtitle="Add a bank-audited payment transaction to the user's ledger"
            maxWidthClass="max-w-lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div
                        role="alert"
                        className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2"
                    >
                        <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Target User Info Header */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] p-3 text-xs flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-[#9CA3AF]">
                            Account / Recipient
                        </p>
                        <p className="font-bold text-[#111111]">{userName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-[#9CA3AF]">
                            User ID
                        </p>
                        <p className="font-mono text-[11px] text-[#6B7280]">
                            {userId.substring(0, 8)}...{userId.substring(userId.length - 4)}
                        </p>
                    </div>
                </div>

                {/* Amount Input with Bank Formatting & Strict Distinction */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor={amountInputId}
                            className="text-xs font-bold uppercase tracking-wider text-[#374151]"
                        >
                            Payment Amount <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] font-mono font-bold text-[#E8785A]">
                            {amountState.displayPreview}
                        </span>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                            <FiDollarSign className="w-4 h-4" />
                        </div>
                        <input
                            id={amountInputId}
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-9 pr-24 py-2.5 bg-white border border-[#D1D5DB] rounded-xl text-sm font-mono font-bold text-[#111111] focus:outline-none focus:border-[#E8785A] focus:ring-1 focus:ring-[#E8785A]"
                            autoFocus
                        />
                        <div className="absolute inset-y-0 right-1.5 flex items-center">
                            <select
                                id={currencySelectId}
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="h-7 px-2 bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#374151] focus:outline-none focus:border-[#E8785A]"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Feedback Status Indicator */}
                    <div
                        className={`rounded-xl p-2.5 text-xs flex items-start gap-2 transition-colors ${
                            amountState.type === "valid"
                                ? "bg-emerald-50/80 border border-emerald-200 text-emerald-800"
                                : amountState.type === "unspecified"
                                ? "bg-amber-50/70 border border-amber-200 text-amber-800"
                                : "bg-red-50/70 border border-red-200 text-red-800"
                        }`}
                    >
                        {amountState.type === "valid" ? (
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                            <FiInfo className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5">
                            <p className="font-semibold">{amountState.message}</p>
                            {amountState.type === "unspecified" && (
                                <p className="text-[11px] opacity-80">
                                    Display shows 0.00. Enter a valid amount to enable saving.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Method & Status */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label
                            htmlFor={methodSelectId}
                            className="text-xs font-bold uppercase tracking-wider text-[#374151]"
                        >
                            Payment Method
                        </label>
                        <select
                            id={methodSelectId}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
                        >
                            {PAYMENT_METHODS.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor={statusSelectId}
                            className="text-xs font-bold uppercase tracking-wider text-[#374151]"
                        >
                            Status
                        </label>
                        <select
                            id={statusSelectId}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
                        >
                            <option value="successful">Successful (Settled)</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Plan Association */}
                <div className="space-y-1">
                    <label
                        htmlFor={planSelectId}
                        className="text-xs font-bold uppercase tracking-wider text-[#374151]"
                    >
                        Associated Plan
                    </label>
                    <select
                        id={planSelectId}
                        value={planId}
                        onChange={(e) => setPlanId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
                    >
                        {AVAILABLE_PLANS.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Custom Transaction ID (Optional) */}
                <div className="space-y-1">
                    <label
                        htmlFor={txId}
                        className="text-xs font-bold uppercase tracking-wider text-[#374151]"
                    >
                        Transaction ID <span className="text-[10px] text-[#9CA3AF]">(Optional)</span>
                    </label>
                    <input
                        id={txId}
                        type="text"
                        value={customTxId}
                        onChange={(e) => setCustomTxId(e.target.value)}
                        placeholder="Auto-generated e.g. TXN-K8Z..."
                        className="w-full px-3.5 py-2 bg-[#FAFAFB] border border-[#D1D5DB] rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#E8785A]"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F0F2]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !amountState.isValid}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D96948] transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                            !amountState.isValid
                                ? "Enter a valid payment amount greater than 0.00 to record"
                                : "Record this transaction"
                        }
                    >
                        <FiCreditCard className="w-3.5 h-3.5" />
                        <span>{loading ? "Recording..." : "Record Transaction"}</span>
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
