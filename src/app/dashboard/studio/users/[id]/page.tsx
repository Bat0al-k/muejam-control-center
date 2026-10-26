"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FiArrowLeft,
    FiAlertCircle,
    FiCalendar,
    FiCreditCard,
    FiFolder,
    FiRefreshCw,
    FiUser,
    FiActivity,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiPlus,
} from "react-icons/fi";
import { EditUserModal } from "@/components/studio/modals/EditUserModal";
import { DeleteUserModal } from "@/components/studio/modals/DeleteUserModal";
import { RecordPaymentModal } from "@/components/studio/modals/RecordPaymentModal";
import { formatBankAmount } from "@/lib/formatters";
import type { StudioUser } from "@/features/studio/studio.service";

type ActivityRecord = Record<string, unknown>;

interface StudioUserDetails {
    user: {
        id: string;
        name: string;
        email: string | null;
    };
    projects: ActivityRecord[];
    payments: ActivityRecord[];
    aiUsage: ActivityRecord[];
    ttsRequests: ActivityRecord[];
    usageLogs: ActivityRecord[];
    transcriptionUsage: ActivityRecord[];
    voiceGenerations: ActivityRecord[];
}

const activitySections = [
    { key: "projects", title: "Projects", icon: FiFolder },
    { key: "payments", title: "Payments & Transactions", icon: FiCreditCard },
    { key: "aiUsage", title: "AI Usage", icon: FiActivity },
    { key: "voiceGenerations", title: "Voice Generations", icon: FiActivity },
    { key: "ttsRequests", title: "Text-to-Speech Requests", icon: FiActivity },
    { key: "usageLogs", title: "Character Usage Logs", icon: FiActivity },
    {
        key: "transcriptionUsage",
        title: "Transcription Usage",
        icon: FiActivity,
    },
] as const;

