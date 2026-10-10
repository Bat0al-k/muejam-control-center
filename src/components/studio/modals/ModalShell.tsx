"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClass = "max-w-md",
}: ModalShellProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClass} bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 animate-fade-in`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F0F2] flex items-start justify-between bg-[#FAFAFB]">
          <div>
            <h3 className="text-base font-bold text-[#111111] font-syne tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#6B7280] mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-[#EAEAEA] transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#F0F0F2] bg-[#FAFAFB] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
