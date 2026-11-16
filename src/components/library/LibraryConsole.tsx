"use client";
import React from "react";
import { LibraryHeader } from "./sections/LibraryHeader";
import { LibraryKpiGrid } from "./sections/LibraryKpiGrid";
import { PendingAdminReview } from "./sections/PendingAdminReview";
import { RecentBookSubmissions } from "./sections/RecentBookSubmissions";
import { LibraryFooter } from "./sections/LibraryFooter";
// Modals
import { ReviewBookModal } from "./modals/ReviewBookModal";
import { SubmitBookModal } from "./modals/SubmitBookModal";
import { ExportLibraryModal } from "./modals/ExportLibraryModal";
// Drawers
import { SubmissionDetailsDrawer } from "./drawers/SubmissionDetailsDrawer";
import { LibraryEnvironmentDrawer } from "./drawers/LibraryEnvironmentDrawer";
// Toast
import { LibraryToastContainer } from "./LibraryToastContainer";

export function LibraryConsole() {
    return (
        <div className="space-y-5 max-w-[1440px] mx-auto">
            {/* 1. Header (Breadcrumbs, Title, Live Sync Badge, Date Filter, Refresh, Export Report, Submit New Book) */}
            <LibraryHeader />

            {/* 2. 6-Card KPI Grid */}
            <LibraryKpiGrid />

            {/* 3. Pending Admin Review Queue */}
            <PendingAdminReview />

            {/* 4. Recent Book Submissions Table */}
            <RecentBookSubmissions />

            {/* 5. Telemetry Footer */}
            <LibraryFooter />

            {/* Drawers */}
            <SubmissionDetailsDrawer />
            <LibraryEnvironmentDrawer />

            {/* Modals */}
            <ReviewBookModal />
            <SubmitBookModal />
            <ExportLibraryModal />

            {/* Floating Toasts */}
            <LibraryToastContainer />
        </div>
    );
}

export default LibraryConsole;


// "use client";

// import React, { useState, useMemo, useRef, useEffect } from "react";
// import Link from "next/link";
// import {
//   FiCalendar,
//   FiDownload,
//   FiPlus,
//   FiChevronDown,
//   FiCheck,
//   FiUsers,
//   FiEdit3,
//   FiBookOpen,
//   FiCheckCircle,
//   FiXCircle,
//   FiArrowRight,
//   FiSearch,
//   FiEye,
//   FiMoreVertical,
//   FiMessageSquare,
//   FiInfo,
//   FiFileText,
//   FiTrendingUp,
//   FiClock,
//   FiRefreshCw,
//   FiX,
//   FiSliders,
// } from "react-icons/fi";

// type DateRangeOption = "7d" | "30d" | "this_month" | "prev_month";
// type SubmissionFilter = "all" | "pending" | "approved" | "issues";
// type SubmissionStatus =
//   | "Approved"
//   | "Pending Review"
//   | "Changes Requested"
//   | "Rejected"
//   | "Draft";

// interface PendingBookItem {
//   id: string;
//   category: string;
//   timeAgo: string;
//   title: string;
//   author: string;
//   pages: number;
//   fileSize: string;
//   secondaryAction: "Quick Reject" | "Inspect";
//   coverTheme: "teal" | "navy" | "light";
//   coverTitle: string;
//   coverSubtitle: string;
// }

// interface SubmissionRecord {
//   id: string;
//   title: string;
//   isbn: string;
//   pages: string;
//   authorName: string;
//   authorEmail: string;
//   authorInitials: string;
//   authorAvatarBg: string;
//   submittedDate: string;
//   submittedTime: string;
//   isToday?: boolean;
//   status: SubmissionStatus;
//   coverTheme: "light" | "teal" | "amber" | "slate" | "draft";
// }

// const INITIAL_PENDING_BOOKS: PendingBookItem[] = [
//   {
//     id: "rev-1",
//     category: "TECHNICAL / AI",
//     timeAgo: "2h ago",
//     title: "Architectures of Tomorrow",
//     author: "Dr. Aris Thorne",
//     pages: 384,
//     fileSize: "18.4 MB PDF",
//     secondaryAction: "Quick Reject",
//     coverTheme: "teal",
//     coverTitle: "ARCHITECTURAL DIGITAL TWINS",
//     coverSubtitle: "SYSTEMS & SIMULATION",
//   },
//   {
//     id: "rev-2",
//     category: "FINTECH",
//     timeAgo: "5h ago",
//     title: "The Quantum Ledger",
//     author: "Sarah Jenkins",
//     pages: 240,
//     fileSize: "12.1 MB PDF",
//     secondaryAction: "Inspect",
//     coverTheme: "navy",
//     coverTitle: "DIGITAL GOLD",
//     coverSubtitle: "THE FINTECH REVOLUTION",
//   },
//   {
//     id: "rev-3",
//     category: "DESIGN SYSTEMS",
//     timeAgo: "1d ago",
//     title: "Designing at Scale",
//     author: "Marcus Brody",
//     pages: 192,
//     fileSize: "32.8 MB PDF",
//     secondaryAction: "Inspect",
//     coverTheme: "light",
//     coverTitle: "LIBRARY",
//     coverSubtitle: "UI COMPONENT ARCHITECTURE",
//   },
// ];

