// "use client";

// import React, { useState } from "react";
// import { DrawerShell } from "./DrawerShell";
// import { useStudio } from "@/features/studio/context";
// import {
//   FiCheck,
//   FiTerminal,
//   FiXCircle,
//   FiRotateCw,
//   FiEye,
//   FiCopy,
//   FiCheckCircle,
//   FiAlertTriangle,
// } from "react-icons/fi";

// export function PipelineDetailsDrawer() {
//   const {
//     activeDrawer,
//     closeDrawer,
//     activePipelines,
//     openModal,
//     retryPipeline,
//     showToast,
//   } = useStudio();

//   const [showLogs, setShowLogs] = useState(false);
//   const [copiedLogs, setCopiedLogs] = useState(false);

//   const isOpen = activeDrawer?.type === "pipelineDetails";
//   const pipelineId = isOpen ? activeDrawer.pipelineId : null;

//   const pipeline =
//     activePipelines.find((p) => p.id === pipelineId) || activePipelines[0];

//   if (!pipeline) return null;

//   const isActive = pipeline.status === "Processing" || pipeline.status === "Queued";
//   const isFailedOrTimeout = pipeline.status === "Failed" || pipeline.status === "Timeout";
//   const isCompleted = pipeline.status === "Completed";
//   const isCancelled = pipeline.status === "Cancelled";

//   const getStatusBadge = () => {
//     switch (pipeline.status) {
//       case "Processing":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
//             <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
//             {pipeline.progress}% · ETA {pipeline.eta}
//           </span>
//         );
//       case "Queued":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
//             <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
//             Queued · Position #{pipeline.queuePosition || 4}
//           </span>
//         );
//       case "Completed":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//             <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
//             Completed
//           </span>
//         );
//       case "Timeout":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
//             <FiAlertTriangle className="w-3.5 h-3.5 text-red-600" />
//             Timeout
//           </span>
//         );
//       case "Failed":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
//             <FiXCircle className="w-3.5 h-3.5 text-red-600" />
//             Failed
//           </span>
//         );
//       case "Cancelled":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
//             Cancelled
//           </span>
//         );
//     }
//   };

//   const handleCopyLogs = () => {
//     const logText = pipeline.logs
//       .map((l) => `${l.timestamp} [${l.level}] ${l.message}`)
//       .join("\n");
//     navigator.clipboard.writeText(logText);
//     setCopiedLogs(true);
//     showToast("info", "Execution logs copied to clipboard");
//     setTimeout(() => setCopiedLogs(false), 2000);
//   };

//   return (
//     <DrawerShell
//       isOpen={isOpen}
//       onClose={closeDrawer}
//       title={`${pipeline.name}`}
//       subtitle={`Job ${pipeline.jobId} · Triggered by ${pipeline.user}`}
//       badge={getStatusBadge()}
//       footer={
//         <div className="flex items-center justify-between w-full gap-2">
//           <button
//             onClick={() => setShowLogs(!showLogs)}
//             className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${showLogs
//                 ? "bg-[#1E293B] text-white border-slate-700"
//                 : "bg-white text-[#374151] border-[#D1D5DB] hover:bg-[#F9FAFB]"
//               }`}
//           >
//             <FiTerminal className="w-3.5 h-3.5" />
//             {showLogs ? "Hide Logs" : "View Logs"}
//           </button>

//           <div className="flex items-center gap-2">
//             {isActive && (
//               <button
//                 onClick={() => openModal({ type: "cancelPipeline", pipelineId: pipeline.id })}
//                 className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors"
//               >
//                 <FiXCircle className="w-3.5 h-3.5" />
//                 Cancel Job
//               </button>
//             )}

//             {isFailedOrTimeout && (
//               <button
//                 onClick={() => retryPipeline(pipeline.id)}
//                 className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E8785A] text-white hover:bg-[#D96948] rounded-xl text-xs font-semibold transition-colors"
//               >
//                 <FiRotateCw className="w-3.5 h-3.5" />
//                 Retry
//               </button>
//             )}

