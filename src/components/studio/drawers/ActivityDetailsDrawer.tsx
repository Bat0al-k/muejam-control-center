"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { useRouter } from "next/navigation";
import { FiActivity, FiArrowRight, FiCheckCircle, FiClock, FiCpu } from "react-icons/fi";

export function ActivityDetailsDrawer() {
  const { activeDrawer, closeDrawer, recentActivity, openDrawer, showToast } =
    useStudio();
  const router = useRouter();

  const isOpen = activeDrawer?.type === "activityDetails";
  const activityId = isOpen ? activeDrawer.activityId : null;

  // const activity =
  //   recentActivity.find((a) => a.id === activityId) || recentActivity[0];

  // if (!activity) return null;

  const activity = activityId
    ? recentActivity.find((item) => item.id === activityId)
    : undefined;

  if (!isOpen || !activity) return null;

  const isCreditRelated =
    activity.eventType === "Credits" || activity.creditsChange > 0 || activity.transactionId;
  const isGenerationRelated =
    activity.eventType === "Generations" || Boolean(activity.pipelineId);

  const handleViewPipeline = () => {
    if (activity.pipelineId) {
      openDrawer({ type: "pipelineDetails", pipelineId: activity.pipelineId });
    } else {
      openDrawer({ type: "pipelineDetails", pipelineId: "3842" });
    }
  };

  const handleViewTransaction = () => {
    closeDrawer();
    showToast("info", "Navigating to Transactions ledger");
    router.push("/dashboard/studio/transactions");
  };

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Activity Details"
      subtitle={`Audit ledger event logged ${activity.timeAgo}`}
      badge={
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${activity.status === "Success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {activity.status}
        </span>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          {isGenerationRelated && (
            <button
              onClick={handleViewPipeline}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white hover:bg-[#D96948] rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <FiCpu className="w-3.5 h-3.5" />
              View Pipeline
            </button>
          )}

          {isCreditRelated && (
            <button
              onClick={handleViewTransaction}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white hover:bg-black rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              View Transaction
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      }
    >
      {/* Event Header Card */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#6B7280] block">User / Actor</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-syne text-[#111111]">
                {activity.userName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold">
                {activity.userBadge}
              </span>
            </div>
          </div>

          <div className="text-right">
            {activity.eventType === "Transactions" ? (
              <>
                <span className="text-xs text-[#6B7280] block">Payment Amount</span>
                <span className="text-lg font-mono font-bold text-emerald-600">
                  {activity.details}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-[#6B7280] block">Credits Impact</span>
                <span
                  className={`text-lg font-mono font-bold ${activity.creditsChange > 0 ? "text-emerald-600" : "text-[#111111]"
                    }`}
                >
                  {activity.creditsChange > 0
                    ? `+${activity.creditsChange.toLocaleString()}`
                    : `${activity.creditsChange.toLocaleString()}`}{" "}
                  cr
                </span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-[#374151] leading-relaxed border-t border-[#E5E7EB] pt-3">
          {activity.description}
        </p>
      </div>

      {/* Meta Specs */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiActivity className="w-3.5 h-3.5 text-[#E8785A]" />
          Event Telemetry Attributes
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Event Category</span>
            <span className="font-semibold text-[#111111]">{activity.eventType}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Timestamp</span>
            <span className="font-mono text-[#111111] flex items-center gap-1">
              <FiClock className="w-3 h-3 text-[#6B7280]" />
              {activity.timestamp} ({activity.timeAgo})
            </span>
          </div>
          {activity.jobId && (
            <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
              <span className="text-[#6B7280]">Associated Job ID</span>
              <span className="font-mono font-semibold text-[#E8785A]">
                {activity.jobId}
              </span>
            </div>
          )}
          {activity.transactionId && (
            <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
              <span className="text-[#6B7280]">Transaction Reference</span>
              <span className="font-mono font-semibold text-[#111111]">
                {activity.transactionId}
              </span>
            </div>
          )}
          {activity.feature && (
            <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
              <span className="text-[#6B7280]">Feature Component</span>
              <span className="font-medium text-[#111111]">{activity.feature}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-[#6B7280]">Execution Result</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5" />
              {activity.status} (Verified)
            </span>
          </div>
        </div>
      </div>

      {activity.details && (
        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] text-xs text-[#4B5563]">
          <span className="font-semibold text-[#111111] block mb-1">
            Audit Ledger Note:
          </span>
          {activity.details}
        </div>
      )}
    </DrawerShell>
  );
}
