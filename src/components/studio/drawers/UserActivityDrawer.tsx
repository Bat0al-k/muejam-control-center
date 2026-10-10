
// "use client";

// import React, { useEffect, useState } from "react";
// import { useStudio } from "@/features/studio/context";
// import {
//     FiX,
//     FiUser,
//     FiCreditCard,
//     FiFolder,
//     FiActivity,
//     FiRefreshCw,
// } from "react-icons/fi";

// interface UserDetails {
//     user: {
//         id: string;
//         name: string;
//         email: string | null;
//     };
//     projects: unknown[];
//     payments: unknown[];
//     aiUsage: unknown[];
//     ttsRequests: unknown[];
//     usageLogs: unknown[];
//     transcriptionUsage: unknown[];
//     voiceGenerations: unknown[];
// }

// function getRows(value: unknown): Record<string, unknown>[] {
//     if (!Array.isArray(value)) return [];

//     return value.filter(
//         (item): item is Record<string, unknown> =>
//             item !== null &&
//             typeof item === "object" &&
//             !Array.isArray(item),
//     );
// }

// function formatValue(key: string, value: unknown): string {
//     if (value === null || value === undefined || value === "") {
//         return "—";
//     }

//     if (
//         typeof value === "string" &&
//         (key.endsWith("_at") || key === "createdAt")
//     ) {
//         const date = new Date(value);

//         if (!Number.isNaN(date.getTime())) {
//             return date.toLocaleString();
//         }
//     }

//     if (typeof value === "object") {
//         return JSON.stringify(value);
//     }

//     return String(value);
// }

// function ActivitySection({
//     title,
//     rows,
// }: {
//     title: string;
//     rows: unknown;
// }) {
//     const records = getRows(rows);

//     return (
//         <section className="overflow-hidden rounded-xl border border-gray-200">
//             <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
//                 <h3 className="font-semibold text-gray-900">{title}</h3>
//                 <span className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600">
//                     {records.length}
//                 </span>
//             </div>

//             {records.length === 0 ? (
//                 <p className="px-4 py-5 text-sm text-gray-500">
//                     No records found for this section.
//                 </p>
//             ) : (
//                 <div className="divide-y divide-gray-100">
//                     {records.map((record, index) => (
//                         <details
//                             key={
//                                 typeof record.id === "string"
//                                     ? record.id
//                                     : `${title}-${index}`
//                             }
//                             className="group px-4 py-3"
//                         >
//                             <summary className="cursor-pointer list-none">
//                                 <div className="flex items-start justify-between gap-3">
//                                     <span className="break-words text-sm font-medium text-gray-800">
//                                         {String(
//                                             record.operation ??
//                                             record.action ??
//                                             record.name ??
//                                             record.status ??
//                                             record.transaction_id ??
//                                             record.id ??
//                                             `Record ${index + 1}`,
//                                         )}
//                                     </span>

//                                     <span className="shrink-0 text-xs text-gray-500">
//                                         {formatValue(
//                                             "created_at",
//                                             record.created_at ??
//                                             record.crated_at,
//                                         )}
//                                     </span>
//                                 </div>
//                             </summary>

//                             <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                                 {Object.entries(record).map(([key, value]) => (
//                                     <div
//                                         key={key}
//                                         className="min-w-0 rounded-lg bg-gray-50 p-3"
//                                     >
//                                         <dt className="text-xs text-gray-500">
//                                             {key.replaceAll("_", " ")}
//                                         </dt>
//                                         <dd className="mt-1 break-words text-sm text-gray-800">
//                                             {formatValue(key, value)}
//                                         </dd>
//                                     </div>
//                                 ))}
//                             </dl>
//                         </details>
//                     ))}
//                 </div>
//             )}
//         </section>
//     );
// }

// export function UserActivityDrawer() {
//     const { activeDrawer, closeDrawer } = useStudio();
//     // useEffect(() => {
//     //     console.log("UserActivityDrawer activeDrawer:", activeDrawer);
//     // }, [activeDrawer]);

//     const userId =
//         activeDrawer?.type === "userActivity"
//             ? activeDrawer.userId
//             : null;

//     const [data, setData] = useState<UserDetails | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (!userId) {
//             setData(null);
//             setLoading(false);
//             return;
//         }

//         const controller = new AbortController();

//         async function loadDetails() {
//             setLoading(true);
//             setError("");
//             setData(null);