//             {isCompleted && (
//               <button
//                 onClick={() => openModal({ type: "pipelineOutput", pipelineId: pipeline.id })}
//                 className="flex items-center gap-1.5 px-3.5 py-2 bg-[#059669] text-white hover:bg-[#047857] rounded-xl text-xs font-semibold transition-colors"
//               >
//                 <FiEye className="w-3.5 h-3.5" />
//                 View Output
//               </button>
//             )}
//           </div>
//         </div>
//       }
//     >
//       {/* Basic Information Card */}
//       <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
//         <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
//           Pipeline Specifications
//         </h4>
//         <div className="grid grid-cols-2 gap-3 text-xs">
//           <div>
//             <span className="text-[#6B7280] block mb-0.5">Feature Type</span>
//             <span className="font-semibold text-[#111111]">{pipeline.feature}</span>
//           </div>
//           <div>
//             <span className="text-[#6B7280] block mb-0.5">Job ID</span>
//             <span className="font-mono font-bold text-[#E8785A]">{pipeline.jobId}</span>
//           </div>
//           <div>
//             <span className="text-[#6B7280] block mb-0.5">User Account</span>
//             <span className="font-semibold text-[#111111]">{pipeline.user}</span>
//             <span className="text-[10px] text-[#6B7280] ml-1">({pipeline.userRole})</span>
//           </div>
//           <div>
//             <span className="text-[#6B7280] block mb-0.5">Credits Consumed</span>
//             <span className="font-mono font-bold text-[#111111]">
//               {pipeline.credits} credits
//             </span>
//           </div>
//           <div>
//             <span className="text-[#6B7280] block mb-0.5">Started At</span>
//             <span className="font-medium text-[#111111]">{pipeline.startedAt}</span>
//           </div>
//           <div>
//             <span className="text-[#6B7280] block mb-0.5">Current Duration</span>
//             <span className="font-medium text-[#111111]">{pipeline.duration}</span>
//           </div>
//           <div className="col-span-2 pt-1 border-t border-[#E5E7EB] flex items-center justify-between">
//             <span className="text-[#6B7280]">Cluster Worker Node:</span>
//             <span className="font-mono font-medium text-[#111111] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
//               {pipeline.clusterNode}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Execution Progress & Multi-step Workflow */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
//               Execution Progress
//             </h4>
//             <p className="text-[11px] text-[#6B7280] mt-0.5">
//               Represents execution workflow lifecycle of this specific job
//             </p>
//           </div>
//           <span className="text-lg font-bold font-syne text-[#111111]">
//             {pipeline.progress}% Complete
//           </span>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
//           <div
//             className={`h-full rounded-full transition-all duration-500 ${isFailedOrTimeout
//                 ? "bg-red-500"
//                 : isCompleted
//                   ? "bg-emerald-500"
//                   : isCancelled
//                     ? "bg-slate-400"
//                     : "bg-[#E8785A]"
//               }`}
//             style={{ width: `${pipeline.progress}%` }}
//           />
//         </div>

//         {/* Workflow Steps List */}
//         <div className="pt-2 space-y-3">
//           {pipeline.steps.map((step, idx) => {
//             const isStepDone = step.status === "completed";
//             const isStepActive = step.status === "active";

//             return (
//               <div key={idx} className="flex items-start gap-3 text-xs">
//                 {/* Step Icon */}
//                 <div className="pt-0.5">
//                   {isStepDone ? (
//                     <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
//                       <FiCheck className="w-3 h-3 stroke-[3]" />
//                     </div>
//                   ) : isStepActive ? (
//                     <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
//                       <span className="w-2 h-2 rounded-full bg-blue-600" />
//                     </div>
//                   ) : (
//                     <div className="w-5 h-5 rounded-full border-2 border-[#D1D5DB] bg-white flex items-center justify-center" />
//                   )}
//                 </div>

