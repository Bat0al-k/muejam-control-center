"use client";

import React from "react";
import { DrawerShell } from "./DrawerShell";
import { useStudio } from "@/features/studio/context";
import { FiSliders, FiDatabase, FiCheckCircle, FiCopy } from "react-icons/fi";

export function InspectWeightsDrawer() {
  const { activeDrawer, closeDrawer, showToast } = useStudio();

  const isOpen = activeDrawer?.type === "inspectWeights";

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText("sha256:7b91d24ef081ab2934c991e204bb5812");
    showToast("info", "Weights checksum copied to clipboard");
  };

  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Model Weights & Inspection"
      subtitle="Safetensors checkpoint tensors, sparsity matrix, and numerical precision"
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          FP16 / BF16 Validated
        </span>
      }
    >
      {/* Checkpoint File Meta */}
      <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
          <div className="flex items-center gap-2">
            <FiDatabase className="w-4 h-4 text-[#E8785A]" />
            <span className="font-bold text-[#111111]">Active Checkpoint</span>
          </div>
          <span className="font-mono text-[#6B7280]">4.82 GB</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Filename:</span>
            <span className="text-[#111111] font-semibold">
              ckpt_pose_v2_epoch4.safetensors
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Version:</span>
            <span className="text-[#111111]">Pose-v2.4-checkpoint-04</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280]">Checksum:</span>
            <button
              onClick={handleCopyChecksum}
              className="text-[#E8785A] hover:underline flex items-center gap-1"
            >
              <span>sha256:7b91...5812</span>
              <FiCopy className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Quantization:</span>
            <span className="text-emerald-700 font-semibold">BF16 Mixed Precision</span>
          </div>
        </div>
      </div>

      {/* Numerical Weight Statistics */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiSliders className="w-3.5 h-3.5 text-[#E8785A]" />
          Tensor Matrix Distribution Statistics
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FAFAFB] p-3 rounded-lg border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Total Parameters</span>
            <span className="text-lg font-bold font-syne text-[#111111]">1.84 Billion</span>
            <span className="text-[10px] text-[#6B7280] block mt-0.5">Dense Attention Blocks</span>
          </div>
          <div className="bg-[#FAFAFB] p-3 rounded-lg border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Matrix Sparsity</span>
            <span className="text-lg font-bold font-syne text-[#111111]">4.2%</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">High Weight Density</span>
          </div>
          <div className="bg-[#FAFAFB] p-3 rounded-lg border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Weight Mean (μ)</span>
            <span className="text-base font-mono font-bold text-[#111111]">0.00142</span>
            <span className="text-[10px] text-[#6B7280] block mt-0.5">Zero-centered normal</span>
          </div>
          <div className="bg-[#FAFAFB] p-3 rounded-lg border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Weight Std (σ)</span>
            <span className="text-base font-mono font-bold text-[#111111]">0.02418</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Stable Gradient Bounds</span>
          </div>
        </div>
      </div>

      {/* Validation Evaluation Metrics */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Benchmark Evaluation Metrics
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Pose Keypoint Accuracy</span>
            <span className="font-semibold text-emerald-600">98.42% PCK@0.2</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Temporal Jitter Ratio</span>
            <span className="font-semibold text-[#111111]">0.012 rad/s</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F0F0F2]">
            <span className="text-[#6B7280]">Inference Latency (per frame)</span>
            <span className="font-mono text-[#111111]">8.4ms (RTX 4090 / H100)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#6B7280]">Last Evaluated</span>
            <span className="text-[#6B7280]">14 minutes ago</span>
          </div>
        </div>
      </div>
    </DrawerShell>
  );
}
