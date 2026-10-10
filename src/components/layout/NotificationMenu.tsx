"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "@/features/studio/context";
import { FiBell, FiAlertCircle, FiAlertTriangle, FiArrowRight } from "react-icons/fi";

export function NotificationMenu() {
  const { alerts, openDrawer } = useStudio();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenAlerts = () => {
    setIsOpen(false);
    openDrawer({ type: "alerts" });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#FAF8F5] text-[#111111] hover:text-[#111111] hover:bg-[#F3F4F6] transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5" />
        {alerts.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8785A] ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-30 animate-fade-in overflow-hidden text-xs">
          <div className="p-3.5 border-b border-[#F0F0F2] flex items-center justify-between bg-[#FAFAFB]">
            <span className="font-bold text-[#111111] font-syne">
              Cluster Notifications
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
              {alerts.length} Active
            </span>
          </div>

          <div className="divide-y divide-[#F0F0F2] max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={handleOpenAlerts}
                className="p-3 hover:bg-[#FFF5F2] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
                  {alert.severity === "high" ? (
                    <FiAlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  ) : (
                    <FiAlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                  <span className="truncate">{alert.type}</span>
                </div>
                <p className="text-[11px] text-[#6B7280] line-clamp-2">
                  {alert.message}
                </p>
                <span className="text-[10px] text-[#9CA3AF] block font-mono">
                  {alert.time} · {alert.clusterNode}
                </span>
              </div>
            ))}
          </div>

          <div className="p-2.5 border-t border-[#F0F0F2] bg-[#FAFAFB]">
            <button
              onClick={handleOpenAlerts}
              className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-[#E8785A] hover:text-[#D96948] py-1"
            >
              <span>Inspect All Alerts</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
