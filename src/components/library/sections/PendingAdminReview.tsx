"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLibrary } from "@/features/library/context";
import { PendingBookItem } from "@/features/library/library.types";
import { FiArrowRight } from "react-icons/fi";

function BookCoverPreview({
  theme,
  title,
  subtitle,
}: {
  theme: PendingBookItem["coverTheme"];
  title: string;
  subtitle: string;
}) {
  if (theme === "teal") {
    return (
      <div className="w-[82px] h-[112px] rounded-xl bg-gradient-to-br from-[#063940] via-[#0B5560] to-[#041F24] border border-[#006A61]/40 p-2 flex flex-col justify-between text-white shrink-0 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-[#0ea472]/20 blur-md" />
        <div className="bg-white/95 text-[#063940] rounded px-1.5 py-1 text-[7px] font-extrabold leading-tight tracking-tight uppercase">
          {title}
        </div>
        <div className="space-y-1 relative z-10">
          <div className="w-full h-6 rounded bg-[#0ea472]/20 border border-[#0ea472]/40 flex items-center justify-center">
            <span className="text-[6px] font-mono text-[#A7F3D0] tracking-widest">
              AI • TWINS
            </span>
          </div>
          <p className="text-[6px] text-white/70 font-mono truncate">{subtitle}</p>
        </div>
      </div>
    );
  }

  if (theme === "navy") {
    return (
      <div className="w-[82px] h-[112px] rounded-xl bg-gradient-to-b from-[#0A1128] via-[#101F42] to-[#050814] border border-slate-700 p-2 flex flex-col justify-between text-white shrink-0 shadow-sm relative overflow-hidden">
        <div className="text-[8px] font-extrabold tracking-wider text-amber-300 uppercase leading-tight">
          {title}
          <div className="text-[5px] text-amber-200/70 font-normal mt-0.5">
            {subtitle}
          </div>
        </div>
        <div className="my-auto flex items-center justify-center">
          <div className="w-9 h-9 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center">
            <div className="w-4 h-4 rotate-45 border border-cyan-300/60 bg-cyan-400/20" />
          </div>
        </div>
        <div className="text-[6px] text-slate-300 font-mono text-center truncate">
          QUANTUM LEDGER
        </div>
      </div>
    );
  }

  return (
    <div className="w-[82px] h-[112px] rounded-xl bg-[#FAFAFB] border border-[#E5E7EB] p-2 flex flex-col justify-between text-[#111111] shrink-0 shadow-sm">
      <div className="border-b border-[#111111] pb-1">
        <div className="text-[9px] font-extrabold font-syne tracking-tight uppercase leading-none">
          {title}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 my-1 flex-1">
        <div className="bg-[#111111] rounded-xs p-0.5 flex items-end">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8785A]" />
        </div>
        <div className="border border-[#111111] rounded-xs" />
        <div className="border border-[#111111] rounded-xs col-span-2 flex items-center justify-center">
          <span className="text-[5px] font-mono uppercase tracking-wider text-[#6B7280]">
            {subtitle}
          </span>
        </div>
      </div>
      <div className="text-[6px] font-mono text-[#6B7280] truncate">
        DESIGN SYSTEMS
      </div>
    </div>
  );
}

export function PendingAdminReview() {
  const router = useRouter();
  const {
    pendingBooks,
    rejectBook,
  } = useLibrary();

  const waitingCount = 11 + pendingBooks.length;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8785A]" />
          <h2 className="text-base sm:text-lg font-bold font-syne text-[#111111] tracking-tight">
            Pending Admin Review
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#6B7280] border border-[#E5E7EB]">
            {waitingCount} waiting
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            router.push("/dashboard/library/reviews");
          }}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#006A61] hover:text-[#E8785A] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>Enter Full Review Queue</span>
          <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Review Spotlight Cards */}
      {pendingBooks.length === 0 ? (
        <div className="bg-[#FAFAFB] border border-dashed border-[#D1D5DB] rounded-2xl p-8 text-center">
          <p className="text-sm font-bold font-syne text-[#111111]">
            All immediate review items cleared!
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            No high-priority manuscripts are waiting in the spotlight queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingBooks.slice(0, 3).map((book) => (
            <div
              key={book.id}
              className="bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <BookCoverPreview
                  theme={book.coverTheme}
                  title={book.coverTitle}
                  subtitle={book.coverSubtitle}
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-[#374151]">
                      {book.category}
                    </span>
                    <span className="text-[11px] font-semibold text-[#E8785A]">
                      {book.timeAgo}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-syne text-[#111111] leading-snug pt-0.5">
                    {book.title}
                  </h3>

                  <p className="text-xs text-[#6B7280]">{book.author}</p>

                  <p className="text-[11px] font-mono text-[#6B7280] pt-1">
                    {book.pages} pages • {book.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/library/reviews/${book.id}`)}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#E8785A] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Review Now
                </button>

                <button
                  type="button"
                  onClick={() =>
                    book.secondaryAction === "Quick Reject"
                      ? rejectBook(book)
                      : router.push(`/dashboard/library/reviews/${book.id}`)
                  }
                  className="py-2 px-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFB] text-[#374151] text-xs font-semibold transition-colors cursor-pointer"
                >
                  {book.secondaryAction}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

