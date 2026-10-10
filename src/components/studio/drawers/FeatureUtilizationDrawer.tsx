// "use client";

// import React from "react";
// import { DrawerShell } from "./DrawerShell";
// import { useStudio } from "@/features/studio/context";
// import { FiCpu, FiCheckCircle, FiClock, FiActivity, FiArrowRight } from "react-icons/fi";

// export function FeatureUtilizationDrawer() {
//   const { activeDrawer, closeDrawer, featureUtilization, openDrawer, showToast } = useStudio();

//   const isOpen = activeDrawer?.type === "featureUtilization";
//   const featureId = isOpen ? activeDrawer.featureId : null;

//   const feature = featureUtilization.find((f) => f.id === featureId) || featureUtilization[0];

//   const handleViewPipelines = () => {
//     // Open the first active pipeline related to this feature or general pipeline drawer
//     if (feature.id === "video-gen") {
//       openDrawer({ type: "pipelineDetails", pipelineId: "3851" });
//     } else if (feature.id === "voice-speech") {
//       openDrawer({ type: "pipelineDetails", pipelineId: "3847" });
//     } else if (feature.id === "image-gen") {
//       openDrawer({ type: "pipelineDetails", pipelineId: "3842" });
//     } else {
//       openDrawer({ type: "pipelineDetails", pipelineId: "3842" });
//     }
//     showToast("info", `Filtered active generative pipelines for ${feature.name}`);
//   };

//   return (
//     <DrawerShell
//       isOpen={isOpen}
//       onClose={closeDrawer}
//       title={feature.name}
//       subtitle="Feature combustion volume, sub-model allocation, and processing latency"
//       badge={
//         <span
//           className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
//           style={{ backgroundColor: feature.color }}
//         >
//           {feature.percentage}% Share
//         </span>
//       }
//       footer={
//         <button
//           onClick={handleViewPipelines}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D96948] transition-colors shadow-sm"
//         >
//           View Related Pipelines
//           <FiArrowRight className="w-4 h-4" />
//         </button>
//       }
//     >
//       {/* Metric Cards Grid */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
//           <span className="text-[11px] text-[#6B7280] block mb-1">Credits Consumed</span>
//           <span className="text-xl font-bold font-syne text-[#111111]">
//             {feature.credits.toLocaleString()}
//           </span>
//           <span className="text-[10px] text-[#6B7280] mt-1 block">
//             {feature.percentage}% of studio pool
//           </span>
//         </div>

//         <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
//           <span className="text-[11px] text-[#6B7280] block mb-1">Total Generations</span>
//           <span className="text-xl font-bold font-syne text-[#111111]">
//             {feature.generationsCount.toLocaleString()}
//           </span>
//           <span className="text-[10px] text-emerald-600 mt-1 block">
//             {feature.successRate}% Success rate
//           </span>
//         </div>

//         <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
//           <span className="text-[11px] text-[#6B7280] block mb-1">Avg Processing Time</span>
//           <span className="text-xl font-bold font-syne text-[#111111]">
//             {feature.avgProcessingTime}
//           </span>
//           <span className="text-[10px] text-[#6B7280] mt-1 block">
//             P95 within SLA targets
//           </span>
//         </div>

//         <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-3.5">
//           <span className="text-[11px] text-[#6B7280] block mb-1">Failed Jobs</span>
//           <span className="text-xl font-bold font-syne text-[#DC2626]">
//             {feature.failedCount}
//           </span>
//           <span className="text-[10px] text-[#6B7280] mt-1 block">
//             Auto-refunded credits
//           </span>
//         </div>
//       </div>

//       {/* Sub-Model Allocation */}
//       <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
//         <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
//           <FiCpu className="w-3.5 h-3.5 text-[#E8785A]" />
//           Sub-Model Load Distribution
//         </h4>
//         <div className="space-y-3 text-xs">
//           {feature.subModels.map((sm) => (
//             <div key={sm.name} className="space-y-1">
//               <div className="flex justify-between text-[#111111] font-medium">
//                 <span>{sm.name}</span>
//                 <span className="text-[#6B7280]">
//                   {sm.share}% · Latency: {sm.latency}
//                 </span>
//               </div>
//               <div className="w-full bg-[#F3F4F6] h-1.5 rounded-full overflow-hidden">
//                 <div
//                   className="h-full rounded-full"
//                   style={{ width: `${sm.share}%`, backgroundColor: feature.color }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Feature Jobs */}
//       <div className="space-y-3">
//         <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
//           <FiActivity className="w-3.5 h-3.5 text-[#6B7280]" />
//           Recent Feature Generations
//         </h4>
//         <div className="divide-y divide-[#F0F0F2] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white text-xs">
//           {feature.recentJobs.map((job) => (
//             <div key={job.id} className="p-3 flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono font-bold text-[#111111]">{job.id}</span>
//                   <span className="font-medium text-[#374151]">{job.user}</span>
//                 </div>
//                 <div className="text-[11px] text-[#6B7280] flex items-center gap-1">
//                   <FiClock className="w-3 h-3" /> {job.time}
//                 </div>
//               </div>
//               <div className="text-right">
//                 <span className="font-mono font-semibold text-[#111111]">
//                   -{job.credits} cr
//                 </span>
//                 <div className="text-[10px] text-emerald-600 flex items-center justify-end gap-1 font-medium">
//                   <FiCheckCircle className="w-3 h-3" /> {job.status}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DrawerShell>
//   );
// }