// const INITIAL_SUBMISSIONS: SubmissionRecord[] = [
//   {
//     id: "sub-1",
//     title: "Autonomous Systems in Logistics",
//     isbn: "ISBN 978-0-19-852663",
//     pages: "512 pp",
//     authorName: "Claire Zhang, PhD",
//     authorEmail: "c.zhang@robotics-lab.io",
//     authorInitials: "CZ",
//     authorAvatarBg: "bg-[#006A61]/15 text-[#006A61]",
//     submittedDate: "Oct 24, 2024",
//     submittedTime: "14:22 EST",
//     status: "Approved",
//     coverTheme: "light",
//   },
//   {
//     id: "sub-2",
//     title: "Architectures of Tomorrow",
//     isbn: "ISBN 978-1-44-937332",
//     pages: "384 pp",
//     authorName: "Dr. Aris Thorne",
//     authorEmail: "thorne@futurearch.edu",
//     authorInitials: "AT",
//     authorAvatarBg: "bg-slate-200 text-slate-700",
//     submittedDate: "Today (2h ago)",
//     submittedTime: "09:15 EST",
//     isToday: true,
//     status: "Pending Review",
//     coverTheme: "teal",
//   },
//   {
//     id: "sub-3",
//     title: "Neural Networks Demystified",
//     isbn: "ISBN 978-0-32-157351",
//     pages: "276 pp",
//     authorName: "Mateo Silva",
//     authorEmail: "mateo@deepstream.ai",
//     authorInitials: "MS",
//     authorAvatarBg: "bg-[#FFF3EE] text-[#E8785A]",
//     submittedDate: "Oct 22, 2024",
//     submittedTime: "16:40 EST",
//     status: "Changes Requested",
//     coverTheme: "amber",
//   },
//   {
//     id: "sub-4",
//     title: "Unsupervised Algorithms Vol. II",
//     isbn: "ISBN 978-3-16-148410",
//     pages: "118 pp",
//     authorName: "Liam Gallagher",
//     authorEmail: "lg@independent-pub.org",
//     authorInitials: "LG",
//     authorAvatarBg: "bg-emerald-50 text-emerald-700",
//     submittedDate: "Oct 20, 2024",
//     submittedTime: "11:05 EST",
//     status: "Rejected",
//     coverTheme: "slate",
//   },
//   {
//     id: "sub-5",
//     title: "Federated Intelligence Handbooks",
//     isbn: "Pending ISBN",
//     pages: "420 pp est.",
//     authorName: "Priya Nair",
//     authorEmail: "pnair@nexus-labs.internal",
//     authorInitials: "PN",
//     authorAvatarBg: "bg-purple-50 text-purple-700",
//     submittedDate: "Oct 19, 2024",
//     submittedTime: "18:02 EST",
//     status: "Draft",
//     coverTheme: "draft",
//   },
// ];

// function BookCoverPreview({
//   theme,
//   title,
//   subtitle,
// }: {
//   theme: PendingBookItem["coverTheme"];
//   title: string;
//   subtitle: string;
// }) {
//   if (theme === "teal") {
//     return (
//       <div className="w-[82px] h-[112px] rounded-xl bg-gradient-to-br from-[#063940] via-[#0B5560] to-[#041F24] border border-[#006A61]/40 p-2 flex flex-col justify-between text-white shrink-0 shadow-sm relative overflow-hidden">
//         <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-[#0ea472]/20 blur-md" />
//         <div className="bg-white/95 text-[#063940] rounded px-1.5 py-1 text-[7px] font-extrabold leading-tight tracking-tight uppercase">
//           {title}
//         </div>
//         <div className="space-y-1 relative z-10">
//           <div className="w-full h-6 rounded bg-[#0ea472]/20 border border-[#0ea472]/40 flex items-center justify-center">
//             <span className="text-[6px] font-mono text-[#A7F3D0] tracking-widest">
//               AI • TWINS
//             </span>
//           </div>
//           <p className="text-[6px] text-white/70 font-mono truncate">{subtitle}</p>
//         </div>
//       </div>
//     );
//   }

