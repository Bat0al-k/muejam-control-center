"use client";

import React, { useState } from "react";
import { ProductSwitcher } from "./ProductSwitcher";
import { NotificationMenu } from "./NotificationMenu";
import { UserMenu } from "./UserMenu";
import { SearchPalette } from "./SearchPalette";
import { FiSearch } from "react-icons/fi";

export function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-[#E5E7EB] bg-white px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Left: Product Switcher */}
        <div className="flex items-center gap-4">
          <ProductSwitcher />
        </div>

        {/* Center: Search Bar Trigger */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-fit flex items-center justify-between px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-xs text-[#6B7280] transition-colors"
            >
              <div className="flex items-center gap-2 mr-10">
                <FiSearch className="w-4 h-4 text-[#9CA3AF]" />
                <span>Search repository, entries, logs...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E5E7EB] rounded text-[#6B7280]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-4">
            <NotificationMenu />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ⌘K Command Palette Modal */}
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
