"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiBookOpen, FiZap } from "react-icons/fi";

export function ProductSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const isLibrary = pathname?.startsWith("/dashboard/library");
  const isStudio = !isLibrary;

  return (
    <div className="flex items-center bg-[#EDF4F4] p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold">
      {/* Library Platform Button */}
      <button
        onClick={() => router.push("/dashboard/library")}
        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all ${isLibrary
          ? "bg-white text-[#111111] shadow-xs font-bold"
          : "text-[#6B7280] hover:text-[#111111]"
          }`}
      >
        <FiBookOpen className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden xs:inline sm:inline">Library</span>
        <span className="hidden sm:inline px-1.5 py-0.2 rounded-full text-[10px] text-[#037457] bg-[#ECFDF5] font-normal">Platform</span>
      </button>

      {/* Studio Button */}
      <button
        onClick={() => router.push("/dashboard/studio")}
        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all ${isStudio
          ? "bg-white text-[#111111] shadow-xs font-bold"
          : "text-[#6B7280] hover:text-[#111111]"
          }`}
      >
        <FiZap className="w-3.5 h-3.5 text-[#E8785A] shrink-0" />
        <span className="hidden xs:inline sm:inline">Studio</span>
        <span className="hidden sm:inline px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
          AI Studio
        </span>
      </button>
    </div>
  );
}
