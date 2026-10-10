"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStudio } from "@/features/studio/context";
import {
  FiActivity,
  FiUsers,
  FiCreditCard,
  FiFileText,
  FiCompass,
  FiShield,
  FiSettings,
  FiTerminal,
  FiCode,
  FiRepeat,
  FiLogOut,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openDrawer, showToast } = useStudio();

  const [devPopoverOpen, setDevPopoverOpen] = useState(false);
  const devPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (devPopoverRef.current && !devPopoverRef.current.contains(e.target as Node)) {
        setDevPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const studioNavItems = [
    { label: "Studio Overview", href: "/dashboard/studio", icon: FiActivity },
    { label: "Studio Users", href: "/dashboard/studio/users", icon: FiUsers },
    { label: "Credits", href: "/dashboard/studio/credits", icon: FiCreditCard },
    { label: "Transactions", href: "/dashboard/studio/transactions", icon: FiFileText },
    { label: "Activity Logs", href: "/dashboard/studio/activity", icon: FiFileText },
  ];

  const platformNavItems = [
    { label: "Analytics & Insights", href: "/dashboard/studio/usage", icon: FiCompass },
    { label: "Team & Permissions", href: "/dashboard/test-auth", icon: FiShield },
    { label: "Platform Settings", href: "#settings", icon: FiSettings, action: () => showToast("info", "Opening Platform Settings modal...") },
    { label: "API & Webhooks", href: "#api", icon: FiTerminal, action: () => openDrawer({ type: "serviceHealth", serviceId: "webhooks" }) },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between h-full select-none">
      {/* Top Part: Brand Logo + Workspace Box + Nav Links */}
      <div className="flex flex-col overflow-y-auto flex-1">
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-[#F0F0F2] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <Image src="/icons/Muejam.svg" alt="Logo" width={25} height={20} />
          </div>
          <span className="text-2xl font-black tracking-tight font-syne text-[#111111]">
            Muejam<sup className="text-[11px] font-normal ml-0.5 mb-4">©</sup>
            <hr className="bg-[#111111] text-black h-1.5 w-20" />
          </span>
          {/* Close button — mobile only */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Studio Mode / Workspace Box */}
        <div className="p-3">
          <button
            onClick={() => openDrawer({ type: "environment" })}
            className="w-full text-left p-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] hover:border-[#D1D5DB] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                <span className="w-2 h-2 rounded-full bg-[#cf4c1d]" />
                <span>Studio Mode</span>
              </div>
              <span className="text-[11px] font-mono text-[#6B7280] bg-[#ffffff] px-1 py-0.5 rounded">v2.4</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>Active Workspace</span>
              <span className="text-[#cf4c1d] font-semibold flex items-center gap-1">
                Online
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 space-y-6">
          {/* AI STUDIO VERTICAL */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              AI STUDIO VERTICAL
            </div>
            {studioNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard/studio"
                  ? pathname === "/dashboard/studio"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                    ? "bg-[#FFF3EE] text-[#E8785A] border border-[#FCD9CE]"
                    : "text-[#4B5563] hover:text-[#111111] hover:bg-[#F9FAFB]"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[#E8785A]" : "text-[#6B7280]"
                      }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* PLATFORM CORE */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              PLATFORM CORE
            </div>
            {platformNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href !== "#" && pathname === item.href;

              if (item.action) {
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#111111] hover:bg-[#F9FAFB] transition-all text-left"
                  >
                    <Icon className="w-4 h-4 text-[#6B7280]" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                    ? "bg-[#FFF3EE] text-[#E8785A] border border-[#FCD9CE]"
                    : "text-[#4B5563] hover:text-[#111111] hover:bg-[#F9FAFB]"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[#E8785A]" : "text-[#6B7280]"
                      }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Role Developer Box */}
      <div className="p-3 border-t border-[#F0F0F2] relative" ref={devPopoverRef}>
        <button
          onClick={() => setDevPopoverOpen(!devPopoverOpen)}
          className="w-full p-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFB] hover:border-[#D1D5DB] transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center font-mono text-xs">
              <FiCode className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-[#111111] block">Role: Developer</span>
              <span className="text-[#6B7280]">Environment: Active</span>
            </div>
          </div>
          <FiRepeat className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#111111] transition-colors" />
        </button>

        {/* Developer / Account Popover */}
        {devPopoverOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 p-4 text-xs space-y-3 animate-fade-in divide-y divide-[#F0F0F2]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                Console Session
              </span>
              <div className="font-bold text-[#111111] text-sm font-syne">
                Evelyn Rostova
              </div>
              <div className="text-[11px] text-[#6B7280]">
                Workspace: Muejam Primary Core
              </div>
            </div>

            <div className="pt-2.5 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Role:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <FiCheck className="w-3 h-3" /> Developer / Superuser
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Environment:</span>
                <span className="font-semibold text-[#111111]">Production (Active)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Hasura Claims:</span>
                <span className="font-mono text-[#6B7280]">x-hasura-role: dev</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setDevPopoverOpen(false);
                  router.push("/login");
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  // Desktop: sticky sidebar
  // Mobile: slide-in drawer with overlay
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:z-40">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden flex flex-col shadow-2xl animate-slide-in">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
