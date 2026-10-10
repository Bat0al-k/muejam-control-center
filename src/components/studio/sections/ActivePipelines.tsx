// "use client";

// import React from "react";
// import { useStudio } from "@/features/studio/context";
// import { FiPause, FiPlay, FiSliders } from "react-icons/fi";

// export function ActivePipelines() {
//   const {
//     featureUsage,
//     openDrawer,
//     openModal,
//     modelTraining,
//     // gpuUsage,
//   } = useStudio();

//   const imageRecent = featureUsage?.imageRecent ?? [];
//   const imageJobs = imageRecent.slice(0, 4);

//   const activeCount = imageRecent.filter((job) =>
//     ["processing", "running", "queued", "pending"].includes(
//       job.status.toLowerCase(),
//     ),
//   ).length;

//   // const {
//   //   activePipelines,
//   //   openDrawer,
//   //   openModal,
//   //   modelTraining,
//   //   gpuUsage,
//   // } = useStudio();

//   // Filter to the 4 main pipelines shown on dashboard grid
//   const getStatusStyle = (status: string) => {
//     const normalized = status.toLowerCase();

//     if (["completed", "complete", "success", "succeeded"].includes(normalized)) {
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     }

//     if (["processing", "running"].includes(normalized)) {
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     }

//     if (["queued", "pending"].includes(normalized)) {
//       return "bg-amber-50 text-amber-800 border-amber-200";
//     }

//     if (["failed", "error", "timeout"].includes(normalized)) {
//       return "bg-red-50 text-red-700 border-red-200";
//     }

//     return "bg-slate-100 text-slate-700 border-slate-200";
//   };

//   const isTrainingPaused = modelTraining.trainingStatus === "Paused";

//   return (
//     <div className="space-y-4">
//       {/* Section Header */}
//       {/* Section Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//         <div className="flex items-center gap-2.5">
//           <span className="w-2.5 h-2.5 rounded-full bg-[#E8785A]" />

//           <h2 className="text-base font-bold font-syne text-[#111111] tracking-tight">
//             Recent Image Generation Jobs
//           </h2>

//           <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
//             {activeCount > 0 ? `${activeCount} ACTIVE` : "LIVE DATA"}
//           </span>
//         </div>
//       </div>

//       {/* Real Image Generation Records */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {imageJobs.map((job) => (
//           <div
//             key={job.id}
//             className="bg-white border border-[#E5E7EB] rounded-2xl p-4"
//           >
//             <div className="flex items-start justify-between gap-3 mb-2">
//               <span className="text-sm font-bold font-syne text-[#111111]">
//                 {job.name || "Image generation"}
//               </span>

//               <span
//                 className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(job.status)}`}
//               >
//                 {job.status}
//               </span>
//             </div>

//             <div className="space-y-1 text-xs text-[#6B7280]">
//               <p>
//                 Category: {job.category || "Not specified"}
//               </p>

//               <p>
//                 Model: {job.model_version || "Not specified"}
//               </p>

//               <p>
//                 Created: {new Date(job.created_at).toLocaleString()}
//               </p>
//             </div>

//             {job.error_message && (
//               <p className="mt-3 text-xs text-red-600 break-words">
//                 {job.error_message}
//               </p>
//             )}
//           </div>
//         ))}

//         {imageJobs.length === 0 && (
//           <div className="md:col-span-2 bg-white border border-dashed border-[#D1D5DB] rounded-2xl p-8 text-center">
//             <p className="text-sm font-semibold text-[#374151]">
//               No image generation records found
//             </p>

//             <p className="text-xs text-[#6B7280] mt-1">
//               There are no records available for the selected date range.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Platform Infrastructure Bar */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
//         {/* Left Side (Clickable to Model Training Drawer) */}
//         <div
//           onClick={() => openDrawer({ type: "modelTraining" })}
//           className="flex items-center gap-3.5 cursor-pointer flex-1 group"
//         >
//           <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0 font-syne group-hover:bg-[#E8785A] transition-colors">
//             PT
//           </div>

//           <div className="space-y-0.5">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-xs font-bold text-[#111111] font-syne group-hover:text-[#E8785A] transition-colors">
//                 Platform Infrastructure: {modelTraining.modelName}
//               </span>
//               <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
//                 Checkpoint Epoch {modelTraining.currentEpoch}/{modelTraining.totalEpochs}
//               </span>
//             </div>
//             <p className="text-[11px] text-[#6B7280]">
//               Autonomous Model Fine-Tuning Pipeline · Tensor Core Cluster: Beta-04
//             </p>
//           </div>
//         </div>

