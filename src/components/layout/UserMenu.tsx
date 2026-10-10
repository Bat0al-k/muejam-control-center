"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "@/features/studio/context";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiUser, FiSettings, FiLogOut, FiShield } from "react-icons/fi";

export function UserMenu() {
  const { showToast } = useStudio();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    showToast("info", "Signing out of Muejam Control Center...");
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-[#F3F4F6] transition-colors"
      >
        {/* Avatar matching screenshot */}
        <div className="w-8 h-8 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden border border-[#D1D5DB]">
          <span>ER</span>
        </div>
        <span className="text-xs font-bold text-[#111111] hidden sm:inline">
          Evelyn Rostova
        </span>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-30 animate-fade-in overflow-hidden text-xs divide-y divide-[#F0F0F2]">
          <div className="p-3.5 bg-[#FAFAFB]">
            <span className="font-bold text-[#111111] block font-syne">
              Evelyn Rostova
            </span>
            <span className="text-[11px] text-[#6B7280] block">
              evelyn.rostova@muejam.com
            </span>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EDF4F4] text-stone-700 text-[10px] font-semibold">
              <FiShield className="w-3 h-3 text-[#E8785A]" />
              Role: Developer
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/studio/users"); // هنا بروفايله م الاستودسو نقسه 
              }}
              className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-[#374151] hover:bg-[#FFF5F2] hover:text-[#E8785A] transition-colors"
            >
              <FiUser className="w-3.5 h-3.5" />
              <span>Studio Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                showToast("info", "Opening platform preferences");
              }}
              className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-[#374151] hover:bg-[#FFF5F2] hover:text-[#E8785A] transition-colors"
            >
              <FiSettings className="w-3.5 h-3.5" />
              <span>Platform Settings</span>
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={handleSignOut}
              className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