//   if (theme === "navy") {
//     return (
//       <div className="w-[82px] h-[112px] rounded-xl bg-gradient-to-b from-[#0A1128] via-[#101F42] to-[#050814] border border-slate-700 p-2 flex flex-col justify-between text-white shrink-0 shadow-sm relative overflow-hidden">
//         <div className="text-[8px] font-extrabold tracking-wider text-amber-300 uppercase leading-tight">
//           {title}
//           <div className="text-[5px] text-amber-200/70 font-normal mt-0.5">
//             {subtitle}
//           </div>
//         </div>
//         <div className="my-auto flex items-center justify-center">
//           <div className="w-9 h-9 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center">
//             <div className="w-4 h-4 rotate-45 border border-cyan-300/60 bg-cyan-400/20" />
//           </div>
//         </div>
//         <div className="text-[6px] text-slate-300 font-mono text-center truncate">
//           QUANTUM LEDGER
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-[82px] h-[112px] rounded-xl bg-[#FAFAFB] border border-[#E5E7EB] p-2 flex flex-col justify-between text-[#111111] shrink-0 shadow-sm">
//       <div className="border-b border-[#111111] pb-1">
//         <div className="text-[9px] font-extrabold font-syne tracking-tight uppercase leading-none">
//           {title}
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-1 my-1 flex-1">
//         <div className="bg-[#111111] rounded-xs p-0.5 flex items-end">
//           <span className="w-1.5 h-1.5 rounded-full bg-[#E8785A]" />
//         </div>
//         <div className="border border-[#111111] rounded-xs" />
//         <div className="border border-[#111111] rounded-xs col-span-2 flex items-center justify-center">
//           <span className="text-[5px] font-mono uppercase tracking-wider text-[#6B7280]">
//             {subtitle}
//           </span>
//         </div>
//       </div>
//       <div className="text-[6px] font-mono text-[#6B7280] truncate">
//         DESIGN SYSTEMS
//       </div>
//     </div>
//   );
// }

// function MiniBookThumb({ theme }: { theme: SubmissionRecord["coverTheme"] }) {
//   if (theme === "draft") {
//     return (
//       <div className="w-9 h-12 rounded-lg bg-[#FAFAFB] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] shrink-0">
//         <FiFileText className="w-4 h-4" />
//       </div>
//     );
//   }

//   if (theme === "teal") {
//     return (
//       <div className="w-9 h-12 rounded-lg bg-gradient-to-br from-[#063940] to-[#0B5560] border border-[#006A61]/30 p-1 flex flex-col justify-between text-white shrink-0">
//         <div className="bg-white/90 h-2.5 rounded-[2px]" />
//         <div className="h-3 rounded-[2px] bg-[#0ea472]/40 border border-[#A7F3D0]/40" />
//       </div>
//     );
//   }

//   if (theme === "amber") {
//     return (
//       <div className="w-9 h-12 rounded-lg bg-gradient-to-br from-[#D96948] to-[#9A3412] border border-[#E8785A]/40 p-1.5 flex flex-col justify-between text-white shrink-0">
//         <div className="w-full h-1 bg-amber-200/70 rounded-full" />
//         <div className="w-4 h-4 mx-auto rounded-full border border-amber-200/60" />
//         <div className="w-full h-1 bg-white/40 rounded-full" />
//       </div>
//     );
//   }

//   if (theme === "slate") {
//     return (
//       <div className="w-9 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex flex-col justify-between shrink-0">
//         <div className="w-full h-1.5 bg-slate-300 rounded-full" />
//         <div className="w-4 h-4 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40" />
//         <div className="w-full h-1 bg-slate-300 rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-9 h-12 rounded-lg bg-[#EAFBF1]/60 border border-[#A7F3D0] p-1.5 flex flex-col justify-between shrink-0">
//       <div className="w-full h-1.5 bg-[#006A61]/30 rounded-full" />
//       <div className="w-5 h-3 mx-auto rounded-xs bg-[#006A61]/20 border border-[#006A61]/40" />
//       <div className="w-full h-1 bg-[#006A61]/30 rounded-full" />
//     </div>
//   );
// }

// export function LibraryConsole() {
//   const [dateRange, setDateRange] = useState<DateRangeOption>("30d");
//   const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const [pendingBooks, setPendingBooks] =
//     useState<PendingBookItem[]>(INITIAL_PENDING_BOOKS);
//   const [submissions, setSubmissions] =
//     useState<SubmissionRecord[]>(INITIAL_SUBMISSIONS);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<SubmissionFilter>("all");
//   const [currentPage, setCurrentPage] = useState(1);

//   // Interactive modal states
//   const [selectedBookForReview, setSelectedBookForReview] =
//     useState<PendingBookItem | null>(null);
//   const [submitModalOpen, setSubmitModalOpen] = useState(false);
//   const [newBookTitle, setNewBookTitle] = useState("");
//   const [newBookAuthor, setNewBookAuthor] = useState("");
//   const [newBookEmail, setNewBookEmail] = useState("");
//   const [newBookIsbn, setNewBookIsbn] = useState("");
//   const [newBookPages, setNewBookPages] = useState("");
//   const [toastMessage, setToastMessage] = useState<string | null>(null);

//   const triggerToast = (msg: string) => {
//     setToastMessage(msg);
//     setTimeout(() => {
//       setToastMessage((prev) => (prev === msg ? null : prev));
//     }, 4000);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setDateDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const dateOptions: { label: string; value: DateRangeOption }[] = [
//     { label: "Last 7 Days", value: "7d" },
//     { label: "Last 30 Days", value: "30d" },
//     { label: "This Month", value: "this_month" },
//     { label: "Previous Month", value: "prev_month" },
//   ];

//   const currentDateLabel =
//     dateOptions.find((o) => o.value === dateRange)?.label || "Last 30 Days";

//   const filteredSubmissions = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     return submissions.filter((item) => {
//       if (activeTab === "pending" && item.status !== "Pending Review" && item.status !== "Draft") {
//         return false;
//       }
//       if (activeTab === "approved" && item.status !== "Approved") {
//         return false;
//       }
//       if (
//         activeTab === "issues" &&
//         item.status !== "Rejected" &&
//         item.status !== "Changes Requested"
//       ) {
//         return false;
//       }

//       if (!q) return true;
//       return (
//         item.title.toLowerCase().includes(q) ||
//         item.authorName.toLowerCase().includes(q) ||
//         item.authorEmail.toLowerCase().includes(q) ||
//         item.isbn.toLowerCase().includes(q)
//       );
//     });
//   }, [submissions, searchQuery, activeTab]);

//   const handleApproveBook = (book: PendingBookItem) => {
//     setPendingBooks((prev) => prev.filter((b) => b.id !== book.id));
//     setSubmissions((prev) =>
//       prev.map((sub) =>
//         sub.title === book.title ? { ...sub, status: "Approved" } : sub
//       )
//     );
//     setSelectedBookForReview(null);
//     triggerToast(`"${book.title}" has been approved and indexed in the catalog.`);
//   };

//   const handleRejectBook = (book: PendingBookItem) => {
//     setPendingBooks((prev) => prev.filter((b) => b.id !== book.id));
//     setSubmissions((prev) =>
//       prev.map((sub) =>
//         sub.title === book.title ? { ...sub, status: "Rejected" } : sub
//       )
//     );
//     setSelectedBookForReview(null);
//     triggerToast(`"${book.title}" was marked as policy non-compliant.`);
//   };

//   const handleCreateSubmission = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newBookTitle.trim() || !newBookAuthor.trim()) return;

//     const initials = newBookAuthor
//       .trim()
//       .split(" ")
//       .map((p) => p[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);

//     const created: SubmissionRecord = {
//       id: `sub-${Date.now()}`,
//       title: newBookTitle.trim(),
//       isbn: newBookIsbn.trim() ? `ISBN ${newBookIsbn.trim()}` : "Pending ISBN",
//       pages: newBookPages.trim() ? `${newBookPages.trim()} pp` : "320 pp est.",
//       authorName: newBookAuthor.trim(),
//       authorEmail: newBookEmail.trim() || "author@publisher.io",
//       authorInitials: initials || "AU",
//       authorAvatarBg: "bg-[#FFF3EE] text-[#E8785A]",
//       submittedDate: "Just now",
//       submittedTime: "Live EST",
//       isToday: true,
//       status: "Pending Review",
//       coverTheme: "teal",
//     };

//     setSubmissions((prev) => [created, ...prev]);
//     setSubmitModalOpen(false);
//     setNewBookTitle("");
//     setNewBookAuthor("");
//     setNewBookEmail("");
//     setNewBookIsbn("");
//     setNewBookPages("");
//     triggerToast(`"${created.title}" submitted to the editorial review queue.`);
//   };

//   const renderStatusBadge = (status: SubmissionStatus) => {
//     switch (status) {
//       case "Approved":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAFBF1] text-[#065F46] border border-[#A7F3D0]">
//             <FiCheckCircle className="w-3.5 h-3.5 text-[#0ea472]" />
//             <span>Approved</span>
//           </span>
//         );
//       case "Pending Review":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-[#374151] border border-[#E5E7EB]">
//             <FiClock className="w-3.5 h-3.5 text-[#E8785A]" />
//             <span>Pending Review</span>
//           </span>
//         );
//       case "Changes Requested":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
//             <FiRefreshCw className="w-3 h-3 text-blue-600" />
//             <span>Changes Requested</span>
//           </span>
//         );
//       case "Rejected":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
//             <FiXCircle className="w-3.5 h-3.5 text-red-600" />
//             <span>Rejected</span>
//           </span>
//         );
//       case "Draft":
//       default:
//         return (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-[#6B7280] border border-slate-200">
//             <FiEdit3 className="w-3 h-3 text-[#6B7280]" />
//             <span>Draft</span>
//           </span>
//         );
//     }
//   };

//   return (
//     <div className="space-y-5 max-w-[1440px] mx-auto">
//       {/* Floating Toast Notification */}
//       {toastMessage && (
//         <div
//           role="status"
//           className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#111111] text-white text-xs font-semibold shadow-lg border border-white/10 animate-fade-in"
//         >
//           <span className="w-2 h-2 rounded-full bg-[#0ea472]" />
//           <span>{toastMessage}</span>
//           <button
//             type="button"
//             onClick={() => setToastMessage(null)}
//             className="ml-2 text-white/60 hover:text-white"
//           >
//             <FiX className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       )}

//       {/* 1. Top Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1">
//         <div className="space-y-1">
//           <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
//             <span>Verticals</span>
//             <span>&gt;</span>
//             <span>Digital Library</span>
//             <span>&gt;</span>
//             <span className="font-semibold text-[#111111]">Overview</span>
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-syne tracking-tight">
//               Library Overview
//             </h1>

//             <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAFBF1] text-[#065F46] rounded-full text-xs font-semibold border border-[#A7F3D0] shadow-2xs">
//               <span className="w-2 h-2 rounded-full bg-[#0ea472] animate-pulse" />
//               <span>Live Sync Active</span>
//             </span>
//           </div>
//         </div>

//         {/* Right Controls */}
//         <div className="flex items-center gap-2.5 flex-wrap">
//           {/* Date Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               type="button"
//               onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
//               className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-2xs"
//             >
//               <FiCalendar className="w-3.5 h-3.5 text-[#6B7280]" />
//               <span>{currentDateLabel}</span>
//               <FiChevronDown
//                 className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${
//                   dateDropdownOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {dateDropdownOpen && (
//               <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 z-30 text-xs">
//                 {dateOptions.map((opt) => {
//                   const isSelected = dateRange === opt.value;
//                   return (
//                     <button
//                       key={opt.value}
//                       type="button"
//                       onClick={() => {
//                         setDateRange(opt.value);
//                         setDateDropdownOpen(false);
//                         triggerToast(`Filtered Library metrics for ${opt.label}`);
//                       }}
//                       className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#FFF5F2] transition-colors ${
//                         isSelected
//                           ? "text-[#E8785A] font-semibold bg-[#FFF8F6]"
//                           : "text-[#374151]"
//                       }`}
//                     >
//                       <span>{opt.label}</span>
//                       {isSelected && (
//                         <FiCheck className="w-3.5 h-3.5 text-[#E8785A]" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Export Report Button */}
//           <button
//             type="button"
//             onClick={() =>
//               triggerToast("Exporting Digital Library telemetry report (CSV)...")
//             }
//             className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl text-xs font-semibold text-[#374151] hover:bg-[#EDF4F4] transition-colors shadow-2xs"
//           >
//             <FiDownload className="w-3.5 h-3.5 text-[#6B7280]" />
//             <span>Export Report</span>
//           </button>

//           {/* Submit New Book Primary CTA */}
//           <button
//             type="button"
//             onClick={() => setSubmitModalOpen(true)}
//             className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#E8785A] active:scale-[0.99] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm"
//           >
//             <FiPlus className="w-4 h-4" />
//             <span>Submit New Book</span>
//           </button>
//         </div>
//       </div>

//       {/* 2. 6-Column KPI Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//         {/* Card 1: Total Users */}
//         <Link
//           href="/dashboard/library/users"
//           className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between"
//         >
//           <div className="flex items-center justify-between gap-2 mb-3">
//             <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111111] transition-colors">
//               Total Users
//             </span>
//             <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
//               <FiUsers className="w-3.5 h-3.5" />
//             </span>
//           </div>
//           <div>
//             <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
//               12,840
//             </div>
//             <div className="flex items-center gap-1 text-[11px] mt-2">
//               <span className="font-bold text-[#059669]">↑ 8.4%</span>
//               <span className="text-[#6B7280]">this month</span>
//             </div>
//           </div>
//         </Link>

//         {/* Card 2: Total Authors */}
//         <Link
//           href="/dashboard/library/users"
//           className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between"
//         >
//           <div className="flex items-center justify-between gap-2 mb-3">
//             <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111111] transition-colors">
//               Total Authors
//             </span>
//             <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
//               <FiEdit3 className="w-3.5 h-3.5" />
//             </span>
//           </div>
//           <div>
//             <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
//               1,420
//             </div>
//             <div className="flex items-center gap-1 text-[11px] mt-2">
//               <FiTrendingUp className="w-3 h-3 text-[#059669] shrink-0" />
//               <span className="font-bold text-[#059669]">+14.2%</span>
//               <span className="text-[#6B7280] truncate">contributors</span>
//             </div>
//           </div>
//         </Link>

//         {/* Card 3: Total Books */}
//         <div className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between">
//           <div className="flex items-center justify-between gap-2 mb-3">
//             <span className="text-xs font-semibold text-[#6B7280]">
//               Total Books
//             </span>
//             <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
//               <FiBookOpen className="w-3.5 h-3.5" />
//             </span>
//           </div>
//           <div>
//             <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
//               8,650
//             </div>
//             <div className="text-[11px] text-[#6B7280] mt-2">
//               <span className="font-semibold text-[#374151]">99.1%</span> indexed
//             </div>
//           </div>
//         </div>

//         {/* Card 4: Pending Books (Highlighted) */}
//         <button
//           type="button"
//           onClick={() => setActiveTab("pending")}
//           className="bg-white border border-[#FCD9CE] hover:border-[#E8785A] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
//         >
//           <div className="flex items-center justify-between gap-1.5 mb-3">
//             <span className="text-xs font-bold text-[#111111]">
//               Pending Books
//             </span>
//             <span className="px-1.5 py-0.5 rounded text-[9px] font-bold leading-tight bg-[#FFF3EE] text-[#E8785A] border border-[#FCD9CE] text-center">
//               Action Req.
//             </span>
//           </div>
//           <div>
//             <div className="text-2xl font-extrabold font-syne text-[#E8785A] tracking-tight">
//               {31 + pendingBooks.length}
//             </div>
//             <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E8785A] mt-2">
//               <span className="w-2 h-2 rounded-full bg-[#E8785A]" />
//               <span>Awaiting Editorial</span>
//             </div>
//           </div>
//         </button>

//         {/* Card 5: Approved Books */}
//         <button
//           type="button"
//           onClick={() => setActiveTab("approved")}
//           className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
//         >
//           <div className="flex items-center justify-between gap-2 mb-3">
//             <span className="text-xs font-semibold text-[#6B7280]">
//               Approved Books
//             </span>
//             <span className="w-7 h-7 rounded-lg bg-[#EAFBF1] text-[#059669] flex items-center justify-center shrink-0">
//               <FiCheckCircle className="w-3.5 h-3.5" />
//             </span>
//           </div>
//           <div>
//             <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
//               7,912
//             </div>
//             <div className="text-[11px] text-[#6B7280] mt-2">
//               <span className="font-bold text-[#059669]">91.4%</span> active catalog
//             </div>
//           </div>
//         </button>

//         {/* Card 6: Rejected Books */}
//         <button
//           type="button"
//           onClick={() => setActiveTab("issues")}
//           className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
//         >
//           <div className="flex items-center justify-between gap-2 mb-3">
//             <span className="text-xs font-semibold text-[#6B7280]">
//               Rejected Books
//             </span>
//             <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#6B7280] flex items-center justify-center shrink-0">
//               <FiXCircle className="w-3.5 h-3.5" />
//             </span>
//           </div>
//           <div>
//             <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
//               204
//             </div>
//             <div className="text-[11px] text-[#6B7280] mt-2 truncate">
//               Policy non-compliant
//             </div>
//           </div>
//         </button>
//       </div>

//       {/* 3. Pending Admin Review Section */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//           <div className="flex items-center gap-2.5">
//             <span className="w-2.5 h-2.5 rounded-full bg-[#E8785A]" />
//             <h2 className="text-base sm:text-lg font-bold font-syne text-[#111111] tracking-tight">
//               Pending Admin Review
//             </h2>
//             <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#6B7280] border border-[#E5E7EB]">
//               {11 + pendingBooks.length} waiting
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setActiveTab("pending");
//               triggerToast("Filtered table to show pending editorial queue.");
//             }}
//             className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#006A61] hover:text-[#E8785A] transition-colors self-start sm:self-auto"
//           >
//             <span>Enter Full Review Queue</span>
//             <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
//           </button>
//         </div>

//         {/* 3 Cards Grid */}
//         {pendingBooks.length === 0 ? (
//           <div className="bg-[#FAFAFB] border border-dashed border-[#D1D5DB] rounded-2xl p-8 text-center">
//             <p className="text-sm font-bold font-syne text-[#111111]">
//               All immediate review items cleared!
//             </p>
//             <p className="text-xs text-[#6B7280] mt-1">
//               No high-priority manuscripts are waiting in the spotlight queue.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {pendingBooks.map((book) => (
//               <div
//                 key={book.id}
//                 className="bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all hover:shadow-sm"
//               >
//                 <div className="flex items-start gap-3.5">
//                   <BookCoverPreview
//                     theme={book.coverTheme}
//                     title={book.coverTitle}
//                     subtitle={book.coverSubtitle}
//                   />

//                   <div className="min-w-0 flex-1 space-y-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-[#374151]">
//                         {book.category}
//                       </span>
//                       <span className="text-[11px] font-semibold text-[#E8785A]">
//                         {book.timeAgo}
//                       </span>
//                     </div>

//                     <h3 className="text-sm sm:text-base font-bold font-syne text-[#111111] leading-snug pt-0.5">
//                       {book.title}
//                     </h3>

//                     <p className="text-xs text-[#6B7280]">{book.author}</p>

//                     <p className="text-[11px] font-mono text-[#6B7280] pt-1">
//                       {book.pages} pages • {book.fileSize}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedBookForReview(book)}
//                     className="flex-1 py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#E8785A] text-white text-xs font-bold transition-colors cursor-pointer"
//                   >
//                     Review Now
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       book.secondaryAction === "Quick Reject"
//                         ? handleRejectBook(book)
//                         : setSelectedBookForReview(book)
//                     }
//                     className="py-2 px-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFB] text-[#374151] text-xs font-semibold transition-colors cursor-pointer"
//                   >
//                     {book.secondaryAction}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* 4. Recent Book Submissions Table Section */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
//         {/* Section Header & Search/Filter Controls */}
//         <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F0F0F2]">
//           <div className="space-y-1">
//             <h2 className="text-base sm:text-lg font-bold font-syne text-[#111111] tracking-tight">
//               Recent Book Submissions
//             </h2>
//             <p className="text-xs text-[#6B7280] max-w-md leading-relaxed">
//               Real-time ingestion feed across public and internal enterprise
//               publishers
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end gap-2.5">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-72">
//               <FiSliders className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Filter by title, author, or ISBN..."
//                 aria-label="Filter by title, author, or ISBN"
//                 className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#E8785A] transition-colors"
//               />
//             </div>

//             {/* Filter Tabs */}
//             <div className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-1 text-xs font-semibold self-start sm:self-auto">
//               {(
//                 [
//                   { id: "all", label: "All" },
//                   { id: "pending", label: "Pending" },
//                   { id: "approved", label: "Approved" },
//                   { id: "issues", label: "Issues" },
//                 ] as const
//               ).map((tab) => (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() => {
//                     setActiveTab(tab.id);
//                     setCurrentPage(1);
//                   }}
//                   className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
//                     activeTab === tab.id
//                       ? "bg-white text-[#111111] shadow-2xs border border-[#E5E7EB]"
//                       : "text-[#6B7280] hover:text-[#111111]"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Submissions Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs">
//             <thead>
//               <tr className="border-b border-[#F0F0F2] bg-[#F8FAFC] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
//                 <th className="py-3.5 px-5">Book Title &amp; Details</th>
//                 <th className="py-3.5 px-4">Author</th>
//                 <th className="py-3.5 px-4">Submitted</th>
//                 <th className="py-3.5 px-4">Status</th>
//                 <th className="py-3.5 px-5 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
//               {filteredSubmissions.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="py-10 px-5 text-center text-xs text-[#6B7280]"
//                   >
//                     No book submissions match your current filter criteria.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredSubmissions.map((item) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-[#FAFAFB] transition-colors group"
//                   >
//                     {/* Book Title & Details */}
//                     <td className="py-4 px-5">
//                       <div className="flex items-center gap-3.5">
//                         <MiniBookThumb theme={item.coverTheme} />
//                         <div className="min-w-0">
//                           <div className="font-bold text-[#111111] text-xs sm:text-sm group-hover:text-[#E8785A] transition-colors truncate">
//                             {item.title}
//                           </div>
//                           <div className="text-[11px] font-mono text-[#6B7280] mt-0.5">
//                             {item.isbn} • {item.pages}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Author */}
//                     <td className="py-4 px-4">
//                       <div className="flex items-center gap-2.5">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${item.authorAvatarBg}`}
//                         >
//                           {item.authorInitials}
//                         </div>
//                         <div className="min-w-0">
//                           <div className="font-bold text-[#111111] text-xs truncate">
//                             {item.authorName}
//                           </div>
//                           <div className="text-[11px] text-[#6B7280] truncate">
//                             {item.authorEmail}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Submitted */}
//                     <td className="py-4 px-4 font-mono">
//                       <div
//                         className={`text-xs font-semibold ${
//                           item.isToday ? "text-[#E8785A]" : "text-[#374151]"
//                         }`}
//                       >
//                         {item.submittedDate}
//                       </div>
//                       <div className="text-[11px] text-[#9CA3AF] mt-0.5">
//                         {item.submittedTime}
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="py-4 px-4">{renderStatusBadge(item.status)}</td>

//                     {/* Actions */}
//                     <td className="py-4 px-5 text-right whitespace-nowrap">
//                       <div className="inline-flex items-center justify-end gap-2">
//                         {item.status === "Pending Review" ? (
//                           <button
//                             type="button"
//                             onClick={() => {
//                               const found = pendingBooks.find(
//                                 (b) => b.title === item.title
//                               ) || {
//                                 id: item.id,
//                                 category: "EDITORIAL QUEUE",
//                                 timeAgo: "Today",
//                                 title: item.title,
//                                 author: item.authorName,
//                                 pages: parseInt(item.pages, 10) || 320,
//                                 fileSize: "16.2 MB PDF",
//                                 secondaryAction: "Inspect" as const,
//                                 coverTheme: "teal" as const,
//                                 coverTitle: item.title.toUpperCase(),
//                                 coverSubtitle: item.isbn,
//                               };
//                               setSelectedBookForReview(found);
//                             }}
//                             className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#E8785A] text-white text-[11px] font-bold transition-colors cursor-pointer"
//                           >
//                             Review
//                           </button>
//                         ) : item.status === "Approved" ? (
//                           <>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 triggerToast(`Previewing "${item.title}"...`)
//                               }
//                               title="Preview Book"
//                               className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                             >
//                               <FiEye className="w-4 h-4" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 triggerToast(`Downloading PDF for "${item.title}"...`)
//                               }
//                               title="Download PDF"
//                               className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                             >
//                               <FiDownload className="w-4 h-4" />
//                             </button>
//                           </>
//                         ) : item.status === "Changes Requested" ? (
//                           <>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 triggerToast(`Viewing "${item.title}"...`)
//                               }
//                               title="Preview Book"
//                               className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                             >
//                               <FiEye className="w-4 h-4" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 triggerToast(
//                                   `Opened editorial notes for ${item.authorName}`
//                                 )
//                               }
//                               title="Editorial Feedback"
//                               className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                             >
//                               <FiMessageSquare className="w-4 h-4" />
//                             </button>
//                           </>
//                         ) : item.status === "Rejected" ? (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               triggerToast(
//                                 `Policy violation log opened for "${item.title}"`
//                               )
//                             }
//                             title="Rejection Reason"
//                             className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                           >
//                             <FiInfo className="w-4 h-4" />
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               triggerToast(`Editing draft "${item.title}"...`)
//                             }
//                             title="Edit Draft"
//                             className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                           >
//                             <FiEdit3 className="w-4 h-4" />
//                           </button>
//                         )}

//                         <button
//                           type="button"
//                           onClick={() =>
//                             triggerToast(`More actions for "${item.title}"`)
//                           }
//                           title="More options"
//                           className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100 transition-colors"
//                         >
//                           <FiMoreVertical className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Table Footer / Pagination */}
//         <div className="px-5 py-3.5 border-t border-[#F0F0F2] bg-[#FAFAFB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B7280]">
//           <div>
//             Showing{" "}
//             <span className="font-bold text-[#111111]">
//               1-{filteredSubmissions.length}
//             </span>{" "}
//             of <span className="font-bold text-[#111111]">14,620</span> records
//             • 25 items per page
//           </div>

//           <div className="flex items-center gap-1.5">
//             <button
//               type="button"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#374151] font-semibold disabled:opacity-50 transition-colors cursor-pointer"
//             >
//               &lt; Previous
//             </button>

//             {[1, 2, 3].map((page) => (
//               <button
//                 key={page}
//                 type="button"
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-8 h-8 rounded-lg font-bold transition-colors cursor-pointer ${
//                   currentPage === page
//                     ? "bg-[#111111] text-white"
//                     : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-slate-50"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <span className="px-1 text-[#9CA3AF]">...</span>

//             <button
//               type="button"
//               onClick={() => setCurrentPage(585)}
//               className={`px-2.5 h-8 rounded-lg font-bold transition-colors cursor-pointer ${
//                 currentPage === 585
//                   ? "bg-[#111111] text-white"
//                   : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-slate-50"
//               }`}
//             >
//               585
//             </button>

//             <button
//               type="button"
//               onClick={() => setCurrentPage((p) => Math.min(585, p + 1))}
//               className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#374151] font-semibold transition-colors cursor-pointer"
//             >
//               Next &gt;
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Review / Inspect Modal */}
//       {selectedBookForReview && (
//         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFF3EE] text-[#E8785A] border border-[#FCD9CE]">
//                   {selectedBookForReview.category} • Editorial Review
//                 </span>
//                 <h3 className="text-lg font-extrabold font-syne text-[#111111] mt-1.5">
//                   {selectedBookForReview.title}
//                 </h3>
//                 <p className="text-xs text-[#6B7280]">
//                   By {selectedBookForReview.author} •{" "}
//                   {selectedBookForReview.pages} pages (
//                   {selectedBookForReview.fileSize})
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedBookForReview(null)}
//                 className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100"
//               >
//                 <FiX className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2 text-xs text-[#374151]">
//               <div className="flex items-center justify-between">
//                 <span className="text-[#6B7280]">Automated DRM &amp; Copyright Scan</span>
//                 <span className="font-semibold text-[#059669]">Passed (99.4%)</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-[#6B7280]">Formatting &amp; TOC Structure</span>
//                 <span className="font-semibold text-[#059669]">Verified PDF/A</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-[#6B7280]">Submitted</span>
//                 <span className="font-mono text-[#111111]">
//                   {selectedBookForReview.timeAgo}
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-2.5 pt-2">
//               <button
//                 type="button"
//                 onClick={() => handleRejectBook(selectedBookForReview)}
//                 className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
//               >
//                 Reject Submission
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleApproveBook(selectedBookForReview)}
//                 className="px-4 py-2 rounded-xl bg-[#E8785A] hover:bg-[#D96948] text-white text-xs font-bold transition-colors shadow-xs"
//               >
//                 Approve &amp; Publish
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Submit New Book Modal */}
//       {submitModalOpen && (
//         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-extrabold font-syne text-[#111111]">
//                 Submit New Book
//               </h3>
//               <button
//                 type="button"
//                 onClick={() => setSubmitModalOpen(false)}
//                 className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-slate-100"
//               >
//                 <FiX className="w-4 h-4" />
//               </button>
//             </div>

