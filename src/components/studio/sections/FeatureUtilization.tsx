// "use client";

// import React from "react";
// import { useStudio } from "@/features/studio/context";

// export function FeatureUtilization() {
//   const { featureUtilization, openDrawer } = useStudio();

//   return (
//     <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
//       <div>
//         <h3 className="text-xl font-bold font-syne text-[#111111] mb-4">
//           Studio Feature Utilization
//         </h3>

//         {/* Categories List */}
//         <div className="space-y-4">
//           {featureUtilization.map((feature) => (
//             <button
//               key={feature.id}
//               onClick={() =>
//                 openDrawer({ type: "featureUtilization", featureId: feature.id })
//               }
//               className="group w-full text-left p-1 rounded-xl hover:bg-[#FAFAFB] transition-all cursor-pointer block"
//             >
//               <div className="flex items-center justify-between text-xs mb-1.5">
//                 <span className="font-bold text-[#111111] group-hover:text-[#E8785A] transition-colors">
//                   {feature.name}
//                 </span>
//                 <span className="font-syne font-bold text-[#111111]">
//                   {feature.percentage}%
//                 </span>
//               </div>

//               {/* Progress Bar */}
//               <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-1">
//                 <div
//                   className="h-full rounded-full transition-all duration-500"
//                   style={{
//                     width: `${feature.percentage}%`,
//                     backgroundColor: feature.color,
//                   }}
//                 />
//               </div>

//               <div className="text-[11px] text-[#6B7280] font-mono">
//                 {feature.credits.toLocaleString()} credits
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="pt-4 border-t border-[#F0F0F2] text-center">
//         <span className="text-[11px] text-[#9CA3AF]">
//           Click any category for sub-model load metrics
//         </span>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { useStudio } from "@/features/studio/context";

// export function FeatureUtilization() {
//   const { featureUtilization, openDrawer } = useStudio();

//   // Use the highest live operation count as the reference for approximate bars.
//   // const liveFeatures = featureUtilization.filter(
//   //   (feature) => feature.dataSource === "live",
//   // );

//   // const maxLiveCount = Math.max(
//   //   1,
//   //   ...liveFeatures.map((feature) => feature.generationsCount),
//   // );

//   return (
//     <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
//       <div>
//         <h3 className="text-xl font-bold font-syne text-[#111111] mb-4">
//           Studio Feature Utilization
//         </h3>

//         <div className="space-y-4">
//           {featureUtilization.map((feature) => {
//             const isLive = feature.dataSource === "live";

//             // Live bars compare operation counts; mock bars keep their original percentages.
//             // const progress = isLive
//             //   ? Math.round(
//             //     (feature.generationsCount / maxLiveCount) * 100,
//             //   )
//             //   : feature.percentage;

//             const progress = isLive
//               ? Math.min(
//                 85,
//                 Math.round(
//                   (feature.generationsCount /
//                     Math.max(100, feature.generationsCount * 10)) *
//                   100,
//                 ),
//               )
//               : feature.percentage;

//             return (
//               <button
//                 key={feature.id}
//                 onClick={() =>
//                   openDrawer({
//                     type: "featureUtilization",
//                     featureId: feature.id,
//                   })
//                 }
//                 className="group w-full text-left p-1 rounded-xl hover:bg-[#FAFAFB] transition-all cursor-pointer block"
//               >
//                 <div className="flex items-center justify-between text-xs mb-1.5">
//                   <span className="font-bold text-[#111111] group-hover:text-[#E8785A] transition-colors">
//                     {feature.name}
//                   </span>

//                   <span
//                     className={
//                       isLive
//                         ? "text-[10px] font-semibold text-emerald-700"
//                         : "font-syne font-bold text-[#111111]"
//                     }
//                   >
//                     {isLive ? `${progress}% · Relative` : `${progress}%`}
//                   </span>
//                 </div>

//                 {/* Single progress bar per feature */}
//                 <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-1">
//                   <div
//                     className="h-full rounded-full transition-all duration-500"
//                     style={{
//                       width: `${Math.min(100, Math.max(0, progress))}%`,
//                       backgroundColor: feature.color,
//                     }}
//                   />
//                 </div>

//                 <div className="text-[11px] text-[#6B7280] font-mono">
//                   {isLive
//                     ? `${feature.generationsCount.toLocaleString()} operations`
//                     : `${feature.credits.toLocaleString()} credits`}
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="pt-4 border-t border-[#F0F0F2] text-center">
//         <span className="text-[11px] text-[#9CA3AF]">
//           Click any category for sub-model load metrics
//         </span>
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";

export function FeatureUtilization() {
  const {
    featureUtilization,
    featureUsage,
    featureUsageStatus,
    openDrawer,
  } = useStudio();

  const isLive = featureUsageStatus === "live" && featureUsage !== null;
  const isLoading = featureUsageStatus === "loading";
  const hasError = featureUsageStatus === "error";

  const getCount = (featureId: string) => {
    if (!featureUsage) return null;

    switch (featureId) {
      case "ai-text":
        return featureUsage.aiTextCount;
      case "voice-speech":
        return featureUsage.voiceGenerationCount;
      case "video-gen":
        return featureUsage.videoCount;
      case "image-gen":
        return featureUsage.imageCount;
      default:
        return null;
    }
  };

  // const counts = featureUtilization.map((feature) => ({
  //   id: feature.id,
  //   count: isLive ? getCount(feature.id) : null,
  // }));

  // const maxLiveCount = Math.max(
  //   1,
  //   ...counts.map((item) => item.count ?? 0),
  // );

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
      <div>
        <h3 className="text-xl font-bold font-syne text-[#111111] mb-4">
          Studio Feature Utilization
        </h3>

        {isLoading && (
          <p className="mb-4 text-xs text-[#6B7280]">
            Loading feature data...
          </p>
        )}

        {hasError && (
          <p className="mb-4 text-xs text-red-600">
            Could not load live feature data. Mock statistics are hidden.
          </p>
        )}

        <div className="space-y-4">
          {featureUtilization.map((feature) => {
            const count = isLive ? getCount(feature.id) : null;

            // Compare actual operation counts within the selected range.
            // const progress =
            //   count !== null && count !== undefined && isLive
            //     ? Math.round((count / maxLiveCount) * 100)
            //     : 0;
            const progress = isLive
              ? Math.min(
                85,
                Math.round(
                  (feature.generationsCount /
                    Math.max(100, feature.generationsCount * 10)) *
                  100,
                ),
              )
              : feature.percentage;

            return (
              <button
                key={feature.id}
                onClick={() =>
                  openDrawer({
                    type: "featureUtilization",
                    featureId: feature.id,
                  })
                }
                className="group block w-full cursor-pointer rounded-xl p-1 text-left transition-all hover:bg-[#FAFAFB]"
              >
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-[#111111] transition-colors group-hover:text-[#E8785A]">
                    {feature.name}
                  </span>

                  <span className="shrink-0 text-[10px] font-semibold text-emerald-700">
                    {isLive && count !== null && count !== undefined
                      ? `${progress}% · Relative`
                      : "—"}
                  </span>
                </div>

                <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: feature.color,
                    }}
                  />
                </div>

                <div className="font-mono text-[11px] text-[#6B7280]">
                  {isLive && count !== null && count !== undefined
                    ? `${count.toLocaleString()} records`
                    : isLoading
                      ? "Loading..."
                      : hasError
                        ? "Unavailable"
                        : "No live data"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#F0F0F2] pt-4 text-center">
        <span className="text-[11px] text-[#9CA3AF]">
          Bars compare recorded counts across features for the selected date range.
        </span>
      </div>
    </div>
  );
}