//                 {/* Step Text */}
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={`font-semibold ${isStepActive
//                           ? "text-[#111111]"
//                           : isStepDone
//                             ? "text-[#4B5563]"
//                             : "text-[#9CA3AF]"
//                         }`}
//                     >
//                       {step.name}
//                     </span>
//                     {step.duration && (
//                       <span className="text-[10px] text-[#6B7280]">
//                         {step.duration}
//                       </span>
//                     )}
//                   </div>
//                   {isStepActive && (
//                     <span className="text-[10px] text-blue-600 font-medium">
//                       Currently processing on GPU stream...
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Nested Logs Section */}
//       {showLogs && (
//         <div className="bg-[#0F172A] rounded-2xl p-4 text-xs font-mono text-slate-200 space-y-3 border border-slate-800 shadow-inner">
//           <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
//             <div className="flex items-center gap-2">
//               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
//               <span className="text-[11px] font-bold text-slate-300">
//                 Worker Execution Stream
//               </span>
//             </div>
//             <button
//               onClick={handleCopyLogs}
//               className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
//             >
//               <FiCopy className="w-3.5 h-3.5" />
//               {copiedLogs ? "Copied" : "Copy"}
//             </button>
//           </div>

//           <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-[11px] leading-relaxed">
//             {pipeline.logs.map((log, index) => (
//               <div key={index} className="flex items-start gap-2">
//                 <span className="text-slate-500 shrink-0">{log.timestamp}</span>
//                 <span
//                   className={`font-bold shrink-0 ${log.level === "ERROR"
//                       ? "text-red-400"
//                       : log.level === "WARN"
//                         ? "text-amber-400"
//                         : "text-blue-400"
//                     }`}
//                 >
//                   [{log.level}]
//                 </span>
//                 <span className="text-slate-300 break-all">{log.message}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </DrawerShell>
//   );
// }



"use client";

import { useStudio } from "@/features/studio/context";
import { DrawerShell } from "./DrawerShell";

