import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StudioProvider } from "@/features/studio/context";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioProvider>
      <div className="flex min-h-screen bg-[#FAF8F5] text-[#111111] antialiased">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </StudioProvider>
  );
}
