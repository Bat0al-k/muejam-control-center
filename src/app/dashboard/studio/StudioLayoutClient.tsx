"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StudioProvider } from "@/features/studio/context";

export function StudioLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <StudioProvider>
      <div className="flex min-h-screen bg-[#FAF8F5] text-[#111111] antialiased">
        {/* Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </StudioProvider>
  );
}
