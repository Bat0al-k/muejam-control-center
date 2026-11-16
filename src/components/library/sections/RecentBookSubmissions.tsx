"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLibrary } from "@/features/library/context";
import {
  SubmissionRecord,
  SubmissionStatus,
} from "@/features/library/library.types";
import {
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiXCircle,
  FiEdit3,
  FiFileText,
  FiSliders,
  FiEye,
  FiDownload,
  FiMessageSquare,
  FiInfo,
  FiMoreVertical,
} from "react-icons/fi";

function MiniBookThumb({ theme }: { theme: SubmissionRecord["coverTheme"] }) {
  if (theme === "draft") {
    return (
      <div className="w-9 h-12 rounded-lg bg-[#FAFAFB] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] shrink-0">
        <FiFileText className="w-4 h-4" />
      </div>
    );
  }

  if (theme === "teal") {
    return (
      <div className="w-9 h-12 rounded-lg bg-gradient-to-br from-[#063940] to-[#0B5560] border border-[#006A61]/30 p-1 flex flex-col justify-between text-white shrink-0">
        <div className="bg-white/90 h-2.5 rounded-[2px]" />
        <div className="h-3 rounded-[2px] bg-[#0ea472]/40 border border-[#A7F3D0]/40" />
      </div>
    );
  }

  if (theme === "amber") {
    return (
      <div className="w-9 h-12 rounded-lg bg-gradient-to-br from-[#D96948] to-[#9A3412] border border-[#E8785A]/40 p-1.5 flex flex-col justify-between text-white shrink-0">
        <div className="w-full h-1 bg-amber-200/70 rounded-full" />
        <div className="w-4 h-4 mx-auto rounded-full border border-amber-200/60" />
        <div className="w-full h-1 bg-white/40 rounded-full" />
      </div>
    );
  }

  if (theme === "slate") {
    return (
      <div className="w-9 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex flex-col justify-between shrink-0">
        <div className="w-full h-1.5 bg-slate-300 rounded-full" />
        <div className="w-4 h-4 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40" />
        <div className="w-full h-1 bg-slate-300 rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-9 h-12 rounded-lg bg-[#EAFBF1]/60 border border-[#A7F3D0] p-1.5 flex flex-col justify-between shrink-0">
      <div className="w-full h-1.5 bg-[#006A61]/30 rounded-full" />
      <div className="w-5 h-3 mx-auto rounded-xs bg-[#006A61]/20 border border-[#006A61]/40" />
      <div className="w-full h-1 bg-[#006A61]/30 rounded-full" />
    </div>
  );
}

function renderStatusBadge(status: SubmissionStatus) {
  switch (status) {
    case "Approved":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAFBF1] text-[#065F46] border border-[#A7F3D0]">
          <FiCheckCircle className="w-3.5 h-3.5 text-[#0ea472]" />
          <span>Approved</span>
        </span>
      );
    case "Pending Review":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-[#374151] border border-[#E5E7EB]">
          <FiClock className="w-3.5 h-3.5 text-[#E8785A]" />
          <span>Pending Review</span>
        </span>
      );
    case "Changes Requested":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <FiRefreshCw className="w-3 h-3 text-blue-600" />
          <span>Changes Requested</span>
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
          <FiXCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Rejected</span>
        </span>
      );
    case "Draft":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-[#6B7280] border border-slate-200">
          <FiEdit3 className="w-3 h-3 text-[#6B7280]" />
          <span>Draft</span>
        </span>
      );
  }
}

