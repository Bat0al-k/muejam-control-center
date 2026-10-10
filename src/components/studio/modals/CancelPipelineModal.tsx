"use client";

import React from "react";
import { ModalShell } from "./ModalShell";
import { useStudio } from "@/features/studio/context";
import { FiAlertTriangle } from "react-icons/fi";

export function CancelPipelineModal() {
  const { activeModal, closeModal, activePipelines, cancelPipeline } = useStudio();

  const isOpen = activeModal?.type === "cancelPipeline";
  const pipelineId = isOpen ? activeModal.pipelineId : null;

  const pipeline = activePipelines.find((p) => p.id === pipelineId);

  const handleConfirmCancel = () => {
    if (pipelineId) {
      cancelPipeline(pipelineId);
    }
    closeModal();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Cancel this pipeline?"
      subtitle="Immediate termination of accelerator worker process"
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
          <FiAlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              Terminating {pipeline?.name} ({pipeline?.jobId})
            </span>
            <p className="text-[11px] text-red-700 leading-relaxed">
              Execution will halt immediately. Unspent token reserves will be returned to the tenant account wallet, but current intermediate GPU render state will be lost.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F0F2]">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
          >
            Keep Running
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            Cancel Pipeline
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
