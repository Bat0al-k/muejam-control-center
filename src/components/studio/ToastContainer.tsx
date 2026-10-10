"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export function ToastContainer() {
  const { toasts, dismissToast } = useStudio();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm animate-fade-in transition-all ${
              isSuccess
                ? "bg-[#064E3B] text-white border-emerald-600"
                : isError
                ? "bg-[#7F1D1D] text-white border-red-600"
                : "bg-[#1E293B] text-white border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <FiCheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />}
              {isError && <FiAlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />}
              {!isSuccess && !isError && <FiInfo className="w-5 h-5 text-blue-300 flex-shrink-0" />}
              <span className="font-medium text-xs sm:text-sm tracking-wide">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
