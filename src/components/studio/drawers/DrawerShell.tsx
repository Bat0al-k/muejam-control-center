"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface DrawerShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

export function DrawerShell({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  widthClass = "max-w-xl",
}: DrawerShellProps) {
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex pl-10">
        <div
          className={`w-screen ${widthClass} transform bg-white shadow-2xl border-l border-[#E5E7EB] flex flex-col animate-slide-in duration-200`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#F0F0F2] flex items-start justify-between bg-[#FAFAFB]">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[#111111] font-syne tracking-tight">
                  {title}
                </h2>
                {badge}
              </div>
              {subtitle && (
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-[#EAEAEA] transition-colors"
              aria-label="Close drawer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#1F2937]">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-[#F0F0F2] bg-[#FAFAFB] flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
