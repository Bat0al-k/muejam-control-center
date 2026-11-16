"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLibrary } from "@/features/library/context";
import { LibraryDrawerShell } from "./LibraryDrawerShell";
import { FiBookOpen, FiMail, FiUser, FiCalendar, FiCheckCircle } from "react-icons/fi";

export function SubmissionDetailsDrawer() {
  const router = useRouter();
  const { activeDrawer, closeDrawer, submissions, showToast } =
    useLibrary();

  if (activeDrawer?.type !== "submissionDetails") return null;

  const submission = submissions.find(
    (item) => item.id === activeDrawer.submissionId
  );

  if (!submission) return null;

  const handleOpenReview = () => {
    closeDrawer();
    router.push(`/dashboard/library/reviews/${submission.id}`);
  };

  return (
    <LibraryDrawerShell
      isOpen={true}
      onClose={closeDrawer}
      title={submission.title}
      subtitle={`${submission.isbn} • ${submission.pages}`}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF3EE] text-[#E8785A] border border-[#FCD9CE]">
          {submission.status}
        </span>
      }
      footer={
        <>
          <button
            type="button"
            onClick={() =>
              showToast("info", `Exported metadata for "${submission.title}"`)
            }
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-xs font-semibold text-[#374151] cursor-pointer"
          >
            Export Metadata
          </button>
          <button
            type="button"
            onClick={handleOpenReview}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#E8785A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Open Editorial Review
          </button>
        </>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Author Block */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${submission.authorAvatarBg}`}
          >
            {submission.authorInitials}
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-[#111111] text-sm flex items-center gap-1.5">
              <FiUser className="w-3.5 h-3.5 text-[#E8785A]" />
              <span>{submission.authorName}</span>
            </div>
            <div className="text-[#6B7280] flex items-center gap-1.5">
              <FiMail className="w-3.5 h-3.5" />
              <span>{submission.authorEmail}</span>
            </div>
          </div>
        </div>

        {/* Ingestion Metadata */}
        <div className="rounded-2xl border border-[#E5E7EB] divide-y divide-[#F0F0F2]">
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[#6B7280] flex items-center gap-2">
              <FiBookOpen className="w-4 h-4 text-[#006A61]" />
              Category
            </span>
            <span className="font-bold text-[#111111]">
              {submission.category || "DIGITAL CATALOG"}
            </span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[#6B7280] flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-[#E8785A]" />
              Submitted Timestamp
            </span>
            <span className="font-mono font-semibold text-[#111111]">
              {submission.submittedDate} • {submission.submittedTime}
            </span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[#6B7280] flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-[#059669]" />
              Package Format
            </span>
            <span className="font-mono text-[#111111]">
              {submission.fileSize || "PDF/A Verified"}
            </span>
          </div>
        </div>
      </div>
    </LibraryDrawerShell>
  );
}