export function RecentBookSubmissions() {
  const router = useRouter();
  const {
    filteredSubmissions,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    openDrawer,
    showToast,
  } = useLibrary();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
      {/* Header & Search/Tabs */}
      <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F0F0F2]">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold font-syne text-[#111111] tracking-tight">
            Recent Book Submissions
          </h2>
          <p className="text-xs text-[#6B7280] max-w-md leading-relaxed">
            Real-time ingestion feed across public and internal enterprise
            publishers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <FiSliders className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by title, author, or ISBN..."
              aria-label="Filter by title, author, or ISBN"
              className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#E8785A] transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-1 text-xs font-semibold self-start sm:self-auto">
            {(
              [
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "approved", label: "Approved" },
                { id: "issues", label: "Issues" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-[#111111] shadow-2xs border border-[#E5E7EB]"
                    : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F0F0F2] bg-[#F8FAFC] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3.5 px-5">Book Title &amp; Details</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 px-5 text-center text-xs text-[#6B7280]"
                >
                  No book submissions match your current filter criteria.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/dashboard/library/reviews/${item.id}`)}
                  className="hover:bg-[#FAFAFB] transition-colors group cursor-pointer"
                >
                  {/* Book Title & Details */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <MiniBookThumb theme={item.coverTheme} />
                      <div className="min-w-0">
                        <div className="font-bold text-[#111111] text-xs sm:text-sm group-hover:text-[#E8785A] transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-[#6B7280] mt-0.5">
                          {item.isbn} • {item.pages}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${item.authorAvatarBg}`}
                      >
                        {item.authorInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#111111] text-xs truncate">
                          {item.authorName}
                        </div>
                        <div className="text-[11px] text-[#6B7280] truncate">
                          {item.authorEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Submitted */}
                  <td className="py-4 px-4 font-mono">
                    <div
                      className={`text-xs font-semibold ${
                        item.isToday ? "text-[#E8785A]" : "text-[#374151]"
                      }`}
                    >
                      {item.submittedDate}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                      {item.submittedTime}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">{renderStatusBadge(item.status)}</td>

                  {/* Actions */}
                  <td
                    className="py-4 px-5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center justify-end gap-2">
                      {item.status === "Pending Review" ? (
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/library/reviews/${item.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#E8785A] text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      ) : item.status === "Approved" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => router.push(`/dashboard/library/books/${item.id}`)}
                            title="Preview Book"
                            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                "info",
                                `Downloading PDF for "${item.title}"...`
                              )
                            }
                            title="Download PDF"
                            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </>
                      ) : item.status === "Changes Requested" ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              openDrawer({
                                type: "submissionDetails",
                                submissionId: item.id,
                              })
                            }
                            title="Preview Book"
                            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                "info",
                                `Opened editorial notes for ${item.authorName}`
                              )
                            }
                            title="Editorial Feedback"
                            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <FiMessageSquare className="w-4 h-4" />
                          </button>
                        </>
                      ) : item.status === "Rejected" ? (
                        <button
                          type="button"
                          onClick={() =>
                            openDrawer({
                              type: "submissionDetails",
                              submissionId: item.id,
                            })
                          }
                          title="Rejection Reason"
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <FiInfo className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            showToast("info", `Editing draft "${item.title}"...`)
                          }
                          title="Edit Draft"
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openDrawer({
                            type: "submissionDetails",
                            submissionId: item.id,
                          })
                        }
                        title="Inspect Submission"
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 border-t border-[#F0F0F2] bg-[#FAFAFB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B7280]">
        <div>
          Showing{" "}
          <span className="font-bold text-[#111111]">
            {filteredSubmissions.length === 0
              ? "0"
              : `1-${filteredSubmissions.length}`}
          </span>{" "}
          of <span className="font-bold text-[#111111]">14,620</span> records •
          25 items per page
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#374151] font-semibold disabled:opacity-50 transition-colors cursor-pointer"
          >
            &lt; Previous
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg font-bold transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[#111111] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-[#9CA3AF]">...</span>

          <button
            type="button"
            onClick={() => setCurrentPage(585)}
            className={`px-2.5 h-8 rounded-lg font-bold transition-colors cursor-pointer ${
              currentPage === 585
                ? "bg-[#111111] text-white"
                : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-slate-50"
            }`}
          >
            585
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(585, p + 1))}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#374151] font-semibold transition-colors cursor-pointer"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

