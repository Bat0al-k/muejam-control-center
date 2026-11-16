"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLibrary } from "@/features/library/context";
import { LibraryModalShell } from "./LibraryModalShell";
import { FiArrowRight } from "react-icons/fi";

export function ReviewBookModal() {
  const router = useRouter();
  const {
    activeModal,
    closeModal,
    approveBook,
    rejectBook,
    requestChangesForBook,
  } = useLibrary();

  const [reviewNote, setReviewNote] = useState("");

  if (activeModal?.type !== "reviewBook") return null;

  const { book } = activeModal;

  return (
    <LibraryModalShell
      isOpen={true}
      onClose={closeModal}
      title={book.title}
      subtitle={`${book.category} • By ${book.author} • ${book.pages} pages (${book.fileSize})`}
      maxWidthClass="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              closeModal();
              router.push(`/dashboard/library/reviews/${book.id}`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors cursor-pointer mr-auto"
          >
            <span>Open Reader</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => rejectBook(book)}
            className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => requestChangesForBook(book, reviewNote)}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#374151] text-xs font-bold transition-colors cursor-pointer"
          >
            Request Changes
          </button>
          <button
            type="button"
            onClick={() => approveBook(book)}
            className="px-4 py-2 rounded-xl bg-[#E8785A] hover:bg-[#D96948] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Approve &amp; Publish
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2.5 text-xs text-[#374151]">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Automated DRM &amp; Copyright Scan</span>
            <span className="font-semibold text-[#059669]">Passed (99.4%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Formatting &amp; TOC Structure</span>
            <span className="font-semibold text-[#059669]">Verified PDF/A</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Identifier</span>
            <span className="font-mono text-[#111111]">
              {book.isbn || "Pending Assignment"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Submitted</span>
            <span className="font-mono text-[#111111]">{book.timeAgo}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Editorial Notes (optional)
          </label>
          <textarea
            rows={3}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Add notes for the author or catalog team..."
            className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
          />
        </div>
      </div>
    </LibraryModalShell>
  );
}

