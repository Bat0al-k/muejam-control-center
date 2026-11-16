// "use client";

// import React, { useState, useMemo } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useLibrary } from "@/features/library/context";
// import {
//   FiClock,
//   FiSearch,
//   FiArrowRight,
//   FiArrowLeft,
// } from "react-icons/fi";

// export default function ReviewsPage() {
//   const router = useRouter();
//   const { submissions } = useLibrary();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("All");

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return submissions.filter((item) => {
//       if (statusFilter === "Pending" && item.status !== "Pending Review") {
//         return false;
//       }
//       if (statusFilter === "Changes" && item.status !== "Changes Requested") {
//         return false;
//       }
//       if (statusFilter === "Rejected" && item.status !== "Rejected") {
//         return false;
//       }
//       if (statusFilter === "Approved" && item.status !== "Approved") {
//         return false;
//       }

//       if (!q) return true;
//       return (
//         item.title.toLowerCase().includes(q) ||
//         item.authorName.toLowerCase().includes(q) ||
//         item.isbn.toLowerCase().includes(q)
//       );
//     });
//   }, [submissions, search, statusFilter]);

//   return (
//     <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
//         <div className="space-y-1">
//           <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
//             <Link
//               href="/dashboard/library"
//               className="hover:text-[#111111] transition-colors"
//             >
//               Library
//             </Link>
//             <span>&gt;</span>
//             <span className="font-semibold text-[#111111]">Editorial Reviews</span>
//           </div>

//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-syne tracking-tight">
//               Book Reviews Queue
//             </h1>
//             <span className="px-3 py-1 bg-[#F5F3FF] text-[#6366F1] rounded-full text-xs font-semibold border border-[#DDD6FE]">
//               {filtered.length} Submissions
//             </span>
//           </div>
//           <p className="text-xs text-[#6B7280]">
//             Select any manuscript to open the full editorial reader, inspect chapters, verify DRM, and dispatch revision directives.
//           </p>
//         </div>

//         <Link
//           href="/dashboard/library"
//           className="px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-semibold text-[#374151] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
//         >
//           <FiArrowLeft className="w-4 h-4" />
//           <span>Library Overview</span>
//         </Link>
//       </div>

//       {/* Filter Tabs & Search */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
//         <div className="flex items-center gap-1.5 flex-wrap">
//           {["All", "Pending", "Changes", "Approved", "Rejected"].map((tab) => (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => setStatusFilter(tab)}
//               className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${statusFilter === tab
//                   ? "bg-[#111111] text-white shadow-2xs"
//                   : "bg-[#F8FAFC] text-[#6B7280] hover:text-[#111111] border border-[#E5E7EB]"
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="relative w-full md:w-72">
//           <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3 pointer-events-none" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search review submissions..."
//             className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#E8785A] focus:bg-white rounded-xl text-xs text-[#111111] outline-none transition-all"
//           />
//         </div>
//       </div>

//       {/* Reviews Queue List */}
//       <div className="space-y-3">
//         {filtered.map((item) => (
//           <div
//             key={item.id}
//             onClick={() => router.push(`/dashboard/library/reviews/${item.id}`)}
//             className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
//           >
//             <div className="flex items-center gap-4 min-w-0">
//               {/* Cover Mini Box */}
//               <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-[#063940] via-[#0B5560] to-[#041F24] border border-[#006A61]/40 flex items-center justify-center text-white shrink-0 font-syne text-[9px] font-bold shadow-xs">
//                 BOOK
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#374151]">
//                     {item.category || "General"}
//                   </span>
//                   <span
//                     className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${item.status === "Approved"
//                         ? "bg-[#EAFBF1] text-[#065F46] border-[#A7F3D0]"
//                         : item.status === "Rejected"
//                           ? "bg-red-50 text-red-700 border-red-200"
//                           : item.status === "Changes Requested"
//                             ? "bg-blue-50 text-blue-700 border-blue-200"
//                             : "bg-[#F5F3FF] text-[#6366F1] border-[#DDD6FE]"
//                       }`}
//                   >
//                     <FiClock className="w-3 h-3" />
//                     <span>{item.status}</span>
//                   </span>
//                 </div>

//                 <h3 className="text-base font-bold font-syne text-[#111111] group-hover:text-[#E8785A] transition-colors truncate">
//                   {item.title}
//                 </h3>

//                 <p className="text-xs text-[#6B7280] flex items-center gap-1.5 truncate">
//                   <span>By {item.authorName}</span>
//                   <span>•</span>
//                   <span>{item.isbn}</span>
//                   <span>•</span>
//                   <span>{item.pages}</span>
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
//               <span className="text-xs text-[#9CA3AF] font-mono hidden md:inline">
//                 {item.submittedDate}
//               </span>

//               <button
//                 type="button"
//                 className="px-4 py-2 bg-[#111111] group-hover:bg-[#E8785A] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
//               >
//                 <span>Editorial Review</span>
//                 <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  INITIAL_EDITORIAL_REVIEWS,
  INITIAL_PENDING_BOOKS,
} from "@/features/library/mock-data";
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";

type ReviewFilter = "all" | "pending" | "changes" | "approved";

export default function BookReviewsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [query, setQuery] = useState("");

  const allReviews = useMemo(() => {
    return [
      ...INITIAL_EDITORIAL_REVIEWS,
      ...INITIAL_PENDING_BOOKS.filter(
        (b) => !INITIAL_EDITORIAL_REVIEWS.some((r) => r.id === b.id)
      ).map((b) => ({
        id: b.id,
        bookTitle: b.title,
        bookSubtitle: b.coverSubtitle || "Editorial Submission",
        edition: "1st Ed",
        category: b.category,
        version: "v1.0.0",
        status: "Pending Review" as const,
        submittedBy: b.author,
        submittedDate: b.timeAgo,
        editorialQueue: "Technical Archival Tier 1",
        isbn: b.isbn || "978-1-95432-019-2",
        pageCount: b.pages,
        wordCount: "82k",
        chapterCount: 24,
        assetArchiveSize: b.fileSize,
        author: {
          name: b.author,
          degree: "Verified Contributor",
          email: "author@nexus-research.io",
          avatarInitials: b.author.slice(0, 2).toUpperCase(),
          avatarBg: "bg-slate-200 text-slate-800",
          verified: true,
          booksCount: 4,
          avgRating: 4.8,
          tier: "Tier 1 Author",
        },
        chapters: [],
        flaggedIssues: [],
        revisionDirectives: "",
        coverTheme: b.coverTheme,
      })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allReviews.filter((item) => {
      if (filter === "pending" && item.status !== "Pending Review") return false;
      if (filter === "changes" && item.status !== "Changes Requested") return false;
      if (filter === "approved" && item.status !== "Approved") return false;

      if (!q) return true;
      return (
        item.bookTitle.toLowerCase().includes(q) ||
        item.submittedBy.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.isbn.toLowerCase().includes(q)
      );
    });
  }, [allReviews, filter, query]);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-1">
            <Link href="/dashboard/library" className="hover:text-[#111111]">
              Library
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-[#111111]">Book Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
            Editorial Book Reviews
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Conduct formal chapter evaluations, review manuscript diffs, and issue change directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/library"
            className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FAFAFB] text-xs font-semibold text-[#374151] transition-colors"
          >
            ← Back to Overview
          </Link>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-[#6B7280] font-semibold">
              Pending Evaluation
            </span>
            <div className="text-2xl font-extrabold font-syne text-[#E8785A] mt-1">
              14 manuscripts
            </div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#E8785A] flex items-center justify-center font-bold">
            <FiClock className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-[#6B7280] font-semibold">
              Changes Requested
            </span>
            <div className="text-2xl font-extrabold font-syne text-blue-600 mt-1">
              8 manuscripts
            </div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FiAlertCircle className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-[#6B7280] font-semibold">
              Approved This Month
            </span>
            <div className="text-2xl font-extrabold font-syne text-[#059669] mt-1">
              142 publications
            </div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-[#EAFBF1] text-[#059669] flex items-center justify-center font-bold">
            <FiCheckCircle className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold self-start sm:self-auto">
          {(
            [
              { id: "all", label: "All Reviews" },
              { id: "pending", label: "Pending Review" },
              { id: "changes", label: "Changes Requested" },
              { id: "approved", label: "Approved" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === t.id
                ? "bg-[#111111] text-white shadow-2xs"
                : "text-[#6B7280] hover:text-[#111111]"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:bg-white focus:border-[#2520B8] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/dashboard/library/reviews/${item.id}`)}
            className="bg-white border border-[#E5E7EB] hover:border-[#2520B8]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              {/* Category, Version & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#374151]">
                  {item.category}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${item.status === "Approved"
                    ? "bg-[#EAFBF1] text-[#065F46] border-[#A7F3D0]"
                    : item.status === "Changes Requested"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-base font-bold font-syne text-[#111111] group-hover:text-[#2520B8] transition-colors leading-snug">
                  {item.bookTitle}
                </h3>
                <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">
                  {item.bookSubtitle}
                </p>
              </div>

              {/* Author & Stats */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#F0F0F2]">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {item.author.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#111111] truncate">
                    {item.submittedBy}
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] font-mono truncate">
                    {item.isbn} • {item.pageCount} pp
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-between text-xs font-bold text-[#2520B8]">
              <span>Open Editorial Review Studio</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