//             try {
//                 if (!userId) {
//                     setData(null);
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await fetch(
//                     `/api/studio/activity/users/${encodeURIComponent(userId)}`,
//                     {
//                         cache: "no-store",
//                         signal: controller.signal,
//                     },
//                 );

//                 if (!response.ok) {
//                     throw new Error(
//                         response.status === 404
//                             ? "User not found."
//                             : "Failed to load user details.",
//                     );
//                 }

//                 const result: UserDetails = await response.json();
//                 setData(result);
//             } catch (err) {
//                 if (
//                     err instanceof Error &&
//                     err.name === "AbortError"
//                 ) {
//                     return;
//                 }

//                 setError(
//                     err instanceof Error
//                         ? err.message
//                         : "Something went wrong.",
//                 );
//             } finally {
//                 if (!controller.signal.aborted) {
//                     setLoading(false);
//                 }
//             }
//         }

//         void loadDetails();

//         return () => controller.abort();
//     }, [userId]);

//     if (!userId) return null;

//     return (
//         <div
//             className="fixed inset-0 z-[100] flex justify-end bg-[#111111]/40 backdrop-blur-[2px]"
//             onClick={closeDrawer}
//         >
//             <aside
//                 role="dialog"
//                 aria-modal="true"
//                 aria-label="Studio user activity details"
//                 onClick={(event) => event.stopPropagation()}
//                 className="flex h-full w-full max-w-3xl flex-col border-l border-[#E8E2D9] bg-[#FAF8F5] shadow-2xl"
//             >
//                 <header className="flex items-start justify-between gap-4 border-b border-[#E8E2D9] bg-[#FAF8F5] p-5 sm:p-6">
//                     <div className="flex min-w-0 items-start gap-3">
//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E4DDF7] bg-[#ebfaec] text-[#205b3c]">
//                             <FiUser size={20} />
//                         </div>

//                         <div className="min-w-0">
//                             <h2 className="break-words text-lg font-extrabold tracking-tight text-[#111111]">
//                                 {data?.user.name ?? "User activity"}
//                             </h2>
//                             <p className="mt-1 break-all text-sm text-[#6B7280]">
//                                 {data?.user.email ?? userId}
//                             </p>
//                             <p className="mt-1 break-all font-mono text-xs text-gray-400">
//                                 {userId}
//                             </p>
//                         </div>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={closeDrawer}
//                         aria-label="Close drawer"
//                         className="rounded-lg border border-[#E8E2D9] p-2 text-[#6B7280] transition-colors hover:border-[#D8CFC3] hover:bg-[#F0EBE3] hover:text-[#111111]"
//                     >
//                         <FiX size={20} />
//                     </button>
//                 </header>

//                 <div className="flex-1 space-y-5 overflow-y-auto bg-[#FAF8F5] p-5 sm:p-6">
//                     {loading && (
//                         <div className="flex items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-4 py-8 text-sm text-[#6B7280]">
//                             <FiRefreshCw className="animate-spin" />
//                             Loading user records...
//                         </div>
//                     )}

//                     {error && (
//                         <div className="rounded-xl border border-[#E8C7C3] bg-[#FBEEEC] p-4 text-sm text-[#A33D35]">
//                             {error}
//                         </div>
//                     )}

//                     {data && (
//                         <>
//                             <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 transition-colors sm:grid-cols-3">
//                                 <div className="rounded-xl border border-gray-200 p-4">
//                                     <FiFolder className="mb-3 text-[#7356B5]" />
//                                     <p className="text-2xl font-bold text-gray-900">
//                                         {data.projects.length}
//                                     </p>
//                                     <p className="mt-1 text-xs text-gray-500">
//                                         Projects
//                                     </p>
//                                 </div>

//                                 <div className="rounded-xl border border-gray-200 p-4">
//                                     <FiCreditCard className="mb-3 text-emerald-600" />
//                                     <p className="text-2xl font-bold text-gray-900">
//                                         {data.payments.length}
//                                     </p>
//                                     <p className="mt-1 text-xs text-gray-500">
//                                         Payments
//                                     </p>
//                                 </div>

//                                 <div className="rounded-xl border border-gray-200 p-4">
//                                     <FiActivity className="mb-3 text-[#b57547]" />
//                                     <p className="text-2xl font-bold text-gray-900">
//                                         {data.aiUsage.length +
//                                             data.ttsRequests.length +
//                                             data.usageLogs.length +
//                                             data.transcriptionUsage.length +
//                                             data.voiceGenerations.length}
//                                     </p>
//                                     <p className="mt-1 text-xs text-gray-500">
//                                         Usage records
//                                     </p>
//                                 </div>
//                             </div>

//                             <ActivitySection
//                                 title="Projects"
//                                 rows={data.projects}
//                             />
//                             <ActivitySection
//                                 title="Payments & Transactions"
//                                 rows={data.payments}
//                             />
//                             <ActivitySection
//                                 title="AI Usage"
//                                 rows={data.aiUsage}
//                             />
//                             <ActivitySection
//                                 title="Voice Generations"
//                                 rows={data.voiceGenerations}
//                             />
//                             <ActivitySection
//                                 title="Text-to-Speech Requests"
//                                 rows={data.ttsRequests}
//                             />
//                             <ActivitySection
//                                 title="Character Usage Logs"
//                                 rows={data.usageLogs}
//                             />
//                             <ActivitySection
//                                 title="Transcription Usage"
//                                 rows={data.transcriptionUsage}
//                             />
//                         </>
//                     )}
//                 </div>
//             </aside>
//         </div>
//     );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useStudio } from "@/features/studio/context";
import {
    FiX,
    FiUser,
    FiCreditCard,
    FiFolder,
    FiActivity,
    FiRefreshCw,
} from "react-icons/fi";

interface UserDetails {
    user: {
        id: string;
        name: string;
        email: string | null;
    };
    projects: unknown[];
    payments: unknown[];
    aiUsage: unknown[];
    ttsRequests: unknown[];
    usageLogs: unknown[];
    transcriptionUsage: unknown[];
    voiceGenerations: unknown[];
}

function getRows(value: unknown): Record<string, unknown>[] {
    if (!Array.isArray(value)) return [];


    return value.filter(
        (item): item is Record<string, unknown> =>
            item !== null &&
            typeof item === "object" &&
            !Array.isArray(item),
    );


}

function formatValue(key: string, value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (
        typeof value === "string" &&
        (key.endsWith("_at") || key === "createdAt")
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
    rows,
}: {
    title: string;
    rows: unknown;
}) {
    const records = getRows(rows);


    return (
        <section className="overflow-hidden rounded-xl border border-[#E8E2D9] bg-white shadow-sm shadow-[#292621]/[0.02]">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] bg-[#F3EFE8] px-4 py-3">
                <h3 className="font-bold text-[#22201D]">{title}</h3>

                <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1 text-xs font-semibold tabular-nums text-[#6B645B]">
                    {records.length}
                </span>
            </div>

            {records.length === 0 ? (
                <p className="px-4 py-5 text-sm text-[#77716A]">
                    No records found for this section.
                </p>
            ) : (
                <div className="divide-y divide-[#EEE9E1]">
                    {records.map((record, index) => (
                        <details
                            key={
                                typeof record.id === "string"
                                    ? record.id
                                    : `${title}-${index}`
                            }
                            className="group px-4 py-3 transition-colors hover:bg-[#FCFAF7]"
                        >
                            <summary className="cursor-pointer list-none">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="break-words text-sm font-semibold text-[#292621]">
                                        {String(
                                            record.operation ??
                                            record.action ??
                                            record.name ??
                                            record.status ??
                                            record.transaction_id ??
                                            record.id ??
                                            `Record ${index + 1}`,
                                        )}
                                    </span>

                                    <span className="shrink-0 text-xs tabular-nums text-[#8B857D]">
                                        {formatValue(
                                            "created_at",
                                            record.created_at ??
                                            record.crated_at,
                                        )}
                                    </span>
                                </div>
                            </summary>

                            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {Object.entries(record).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="min-w-0 rounded-lg border border-[#EEE9E1] bg-[#FAF8F5] p-3"
                                    >
                                        <dt className="text-xs font-medium capitalize text-[#77716A]">
                                            {key.replaceAll("_", " ")}
                                        </dt>

                                        <dd className="mt-1 break-words text-sm text-[#292621]">
                                            {formatValue(key, value)}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </details>
                    ))}
                </div>
            )}
        </section>
    );

}

export function UserActivityDrawer() {
    const { activeDrawer, closeDrawer } = useStudio();

    const userId =
        activeDrawer?.type === "userActivity"
            ? activeDrawer.userId
            : null;

    const [data, setData] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) {
            setData(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function loadDetails() {
            setLoading(true);
            setError("");
            setData(null);

            try {
                if (!userId) {
                    setData(null);
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `/api/studio/activity/users/${encodeURIComponent(userId)}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        response.status === 404
                            ? "User not found."
                            : "Failed to load user details.",
                    );
                }

                const result: UserDetails = await response.json();
                setData(result);
            } catch (err) {
                if (
                    err instanceof Error &&
                    err.name === "AbortError"
                ) {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadDetails();

        return () => controller.abort();
    }, [userId]);

    if (!userId) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex h-dvh w-full justify-end overflow-hidden bg-[#111111]/45 backdrop-blur-[2px]"
            onClick={closeDrawer}
        >
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Studio user activity details"
                onClick={(event) => event.stopPropagation()}
                className="flex h-full min-h-0 w-full max-w-2xl flex-col border-l border-[#E8E2D9] bg-[#FAF8F5] shadow-2xl"
            >
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#E8E2D9] bg-[#FAF8F5] p-5 sm:p-6">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E4DDF7] bg-[#F0EBFA] text-[#7356B5]">
                            <FiUser size={20} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="break-words text-lg font-extrabold tracking-tight text-[#111111]">
                                {data?.user.name ?? "User activity"}
                            </h2>

                            <p className="mt-1 break-all text-sm text-[#6B7280]">
                                {data?.user.email ?? userId}
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-[#8B857D]">
                                {userId}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closeDrawer}
                        aria-label="Close drawer"
                        className="shrink-0 rounded-lg border border-[#E8E2D9] p-2 text-[#6B7280] transition-colors hover:border-[#D8CFC3] hover:bg-[#F0EBE3] hover:text-[#111111]"
                    >
                        <FiX size={20} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-[#FAF8F5] p-5 sm:p-6">
                    {loading && (
                        <div className="flex items-center gap-2 rounded-xl border border-[#E8E2D9] bg-white px-4 py-8 text-sm text-[#6B7280]">
                            <FiRefreshCw className="animate-spin" />
                            Loading user records...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-[#E8C7C3] bg-[#FBEEEC] p-4 text-sm text-[#A33D35]">
                            {error}
                        </div>
                    )}

                    {data && (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 transition-colors hover:border-[#D8CFC3]">
                                    <FiFolder className="mb-3 text-[#7356B5]" />

                                    <p className="text-2xl font-extrabold tabular-nums text-[#111111]">
                                        {data.projects.length}
                                    </p>

                                    <p className="mt-1 text-xs font-medium text-[#77716A]">
                                        Projects
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 transition-colors hover:border-[#D8CFC3]">
                                    <FiCreditCard className="mb-3 text-[#478568]" />

                                    <p className="text-2xl font-extrabold tabular-nums text-[#111111]">
                                        {data.payments.length}
                                    </p>

                                    <p className="mt-1 text-xs font-medium text-[#77716A]">
                                        Payments
                                    </p>
                                </div>

                                <div className="col-span-2 rounded-xl border border-[#E8E2D9] bg-white p-4 transition-colors hover:border-[#D8CFC3] sm:col-span-1">
                                    <FiActivity className="mb-3 text-[#4779B5]" />

                                    <p className="text-2xl font-extrabold tabular-nums text-[#111111]">
                                        {data.aiUsage.length +
                                            data.ttsRequests.length +
                                            data.usageLogs.length +
                                            data.transcriptionUsage.length +
                                            data.voiceGenerations.length}
                                    </p>

                                    <p className="mt-1 text-xs font-medium text-[#77716A]">
                                        Usage records
                                    </p>
                                </div>
                            </div>

                            <ActivitySection
                                title="Projects"
                                rows={data.projects}
                            />

                            <ActivitySection
                                title="Payments & Transactions"
                                rows={data.payments}
                            />

                            <ActivitySection
                                title="AI Usage"
                                rows={data.aiUsage}
                            />

                            <ActivitySection
                                title="Voice Generations"
                                rows={data.voiceGenerations}
                            />

                            <ActivitySection
                                title="Text-to-Speech Requests"
                                rows={data.ttsRequests}
                            />

                            <ActivitySection
                                title="Character Usage Logs"
                                rows={data.usageLogs}
                            />

                            <ActivitySection
                                title="Transcription Usage"
                                rows={data.transcriptionUsage}
                            />
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
}