type PipelineDetails = {
  title: string;
  feature: string;
  status: string;
  createdAt: string;
  details: { label: string; value: string }[];
  error?: string | null;
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return String(value);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString();
}

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (["completed", "complete", "success", "succeeded"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }

  if (["processing", "running"].includes(normalized)) {
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }

  if (["queued", "pending"].includes(normalized)) {
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  if (["failed", "error", "timeout"].includes(normalized)) {
    return "bg-red-500/10 text-red-400 border-red-500/20";
  }

  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export function PipelineDetailsDrawer() {
  const { activeDrawer, closeDrawer, featureUsage } = useStudio();

  const isOpen = activeDrawer?.type === "pipelineDetails";
  const pipelineId = isOpen ? activeDrawer.pipelineId : null;

  let pipeline: PipelineDetails | null = null;

  if (pipelineId && featureUsage) {
    const separatorIndex = pipelineId.indexOf(":");
    const feature = pipelineId.slice(0, separatorIndex);
    const recordId = pipelineId.slice(separatorIndex + 1);

    if (separatorIndex !== -1 && recordId) {
      if (feature === "image") {
        const record = featureUsage.imageRecent.find(
          (item) => item.id === recordId,
        );

        if (record) {
          pipeline = {
            title: record.name || "Image Generation",
            feature: "Image Generation",
            status: record.status,
            createdAt: record.created_at,
            details: [
              { label: "Record ID", value: record.id },
              { label: "Category", value: formatValue(record.category) },
              { label: "Model Version", value: formatValue(record.model_version) },
              { label: "Width", value: formatValue(record.width) },
              { label: "Height", value: formatValue(record.height) },
              { label: "Format", value: formatValue(record.mime_type) },
              { label: "Size (bytes)", value: formatValue(record.size_bytes) },
              { label: "Indexed At", value: formatDate(record.indexed_at) },
              { label: "Created At", value: formatDate(record.created_at) },
            ],
            error: record.error_message,
          };
        }
      } else if (feature === "text") {
        const record = featureUsage.aiTextRecent.find(
          (item) => item.id === recordId,
        );

        if (record) {
          pipeline = {
            title: record.operation || "AI Text Generation",
            feature: "AI Text Generation",
            status: "Recorded",
            createdAt: record.created_at,
            details: [
              { label: "Record ID", value: record.id },
              { label: "Operation", value: formatValue(record.operation) },
              { label: "Model", value: formatValue(record.model) },
              { label: "Prompt Tokens", value: formatValue(record.prompt_tokens) },
              { label: "Completion Tokens", value: formatValue(record.completion_tokens) },
              { label: "Total Tokens", value: formatValue(record.total_tokens) },
              { label: "Cost (USD)", value: formatValue(record.total_cost_usd) },
              { label: "Created At", value: formatDate(record.created_at) },
            ],
          };
        }
      } else if (feature === "voice") {
        const record = featureUsage.voiceRecent.find(
          (item) => item.id === recordId,
        );

        if (record) {
          pipeline = {
            title: record.voice_name || "Voice Generation",
            feature: "Voice Generation",
            status: "Recorded",
            createdAt: record.created_at || "",
            details: [
              { label: "Record ID", value: record.id },
              { label: "Voice", value: formatValue(record.voice_name) },
              { label: "Provider", value: formatValue(record.provider) },
              { label: "Model ID", value: formatValue(record.model_id) },
              { label: "Text", value: formatValue(record.text_content) },
              { label: "Created At", value: formatDate(record.created_at) },
            ],
          };
        }
      }
    }

  }

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title={pipeline?.title || "Pipeline Details"}
      subtitle={pipeline?.feature || "Selected job"}
      badge={
        pipeline ? (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(pipeline.status)}`}
          > <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {pipeline.status} </span>
        ) : null
      }

    >
      {!pipeline ? (

        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#FAFAFB] p-6 text-center">
          <p className="text-sm font-semibold text-[#374151]">
            Record not found
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            This record may not be included in the currently loaded data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pipeline Specifications */}
          <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Pipeline Specifications
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="min-w-0">
                <span className="text-[#6B7280] block mb-1">
                  Feature Type
                </span>
                <span className="font-semibold text-[#111111]">
                  {pipeline.feature}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-[#6B7280] block mb-1">
                  Record ID
                </span>
                <span className="font-mono font-bold text-[#E8785A] break-all">
                  {pipeline.details.find(
                    (item) => item.label === "Record ID",
                  )?.value || "Not available"}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-[#6B7280] block mb-1">
                  Status
                </span>
                <span className="font-semibold text-[#111111]">
                  {pipeline.status}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-[#6B7280] block mb-1">
                  Created At
                </span>
                <span className="font-medium text-[#111111]">
                  {formatDate(pipeline.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Record Details */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Record Details
              </h4>
              <p className="text-[11px] text-[#6B7280] mt-1">
                Actual fields returned by the Studio API.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pipeline.details
                .filter(
                  (item) =>
                    item.label !== "Record ID" &&
                    item.label !== "Created At",
                )
                .map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] p-3"
                  >
                    <span className="text-[#6B7280] block text-[11px] mb-1.5">
                      {item.label}
                    </span>

                    <span className="block text-sm font-semibold text-[#111111] break-words whitespace-pre-wrap">
                      {item.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Error Details */}
          {pipeline.error && (
            <div className="border border-red-200 bg-red-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                  Error Message
                </p>
              </div>

              <p className="text-sm text-red-700 break-words whitespace-pre-wrap">
                {pipeline.error}
              </p>
            </div>
          )}
        </div>
      )}
    </DrawerShell>
  );
}
