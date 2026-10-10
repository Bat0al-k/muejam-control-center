"use client";

import React from "react";
import { ModalShell } from "./ModalShell";
import { useStudio } from "@/features/studio/context";
import { FiPause, FiInfo } from "react-icons/fi";

export function PauseTrainingModal() {
  const { activeModal, closeModal, toggleTrainingPause } = useStudio();

  const isOpen = activeModal?.type === "pauseTraining";

  const handleConfirmPause = () => {
    toggleTrainingPause();
    closeModal();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title="Pause model training?"
      subtitle="Safely freeze tensor optimizer state and release H100 GPU compute"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
          <FiInfo className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              Checkpoint Preservation
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Training will pause at the current checkpoint (Epoch 4, Batch 1402). Model weights and optimizer momentum will be safely serialized to disk before node detachment.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F0F2]">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmPause}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#DC2626] text-white rounded-xl text-xs font-semibold hover:bg-[#B91C1C] transition-colors shadow-sm"
          >
            <FiPause className="w-3.5 h-3.5" />
            Pause Training
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