"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import {
  FiActivity,
  FiClock,
  // FiCpu,
  FiDatabase,
  FiImage,
  FiVideo,
  FiVolume2,
} from "react-icons/fi";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

function formatNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return "Not recorded";

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString()
    : "Not recorded";
}

function formatUsd(value: number | string | null | undefined) {
  if (value == null || value === "") return "Not recorded";

  const number = Number(value);

  if (!Number.isFinite(number)) return "Not recorded";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(number);
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "Not recorded";
  }

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className="max-w-[65%] break-words text-right text-xs font-medium text-[#111111]">
        {value ?? "Not recorded"}
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] p-3.5">
      <span className="mb-1 block text-[11px] text-[#6B7280]">
        {label}
      </span>

      <span className="block break-words font-syne text-xl font-bold text-[#111111]">
        {value}
      </span>

      {hint && (
        <span className="mt-1 block text-[10px] text-[#6B7280]">
          {hint}
        </span>
      )}
    </div>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
      {icon}
      {children}
    </h4>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-[#FAFAFB] px-4 py-6 text-center text-xs text-[#6B7280]">
      {message}
    </div>
  );
}

function RecentCard({
  title,
  subtitle,
  date,
  children,
}: {
  title: string;
  subtitle?: string;
  date: string | null | undefined;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-2 border-b border-[#F0F0F2] p-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="break-words text-xs font-semibold text-[#111111]">
            {title}
          </p>

          {subtitle && (
            <p className="break-words text-[11px] text-[#6B7280]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right text-[10px] text-[#6B7280]">
          <FiClock className="mb-1 ml-auto h-3 w-3" />
          {formatDate(date)}
        </div>
      </div>

      {children && (
        <div className="divide-y divide-[#F3F4F6] border-t border-[#F3F4F6] pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

export function FeatureUtilizationDrawer() {
  const {
    activeDrawer,
    closeDrawer,
    featureUtilization,
    featureUsage,
    featureUsageStatus,
  } = useStudio();

  const isOpen = activeDrawer?.type === "featureUtilization";
  const featureId = isOpen ? activeDrawer.featureId : null;

  const feature =
    featureUtilization.find((item) => item.id === featureId) ??
    featureUtilization[0];

  if (!feature) return null;

  const isLoading = featureUsageStatus === "loading";
  const hasError = featureUsageStatus === "error";
  const hasLiveData = featureUsageStatus === "live" && featureUsage !== null;

  const recentContent = (() => {
    if (!hasLiveData || !featureUsage) return null;

    switch (feature.id) {
      case "ai-text":
        return (
          <div className="space-y-3">
            <SectionTitle icon={<FiActivity className="h-3.5 w-3.5" />}>
              Recent AI operations
            </SectionTitle>

            {featureUsage.aiTextRecent.length === 0 ? (
              <EmptyState message="No AI operations were recorded for this date range." />
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                {featureUsage.aiTextRecent.map((item) => (
                  <RecentCard
                    key={item.id}
                    title={item.operation || "AI operation"}
                    subtitle={`Model: ${item.model || "Not recorded"}`}
                    date={item.created_at}
                  >
                    <Detail
                      label="Prompt tokens"
                      value={formatNumber(item.prompt_tokens)}
                    />
                    <Detail
                      label="Completion tokens"
                      value={formatNumber(item.completion_tokens)}
                    />
                    <Detail
                      label="Total tokens"
                      value={formatNumber(item.total_tokens)}
                    />
                    <Detail
                      label="Recorded cost"
                      value={formatUsd(item.total_cost_usd)}
                    />
                  </RecentCard>
                ))}
              </div>
            )}
          </div>
        );

      case "voice-speech":
        return (
          <div className="space-y-3">
            <SectionTitle icon={<FiVolume2 className="h-3.5 w-3.5" />}>
              Recent voice records
            </SectionTitle>

            {featureUsage.voiceRecent.length === 0 ? (
              <EmptyState message="No voice records were found for this date range." />
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                {featureUsage.voiceRecent.map((item) => (
                  <RecentCard
                    key={item.id}
                    title={item.voice_name || "Unnamed voice"}
                    subtitle={`Provider: ${item.provider || "Not recorded"}`}
                    date={item.created_at}
                  >
                    <Detail
                      label="Model ID"
                      value={item.model_id || "Not recorded"}
                    />
                    <Detail
                      label="Text length"
                      value={`${item.text_content.length.toLocaleString()} characters`}
                    />
                  </RecentCard>
                ))}
              </div>
            )}
          </div>
        );

      case "video-gen":
        return (
          <div className="space-y-3">
            <SectionTitle icon={<FiVideo className="h-3.5 w-3.5" />}>
              Recent video records
            </SectionTitle>

            {featureUsage.videoRecent.length === 0 ? (
              <EmptyState message="No video records were found for this date range." />
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                {featureUsage.videoRecent.map((item) => (
                  <RecentCard
                    key={item.id}
                    title={item.title || "Untitled video"}
                    date={item.created_at}
                  >
                    <Detail
                      label="Duration"
                      value={
                        item.duration == null
                          ? "Not recorded"
                          : String(item.duration)
                      }
                    />

                    <Detail
                      label="Record ID"
                      value={item.id}
                    />

                    {item.url && (
                      <Detail
                        label="Video URL"
                        value={
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D96948] underline"
                          >
                            Open video
                          </a>
                        }
                      />
                    )}
                  </RecentCard>
                ))}
              </div>
            )}
          </div>
        );

      case "image-gen":
        return (
          <div className="space-y-3">
            <SectionTitle icon={<FiImage className="h-3.5 w-3.5" />}>
              Recent indexed images
            </SectionTitle>

            {featureUsage.imageRecent.length === 0 ? (
              <EmptyState message="No image records were found for this date range." />
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                {featureUsage.imageRecent.map((item) => (
                  <RecentCard
                    key={item.id}
                    title={item.name}
                    subtitle={`Category: ${item.category || "Not recorded"}`}
                    date={item.created_at}
                  >
                    <Detail
                      label="Dimensions"
                      value={`${item.width} × ${item.height}`}
                    />
                    <Detail
                      label="File type"
                      value={item.mime_type}
                    />
                    <Detail
                      label="File size"
                      value={formatBytes(item.size_bytes)}
                    />
                    <Detail
                      label="Indexing status"
                      value={item.status}
                    />
                    <Detail
                      label="Model version"
                      value={item.model_version || "Not recorded"}
                    />
                    <Detail
                      label="Indexed at"
                      value={formatDate(item.indexed_at)}
                    />

                    {item.error_message && (
                      <Detail
                        label="Error"
                        value={item.error_message}
                      />
                    )}
                  </RecentCard>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <EmptyState message="No live database details are available for this feature yet." />
        );
    }
  })();

  const liveMetrics = (() => {
    if (!hasLiveData || !featureUsage) return null;

    switch (feature.id) {
      case "ai-text":
        return (
          <div className="grid grid-cols-2 gap-3">
            <Metric
              label="AI operations"
              value={formatNumber(featureUsage.aiTextCount)}
              hint="Recorded in selected range"
            />
            <Metric
              label="Total tokens"
              value={formatNumber(featureUsage.aiTextTotalTokens)}
              hint="Recorded total"
            />
            <Metric
              label="Recorded cost"
              value={formatUsd(featureUsage.aiTextTotalCostUsd)}
              hint="USD, as stored in database"
            />
          </div>
        );

      case "voice-speech":
        return (
          <div className="grid grid-cols-2 gap-3">
            <Metric
              label="Voice records"
              value={formatNumber(featureUsage.voiceGenerationCount)}
              hint="Recorded in selected range"
            />
          </div>
        );

      case "video-gen":
        return (
          <div className="grid grid-cols-2 gap-3">
            <Metric
              label="Video records"
              value={formatNumber(featureUsage.videoCount)}
              hint="Recorded in selected range"
            />
          </div>
        );

      case "image-gen":
        return (
          <div className="grid grid-cols-2 gap-3">
            <Metric
              label="Image records"
              value={formatNumber(featureUsage.imageCount)}
              hint="Semantic image records"
            />
            <Metric
              label="Indexed images"
              value={formatNumber(featureUsage.indexedImageCount)}
              hint="Active records with indexed status"
            />
          </div>
        );

      default:
        return null;
    }
  })();

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title={feature.name}
      subtitle="Database records for the selected date range"
      badge={
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: feature.color }}
        >
          {hasLiveData ? "Live data" : isLoading ? "Loading" : "Unavailable"}
        </span>
      }
    >
      <div className="space-y-5">
        {isLoading && (
          <EmptyState message="Loading feature data from the database…" />
        )}

        {hasError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            Could not load live feature data. Please refresh and try again.
            Mock statistics are intentionally not shown here.
          </div>
        )}

        {hasLiveData && (
          <>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <FiDatabase className="h-4 w-4 shrink-0" />
              Values below reflect records returned by the database. Some
              usage fields may be stored as zero or missing.
            </div>

            {liveMetrics}

            {recentContent}
          </>
        )}
      </div>
    </DrawerShell>
  );
}