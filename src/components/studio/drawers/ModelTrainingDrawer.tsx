"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiTrendingDown, FiServer, FiClock, FiDatabase, FiPause, FiPlay } from "react-icons/fi";

export function ModelTrainingDrawer() {
  const {
    activeDrawer,
    closeDrawer,
    modelTraining,
    toggleTrainingPause,
    openDrawer,
  } = useStudio();

  const isOpen = activeDrawer?.type === "modelTraining";

  const isPaused = modelTraining.trainingStatus === "Paused";

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Model Training Details"
      subtitle="Platform infrastructure fine-tuning telemetry for foundation models"
      badge={
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isPaused
              ? "bg-amber-100 text-amber-800 border border-amber-300"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {isPaused ? "Paused at Checkpoint" : "Active Epoch 4/12"}
        </span>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => openDrawer({ type: "inspectWeights" })}
            className="px-3.5 py-2 bg-white text-[#374151] border border-[#D1D5DB] rounded-xl text-xs font-semibold hover:bg-[#F9FAFB] transition-colors"
          >
            Inspect Weights
          </button>

          <button
            onClick={toggleTrainingPause}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors ${
              isPaused ? "bg-[#059669] hover:bg-[#047857]" : "bg-[#DC2626] hover:bg-[#B91C1C]"
            }`}
          >
            {isPaused ? <FiPlay className="w-3.5 h-3.5" /> : <FiPause className="w-3.5 h-3.5" />}
            {isPaused ? "Resume Training" : "Pause Training"}
          </button>
        </div>
      }
    >
      {/* Training Overview Card */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7280] block">Model Architecture</span>
            <span className="text-xl font-bold font-syne text-[#111111]">
              {modelTraining.modelName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#6B7280] block">Epoch Progress</span>
            <span className="text-base font-bold font-syne text-[#111111]">
              Epoch {modelTraining.currentEpoch} / {modelTraining.totalEpochs}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>{modelTraining.progressPercent}% Overall Completion</span>
            <span>ETA ~36 hours</span>
          </div>
          <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPaused ? "bg-amber-500" : "bg-[#111111]"
              }`}
              style={{ width: `${modelTraining.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cluster & Compute Specs */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiServer className="w-3.5 h-3.5 text-[#E8785A]" />
          Infrastructure Cluster Telemetry
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Target Cluster</span>
            <span className="font-semibold text-[#111111]">{modelTraining.cluster}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Hardware Allocation</span>
            <span className="font-semibold text-[#111111]">{modelTraining.gpuUsage}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Elapsed Training Time</span>
            <span className="font-medium text-[#111111] flex items-center gap-1">
              <FiClock className="w-3 h-3 text-[#6B7280]" />
              {modelTraining.trainingDuration}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Model Parameters</span>
            <span className="font-semibold text-[#111111]">
              {modelTraining.totalParameters}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#6B7280]">Learning Rate Schedule</span>
            <span className="font-mono text-[#111111]">{modelTraining.learningRate}</span>
          </div>
        </div>
      </div>

      {/* Convergence Loss Curve Metrics */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiTrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          Convergence & Loss Telemetry
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Validation Loss</span>
            <span className="text-lg font-bold font-syne text-[#111111]">
              {modelTraining.valLoss}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              ↓ -0.004 vs Epoch 3
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Training Loss</span>
            <span className="text-lg font-bold font-syne text-[#111111]">
              {modelTraining.trainLoss}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              Smooth gradient descent
            </span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiDatabase className="w-4 h-4 text-[#6B7280]" />
            <div>
              <span className="font-medium text-[#111111] block">Last Checkpoint</span>
              <span className="font-mono text-[10px] text-[#6B7280]">
                {modelTraining.lastCheckpoint}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Saved
          </span>
        </div>
      </div>
    </DrawerShell>
  );
}