function formatLabel(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(key: string, value: unknown): string {
    const lowerKey = key.toLowerCase();

    // Bank-standard financial formatting:
    // Uses decimal point '.' followed by two digits (e.g., 50.00, 12.50, 0.00).
    // If the default amount is zero or empty, displays 0.00.
    // Display/presentation only - does not modify the raw database value.
    if (lowerKey === "amount" || lowerKey.endsWith("_amount") || lowerKey === "price") {
        return formatBankAmount(value as number | string | null | undefined, {
            defaultIfEmpty: "0.00",
        });
    }

    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (
        typeof value === "string" &&
        (key.endsWith("_at") || key === "createdAt" || key === "crated_at")
    ) {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleString();
        }
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function ActivitySection({
    title,
    icon: Icon,
    rows,
    actionButton,
}: {
    title: string;
    icon: typeof FiFolder;
    rows: ActivityRecord[];
    actionButton?: React.ReactNode;
}) {
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return (
        <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F2] bg-[#FAFAFB] px-5 py-4">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#E8785A]" />
                    <h2 className="text-sm font-bold text-[#111111]">{title}</h2>
                </div>

                <div className="flex items-center gap-2.5">
                    {actionButton}
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                        {rows.length}
                    </span>
                </div>
            </div>

            {rows.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[#6B7280]">
                    No records found.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-[#F0F0F2] text-[10px] uppercase tracking-wider text-[#6B7280]">
                                {columns.map((column) => {
                                    const isAmount =
                                        column.toLowerCase() === "amount" ||
                                        column.toLowerCase().endsWith("_amount");
                                    return (
                                        <th
                                            key={column}
                                            className={`whitespace-nowrap px-4 py-3 font-bold ${
                                                isAmount ? "text-right" : ""
                                            }`}
                                        >
                                            {formatLabel(column)}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
                            {rows.map((row, index) => (
                                <tr
                                    key={String(row.id ?? index)}
                                    className="hover:bg-[#FAFAFB]"
                                >
                                    {columns.map((column) => {
                                        const lower = column.toLowerCase();
                                        const isAmount =
                                            lower === "amount" || lower.endsWith("_amount");
                                        const isStatus = lower === "status";
                                        const formatted = formatValue(column, row[column]);

                                        return (
                                            <td
                                                key={column}
                                                className={`max-w-[320px] whitespace-nowrap px-4 py-3 ${
                                                    isAmount ? "text-right" : ""
                                                }`}
                                            >
                                                {isAmount ? (
                                                    <span
                                                        title={formatted}
                                                        className="font-mono font-bold text-[#111111] bg-stone-100/70 border border-stone-200/60 px-2 py-0.5 rounded-md"
                                                    >
                                                        {formatted}
                                                    </span>
                                                ) : isStatus ? (
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                                                            String(row[column]).toLowerCase() ===
                                                                "successful" ||
                                                            String(row[column]).toLowerCase() ===
                                                                "settled"
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : String(row[column]).toLowerCase() ===
                                                                  "pending"
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-stone-50 text-stone-600 border-stone-200"
                                                        }`}
                                                    >
                                                        {String(row[column])}
                                                    </span>
                                                ) : (
                                                    <span title={formatted}>{formatted}</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default function StudioUserDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const userId = params.id;

    const [data, setData] = useState<StudioUserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function checkRole() {
            try {
                const res = await fetch("/api/auth/me", { signal: controller.signal });
                if (res.ok) {
                    const json = await res.json();
                    if (json.authenticated && json.user) {
                        setIsDeveloper(Boolean(json.user.isDeveloper || json.user.role === "admin"));
                    }
                }
            } catch {
                // Ignore background check failure
            }
        }

        checkRole();

        async function loadDetails() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/studio/activity/users/${encodeURIComponent(userId)}`,
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    },
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load user details.",
                    );
                }

                setData(result as StudioUserDetails);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while loading user details.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadDetails();

        return () => controller.abort();

    }, [userId]);

    const totalRecords = data
        ? activitySections.reduce(
            (total, section) => total + data[section.key].length,
            0,
        )
        : 0;

    const modalUser: StudioUser | null = data
        ? {
            id: data.user.id,
            displayName: data.user.name,
            email: data.user.email || "",
            lastSeen: null,
            phoneNumber: null,
            emailVerified: false,
            disabled: false,
            role: "author",
            defaultRole: "author",
            projectCount: data.projects.length,
            online: false,
        }
        : null;

    const handleUserUpdated = (updatedUser: StudioUser) => {
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                user: {
                    ...prev.user,
                    name: updatedUser.displayName,
                    email: updatedUser.email,
                },
            };
        });
        setSuccessMessage(
            `User "${updatedUser.displayName}" was successfully updated in the database.`
        );
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    const handlePaymentRecorded = (newPayment: ActivityRecord) => {
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                payments: [newPayment, ...prev.payments],
            };
        });
        const formattedAmt = formatBankAmount(
            newPayment.amount as number | string,
            {
                currency: (newPayment.currency as string) || "USD",
            }
        );
        setSuccessMessage(
            `Payment transaction "${newPayment.transaction_id || newPayment.id}" (${formattedAmt}) was successfully recorded in the database.`
        );
        setTimeout(() => setSuccessMessage(null), 6000);
    };

    const handleUserDeleted = () => {
        router.push("/dashboard/studio/users");
    };

    return (<div className="mx-auto max-w-[1440px] space-y-6">
        <button
            type="button"
            onClick={() => router.push("/dashboard/studio/users")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#FAFAFB]"
        > <FiArrowLeft />
            Back to Studio Users </button>


        <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#E8785A]">
                Studio / Users / Details
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#111111]">
                User Details
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
                Account information, projects, payments, and usage history.
            </p>
        </div>

        {successMessage && (
            <div
                role="status"
                className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in shadow-2xs"
            >
                <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
                <button
                    type="button"
                    onClick={() => setSuccessMessage(null)}
                    className="ml-auto text-emerald-600 hover:text-emerald-900"
                >
                    ×
                </button>
            </div>
        )}

        {error && (
            <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
                <FiAlertCircle className="shrink-0" />
                <span>{error}</span>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="ml-auto inline-flex items-center gap-1 font-semibold"
                >
                    <FiRefreshCw />
                    Retry
                </button>
            </div>
        )}

        {loading ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-16 text-center text-sm text-[#6B7280]">
                Loading user details...
            </div>
        ) : data ? (
            <>
                <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start justify-between">
                        <div className="flex items-start gap-5 min-w-0">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#E8785A]">
                                <FiUser className="h-7 w-7" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2 className="break-words text-xl font-bold text-[#111111]">
                                    {data.user.name}
                                </h2>
                                <p className="mt-1 break-all text-sm text-[#6B7280]">
                                    {data.user.email || "No email available"}
                                </p>

                                <div className="mt-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                                        User ID
                                    </p>
                                    <p className="mt-1 break-all font-mono text-xs text-[#374151]">
                                        {data.user.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Developer Actions */}
                        {isDeveloper && (
                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#e6ac46] bg-[#e8b45a]/10 border border-[#e8b45a59] hover:bg-[#e8b45a35] transition-colors shadow-2xs"
                                >
                                    <FiEdit2 className="w-3.5 h-3.5 text-[#e8b45a]" />
                                    <span>Edit User</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50/70 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors shadow-2xs"
                                >
                                    <FiTrash2 className="w-3.5 h-3.5" />
                                    <span>Delete User</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#6B7280]">Projects</p>
                            <FiFolder className="h-5 w-5 text-[#E8785A]" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-[#111111]">
                            {data.projects.length.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#6B7280]">
                                Payments
                            </p>
                            <FiCreditCard className="h-5 w-5 text-[#E8785A]" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-[#111111]">
                            {data.payments.length.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#6B7280]">
                                Activity Records
                            </p>
                            <FiCalendar className="h-5 w-5 text-[#E8785A]" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-[#111111]">
                            {totalRecords.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {activitySections.map((section) => (
                        <ActivitySection
                            key={section.key}
                            title={section.title}
                            icon={section.icon}
                            rows={data[section.key]}
                            actionButton={
                                section.key === "payments" && isDeveloper ? (
                                    <button
                                        type="button"
                                        onClick={() => setRecordPaymentModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-[#E8785A] bg-[#FFF0EA] border border-[#E8785A]/30 hover:bg-[#E8785A] hover:text-white transition-all shadow-2xs"
                                        title="Record an audited payment transaction for this user"
                                    >
                                        <FiPlus className="w-3.5 h-3.5" />
                                        <span>Record Payment</span>
                                    </button>
                                ) : null
                            }
                        />
                    ))}
                </div>
            </>
        ) : (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-12 text-center">
                <FiAlertCircle className="mx-auto h-8 w-8 text-[#9CA3AF]" />
                <h2 className="mt-3 text-base font-bold text-[#111111]">
                    User not found
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                    This account may no longer exist or could not be loaded.
                </p>
            </div>
        )}

        {/* Edit User Modal */}
        <EditUserModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            user={modalUser}
            onUserUpdated={handleUserUpdated}
        />

        {/* Delete User Modal */}
        <DeleteUserModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            user={modalUser}
            onUserDeleted={handleUserDeleted}
        />

        {/* Record Payment Transaction Modal */}
        {data && (
            <RecordPaymentModal
                isOpen={recordPaymentModalOpen}
                onClose={() => setRecordPaymentModalOpen(false)}
                userId={data.user.id}
                userName={data.user.name}
                onPaymentRecorded={handlePaymentRecorded}
            />
        )}
    </div>
    );
}