//             <form onSubmit={handleCreateSubmission} className="space-y-3 text-xs">
//               <div>
//                 <label className="block font-semibold text-[#374151] mb-1">
//                   Book Title *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={newBookTitle}
//                   onChange={(e) => setNewBookTitle(e.target.value)}
//                   placeholder="e.g. Distributed AI Systems"
//                   className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#E8785A]"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block font-semibold text-[#374151] mb-1">
//                     Author Name *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={newBookAuthor}
//                     onChange={(e) => setNewBookAuthor(e.target.value)}
//                     placeholder="Dr. Elena Vance"
//                     className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#E8785A]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-semibold text-[#374151] mb-1">
//                     Author Email
//                   </label>
//                   <input
//                     type="email"
//                     value={newBookEmail}
//                     onChange={(e) => setNewBookEmail(e.target.value)}
//                     placeholder="vance@lab.io"
//                     className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#E8785A]"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block font-semibold text-[#374151] mb-1">
//                     ISBN
//                   </label>
//                   <input
//                     type="text"
//                     value={newBookIsbn}
//                     onChange={(e) => setNewBookIsbn(e.target.value)}
//                     placeholder="978-0-19-852663"
//                     className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#E8785A]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-semibold text-[#374151] mb-1">
//                     Page Count
//                   </label>
//                   <input
//                     type="number"
//                     value={newBookPages}
//                     onChange={(e) => setNewBookPages(e.target.value)}
//                     placeholder="340"
//                     className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#E8785A]"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-end gap-2 pt-3">
//                 <button
//                   type="button"
//                   onClick={() => setSubmitModalOpen(false)}
//                   className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#374151] font-semibold hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-xl bg-[#E8785A] hover:bg-[#D96948] text-white font-bold shadow-xs"
//                 >
//                   Submit to Queue
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LibraryConsole;