//         {/* Right Side: Actions & Progress Bar */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
//           <div className="flex items-center gap-2">
//             {/* Pause Training Button */}
//             <button
//               onClick={() => openModal({ type: "pauseTraining" })}
//               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] hover:bg-[#FAFAFB] text-[#374151] rounded-xl text-xs font-semibold transition-colors"
//             >
//               {isTrainingPaused ? (
//                 <>
//                   <FiPlay className="w-3.5 h-3.5 text-emerald-600" />
//                   <span>Resume Training</span>
//                 </>
//               ) : (
//                 <>
//                   <FiPause className="w-3.5 h-3.5 text-[#6B7280]" />
//                   <span>Pause Training</span>
//                 </>
//               )}
//             </button>

//             {/* Inspect Weights Button */}
//             <button
//               onClick={() => openDrawer({ type: "inspectWeights" })}
//               className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8785A] hover:bg-[#D96948] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
//             >
//               <FiSliders className="w-3.5 h-3.5" />
//               <span>Inspect Weights</span>
//             </button>
//           </div>

//           {/* Progress Indicator */}
//           <div className="flex items-center gap-2 min-w-[120px]">
//             <div className="w-24 bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
//               <div
//                 className={`h-full rounded-full ${isTrainingPaused ? "bg-amber-500" : "bg-[#111111]"
//                   }`}
//                 style={{ width: `${modelTraining.progressPercent}%` }}
//               />
//             </div>
//             <span className="text-xs font-bold text-[#111111] font-mono">
//               {modelTraining.progressPercent}% {isTrainingPaused ? "Paused" : "Active"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useStudio } from "@/features/studio/context";
import { FiPause, FiPlay, FiSliders } from "react-icons/fi";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString();
}

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (
    ["completed", "complete", "success", "succeeded"].includes(normalized)
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (["processing", "running"].includes(normalized)) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (["queued", "pending"].includes(normalized)) {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }

  if (["failed", "error", "timeout"].includes(normalized)) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

export function ActivePipelines() {
  const {
    featureUsage,
    openDrawer,
    openModal,
    modelTraining,
    gpuUsage,
  } = useStudio();

  const imageRecord = featureUsage?.imageRecent[0];
  const textRecord = featureUsage?.aiTextRecent[0];
  const voiceRecord = featureUsage?.voiceRecent[0];
  const videoRecord = featureUsage?.videoRecent[0];

  const featureUsageCounts = {
    image: featureUsage?.imageCount ?? 0,
    text: featureUsage?.aiTextCount ?? 0,
    voice: featureUsage?.voiceGenerationCount ?? 0,
    video: featureUsage?.videoCount ?? 0,
  };

  const totalFeatureUsage = Object.values(featureUsageCounts).reduce(
    (total, count) => total + count,
    0,
  );

  const getUsagePercent = (feature: keyof typeof featureUsageCounts) =>
    totalFeatureUsage > 0
      ? Math.round(
        (featureUsageCounts[feature] / totalFeatureUsage) * 100,
      )
      : 0;

  // Each card represents the latest real record for one Studio feature.
  const featureCards = [
    ...(imageRecord
      ? [
        {
          id: `image:${imageRecord.id}`,
          title: "Image Generation",
          description: imageRecord.name || "Image generation",
          status: imageRecord.status,
          summary: [
            `Category: ${imageRecord.category || "Not specified"}`,
            `Model: ${imageRecord.model_version || "Not specified"}`,
            `Created: ${formatDate(imageRecord.created_at)}`,
          ],
          usagePercent: getUsagePercent("image"),
        },
      ]
      : []),

    ...(textRecord
      ? [
        {
          id: `text:${textRecord.id}`,
          title: "AI Text Generation",
          description: textRecord.operation || "Text generation",
          status: "Latest record",
          summary: [
            `Model: ${textRecord.model || "Not specified"}`,
            `Total tokens: ${textRecord.total_tokens}`,
            `Cost: $${textRecord.total_cost_usd}`,
            `Created: ${formatDate(textRecord.created_at)}`,
          ],
          usagePercent: getUsagePercent("text"),
        },
      ]
      : []),

    ...(voiceRecord
      ? [
        {
          id: `voice:${voiceRecord.id}`,
          title: "Voice Generation",
          description: voiceRecord.voice_name || "Voice generation",
          status: "Latest record",
          summary: [
            `Provider: ${voiceRecord.provider || "Not specified"}`,
            `Model: ${voiceRecord.model_id || "Not specified"}`,
            `Created: ${formatDate(voiceRecord.created_at)}`,
          ],
          usagePercent: getUsagePercent("voice"),
        },
      ]
      : []),

    ...(videoRecord
      ? [
        {
          id: `video:${videoRecord.id}`,
          title: "Video Generation",
          description: videoRecord.title || "Video generation",
          status: "Latest record",
          summary: [
            `Duration: ${videoRecord.duration == null
              ? "Not available"
              : `${videoRecord.duration} seconds`
            }`,
            `Created: ${formatDate(videoRecord.created_at)}`,
          ],
          usagePercent: getUsagePercent("video"),
        },
      ]
      : []),
  ];

  const isTrainingPaused =
    modelTraining.trainingStatus === "Paused";

  return (
    <div className="space-y-3 border border-[#E5E7EB] bg-white rounded-2xl p-4">
      {/* Active Pipelines */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8785A]" />

          <h2 className="text-lg font-bold font-syne text-[#111111] tracking-tight">
            Active Pipelines
          </h2>

          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
            {featureCards.length} FEATURES
          </span>
        </div>
        {/* GPU Load */}
        <button
          type="button"
          onClick={() => openDrawer({ type: "gpuUsage" })}
          className="text-xs text-[#6B7280] hover:text-[#111111] transition-colors flex items-center gap-1.5 self-start group"
        >
          <span>Total GPU VRAM Load:</span>
          <span className="font-mono font-bold text-[#111111] group-hover:text-[#E8785A]">
            {gpuUsage.usedVram} GB / {gpuUsage.totalVram} GB
          </span>
        </button>
      </div>

      {/* One latest real record per feature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featureCards.map((feature) => (
          <button
            key={feature.id}
            type="button"
            onClick={() =>
              openDrawer({
                type: "pipelineDetails",
                pipelineId: feature.id,
              })
            }
            className="w-full text-left bg-slate-50 border border-[#E5E7EB] rounded-2xl p-4 transition-colors hover:border-[#c9694f]/70 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8785A]/30"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-bold font-syne text-[#111111]">
                  {feature.title}
                </h3>

                {/* <p className="mt-1 text-xs text-[#6B7280] break-words">
                  {feature.description}
                </p> */}
              </div>

              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(feature.status)}`}
              >
                {feature.status}
              </span>
            </div>

            {/* <div className="space-y-1.5">
              {feature.summary.map((item) => (
                <p
                  key={item}
                  className="text-xs text-[#6B7280] break-words"
                >
                  {item}
                </p>
              ))}
            </div> */}

            {/* {feature.usagePercent} is the same as StudioFeatureUsage.videoCount etc.
            النسبة دي لحجم استخدام كل Feature،
            مش لتقدم تنفيذ الـ Pipeline
            */}

            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">
                  Feature Usage
                </span>

                <span className="text-xs font-bold text-[#111111] font-mono">
                  {feature.usagePercent}%
                </span>
              </div>

              <div
                className="w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden"
                role="progressbar"
                aria-label={`${feature.title} share of total usage`}
                aria-valuenow={feature.usagePercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-[#E8785A] transition-all duration-500"
                  style={{ width: `${feature.usagePercent}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#E8785A]">
                View record details
              </span>

              <span className="text-[#E8785A]" aria-hidden="true">
                →
              </span>
            </div>
          </button>
        ))}

        {featureCards.length === 0 && (
          <div className="md:col-span-2 bg-slate-50 border border-dashed border-[#D1D5DB] rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-[#374151]">
              No feature records found
            </p>

            <p className="text-xs text-[#6B7280] mt-1">
              No records are available for the selected date range.
            </p>
          </div>
        )}
      </div>

      {/* Existing Platform Infrastructure section */}
      <div className="bg-slate-50 border border-[#E5E7EB] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div
          onClick={() => openDrawer({ type: "modelTraining" })}
          className="flex items-center gap-3.5 cursor-pointer flex-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0 font-syne group-hover:bg-[#E8785A] transition-colors">
            PT
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#111111] font-syne group-hover:text-[#E8785A] transition-colors">
                Platform Infrastructure: {modelTraining.modelName}
              </span>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                Checkpoint Epoch {modelTraining.currentEpoch}/
                {modelTraining.totalEpochs}
              </span>
            </div>

            <p className="text-[11px] text-[#6B7280]">
              Autonomous Model Fine-Tuning Pipeline · Tensor Core Cluster:
              Beta-04
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openModal({ type: "pauseTraining" })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D1D5DB] hover:bg-[#FAFAFB] text-[#374151] rounded-xl text-xs font-semibold transition-colors"
            >
              {isTrainingPaused ? (
                <>
                  <FiPlay className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resume Training</span>
                </>
              ) : (
                <>
                  <FiPause className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Pause Training</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => openDrawer({ type: "inspectWeights" })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8785A] hover:bg-[#D96948] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <FiSliders className="w-3.5 h-3.5" />
              <span>Inspect Weights</span>
            </button>
          </div>

          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="w-24 bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isTrainingPaused ? "bg-amber-500" : "bg-[#111111]"
                  }`}
                style={{
                  width: `${modelTraining.progressPercent}%`,
                }}
              />
            </div>

            <span className="text-xs font-bold text-[#111111] font-mono">
              {modelTraining.progressPercent}%{" "}
              {isTrainingPaused ? "Paused" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div >
  );
}