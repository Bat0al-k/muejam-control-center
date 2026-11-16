// "use client";

// import React, { useState, useRef, useMemo } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useLibrary } from "@/features/library/context";
// import {
//   FiClock,
//   FiX,
//   FiCheck,
//   FiCopy,
//   FiList,
//   FiZoomIn,
//   FiZoomOut,
//   FiMaximize2,
//   FiMinimize2,
//   FiUser,
//   FiBookOpen,
//   FiStar,
//   FiEdit3,
//   FiSend,
//   FiPlus,
//   FiCheckCircle,
//   FiChevronLeft,
//   FiChevronRight,
//   FiArrowLeft,
// } from "react-icons/fi";

// interface EditorialReviewViewProps {
//   bookId?: string;
//   onBack?: () => void;
// }

// export function EditorialReviewView({ bookId, onBack }: EditorialReviewViewProps) {
//   const router = useRouter();
//   const { submissions, pendingBooks, approveBook, rejectBook, showToast } =
//     useLibrary();

//   // Find book from submissions or pending list, fallback to Distributed Systems default
//   const matchedSubmission = useMemo(() => {
//     if (!bookId) return submissions[0];
//     const decoded = decodeURIComponent(bookId);
//     return (
//       submissions.find(
//         (s) =>
//           s.id === decoded ||
//           s.title.toLowerCase() === decoded.toLowerCase() ||
//           s.id.includes(decoded) ||
//           decoded.includes(s.id)
//       ) ||
//       submissions.find((s) => s.id === "sub-distributed-systems") ||
//       submissions[0]
//     );
//   }, [bookId, submissions]);

//   const bookTitle = matchedSubmission?.title || "Distributed Systems at Scale";
//   const authorName = matchedSubmission?.authorName || "Dr. Aris Thorne";
//   const isbn = matchedSubmission?.isbn || "978-1-95432-019-2";
//   const pagesCount = matchedSubmission?.pages?.replace(/\D/g, "") || "384";
//   const category = matchedSubmission?.category || "Systems Engineering";
//   const subtitle =
//     matchedSubmission?.subtitle ||
//     "Fault-Tolerant Architectures in Cloud Environments";
//   const version = matchedSubmission?.version || "v2.4.0-RC1";
//   const editorialQueue =
//     matchedSubmission?.editorialQueue || "Technical Archival Tier 1";
//   const submittedDate = matchedSubmission?.submittedDate || "April 12, 2025";

//   // Document reader state
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalDocumentPages = 312;
//   const [zoomLevel, setZoomLevel] = useState<number>(100);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [tocOpen, setTocOpen] = useState(false);
//   const [annotationOpen, setAnnotationOpen] = useState(false);
//   const [annotationText, setAnnotationText] = useState("");
//   const readerContainerRef = useRef<HTMLDivElement>(null);

//   // Editorial feedback state
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([
//     "Code Licensing",
//   ]);
//   const [feedbackText, setFeedbackText] = useState(
//     `Chapter 4 review remarks:
// 1. Figure 4.2: Please upload vector SVG source and confirmation of reprint clearance rights.
// 2. In Listing 4.1 (Raft log append), the monotonic timestamp synchronization synchronization should reference the TrueTime API.`
//   );
//   const [notifyAuthor, setNotifyAuthor] = useState(true);
//   const [status, setStatus] = useState<string>(
//     matchedSubmission?.status || "Pending Review"
//   );
//   const feedbackInputRef = useRef<HTMLTextAreaElement>(null);

//   const toggleCategory = (cat: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
//     );
//   };

//   const handleApprove = () => {
//     const matchedPending = pendingBooks.find((b) => b.title === bookTitle);
//     if (matchedPending) {
//       approveBook(matchedPending);
//     } else {
//       showToast(
//         "success",
//         `"${bookTitle}" has been approved and moved to the published catalog.`
//       );
//     }
//     setStatus("Approved");
//   };

//   const handleReject = () => {
//     const matchedPending = pendingBooks.find((b) => b.title === bookTitle);
//     if (matchedPending) {
//       rejectBook(matchedPending);
//     } else {
//       showToast("info", `"${bookTitle}" was marked as policy non-compliant.`);
//     }
//     setStatus("Rejected");
//   };

//   const handleRequestChanges = () => {
//     feedbackInputRef.current?.scrollIntoView({ behavior: "smooth" });
//     feedbackInputRef.current?.focus();
//     showToast("info", "Specify required revisions in the Editorial Feedback panel.");
//   };

//   const handleSubmitChangeRequest = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feedbackText.trim()) {
//       showToast("error", "Please write revision instructions before submitting.");
//       return;
//     }
//     setStatus("Changes Requested");
//     showToast(
//       "success",
//       `Revision directives dispatched to ${authorName} with ${selectedCategories.length} flagged categories.`
//     );
//   };

//   const handleClearDraft = () => {
//     setFeedbackText("");
//     setSelectedCategories([]);
//     showToast("info", "Editorial draft cleared.");
//   };

//   const handleZoomIn = () => {
//     setZoomLevel((z) => Math.min(150, z + 10));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel((z) => Math.max(70, z - 10));
//   };

//   const handleToggleFullscreen = () => {
//     if (!document.fullscreenElement && readerContainerRef.current) {
//       readerContainerRef.current.requestFullscreen?.();
//       setIsFullscreen(true);
//     } else if (document.exitFullscreen) {
//       document.exitFullscreen?.();
//       setIsFullscreen(false);
//     }
//   };

//   const categoriesList = [
//     "Format & Layout",
//     "Code Licensing",
//     "Citation Missing",
//     "Typo / Grammar",
//     "Scope Adjustment",
//   ];

//   return (
//     <div className="space-y-5 max-w-[1440px] mx-auto pb-10">
//       {/* 1. Header Navigation & Top Action Bar */}
//       <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-2">
//         <div className="space-y-1.5 min-w-0">
//           {/* Breadcrumbs */}
//           <div className="flex items-center gap-1.5 text-xs text-[#6B7280] flex-wrap">
//             <Link
//               href="/dashboard/library"
//               className="hover:text-[#111111] transition-colors"
//             >
//               Library
//             </Link>
//             <span>&gt;</span>
//             <Link
//               href="/dashboard/library/books"
//               className="hover:text-[#111111] transition-colors"
//             >
//               Book Reviews
//             </Link>
//             <span>&gt;</span>
//             <span className="font-semibold text-[#111111] truncate max-w-xs sm:max-w-md">
//               {bookTitle} (2nd Ed)
//             </span>
//           </div>

//           {/* Title & Badges */}
//           <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
//             <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111111] font-syne tracking-tight">
//               Editorial Review: {bookTitle}
//             </h1>

//             <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5F3FF] text-[#6366F1] border border-[#DDD6FE]">
//               {version}
//             </span>

//             <span
//               className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status === "Approved"
//                   ? "bg-[#EAFBF1] text-[#065F46] border-[#A7F3D0]"
//                   : status === "Rejected"
//                     ? "bg-red-50 text-red-700 border-red-200"
//                     : status === "Changes Requested"
//                       ? "bg-blue-50 text-blue-700 border-blue-200"
//                       : "bg-[#F5F3FF] text-[#6366F1] border-[#DDD6FE]"
//                 }`}
//             >
//               <FiClock className="w-3.5 h-3.5" />
//               <span>{status}</span>
//             </span>
//           </div>

//           {/* Subtitle & Submitted metadata */}
//           <p className="text-xs text-[#6B7280]">
//             Submitted by <strong className="text-[#111111]">{authorName}</strong> on{" "}
//             {submittedDate} • Editorial Queue:{" "}
//             <span className="text-[#374151] font-medium">{editorialQueue}</span>
//           </p>
//         </div>

//         {/* Top Right Action Buttons (Reject, Request Changes, Approve) */}
//         <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-start shrink-0">
//           {/* Back button if passed onBack */}
//           {onBack ? (
//             <button
//               type="button"
//               onClick={onBack}
//               className="px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-semibold text-[#374151] transition-colors flex items-center gap-1.5 cursor-pointer"
//             >
//               <FiArrowLeft className="w-4 h-4" />
//               <span>Back</span>
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={() => router.push("/dashboard/library")}
//               className="px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-semibold text-[#374151] transition-colors flex items-center gap-1.5 cursor-pointer"
//             >
//               <FiArrowLeft className="w-4 h-4" />
//               <span>Back to Library</span>
//             </button>
//           )}

//           {/* Reject Book Button */}
//           <button
//             type="button"
//             onClick={handleReject}
//             className="px-3.5 py-2 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
//           >
//             <FiX className="w-3.5 h-3.5" />
//             <span>Reject Book</span>
//           </button>

//           {/* Request Changes Button */}
//           <button
//             type="button"
//             onClick={handleRequestChanges}
//             className="px-3.5 py-2 bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#6366F1] border border-[#DDD6FE] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
//           >
//             <FiCopy className="w-3.5 h-3.5" />
//             <span>Request Changes</span>
//           </button>

//           {/* Approve Book Button */}
//           <button
//             type="button"
//             onClick={handleApprove}
//             className="px-4 py-2 bg-[#006A61] hover:bg-[#005750] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
//           >
//             <FiCheck className="w-4 h-4" />
//             <span>Approve Book</span>
//           </button>
//         </div>
//       </div>

//       {/* 2. Main Two-Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
//         {/* LEFT COLUMN: Manuscript Reader / Document Viewer (approx 63% width) */}
//         <div
//           ref={readerContainerRef}
//           className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[820px]"
//         >
//           {/* Top Reader Toolbar */}
//           <div className="px-4 py-3 border-b border-[#F0F0F2] bg-white flex items-center justify-between text-xs text-[#374151] select-none">
//             <div className="flex items-center gap-3">
//               {/* TOC Menu Toggle */}
//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() => setTocOpen(!tocOpen)}
//                   className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-colors"
//                   title="Table of Contents"
//                 >
//                   <FiList className="w-4 h-4" />
//                 </button>

//                 {tocOpen && (
//                   <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-30 p-3 text-xs space-y-1 animate-fade-in">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2 block mb-1">
//                       Table of Contents
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setCurrentPage(1);
//                         setTocOpen(false);
//                       }}
//                       className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#F5F3FF] text-[#6366F1] font-semibold"
//                     >
//                       Chapter 1: The Haunting of Foundations
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setCurrentPage(34);
//                         setTocOpen(false);
//                       }}
//                       className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-[#374151]"
//                     >
//                       Chapter 2: Consensus &amp; Partitions
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setCurrentPage(78);
//                         setTocOpen(false);
//                       }}
//                       className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-[#374151]"
//                     >
//                       Chapter 3: Raft Log Append Latency
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setCurrentPage(120);
//                         setTocOpen(false);
//                       }}
//                       className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-[#374151]"
//                     >
//                       Chapter 4: Vector Clocks &amp; Reprints
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Page Indicator */}
//               <span className="font-semibold text-[#111111] text-xs">
//                 Page {currentPage} of {totalDocumentPages}
//               </span>
//             </div>

//             {/* Right toolbar controls: Zoom & Fullscreen */}
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={handleZoomOut}
//                 className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-colors"
//                 title="Zoom Out"
//               >
//                 <FiZoomOut className="w-4 h-4" />
//               </button>

//               <span className="font-mono text-xs text-[#374151] px-1 font-semibold">
//                 {zoomLevel}%
//               </span>

//               <button
//                 type="button"
//                 onClick={handleZoomIn}
//                 className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-colors"
//                 title="Zoom In"
//               >
//                 <FiZoomIn className="w-4 h-4" />
//               </button>

//               <button
//                 type="button"
//                 onClick={handleToggleFullscreen}
//                 className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111111] transition-colors ml-1"
//                 title="Toggle Fullscreen"
//               >
//                 {isFullscreen ? (
//                   <FiMinimize2 className="w-4 h-4" />
//                 ) : (
//                   <FiMaximize2 className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Reader Document Canvas (Background surface with Paper Page) */}
//           <div className="flex-1 bg-[#F8FAFC] p-4 sm:p-8 flex items-center justify-center overflow-auto relative">
//             {/* The White Page */}
//             <div
//               style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
//               className="w-full max-w-[560px] bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-8 sm:p-12 text-[#1F2937] transition-transform duration-150 relative min-h-[680px]"
//             >
//               {/* Marginal Annotation Pin (Left Margin) */}
//               <div className="absolute -left-3 sm:-left-4 top-24">
//                 <button
//                   type="button"
//                   onClick={() => setAnnotationOpen(!annotationOpen)}
//                   className="w-7 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
//                   title="Add inline marginal note"
//                 >
//                   <FiPlus className="w-4 h-4" />
//                 </button>

//                 {/* Inline Annotation Popover */}
//                 {annotationOpen && (
//                   <div className="absolute left-9 top-0 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-20 p-3 space-y-2 text-xs">
//                     <div className="flex items-center justify-between">
//                       <span className="font-bold text-[#111111] text-[11px]">
//                         Marginal Annotation
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() => setAnnotationOpen(false)}
//                         className="text-[#9CA3AF] hover:text-[#111111]"
//                       >
//                         <FiX className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                     <textarea
//                       rows={2}
//                       value={annotationText}
//                       onChange={(e) => setAnnotationText(e.target.value)}
//                       placeholder="Attach note to Paragraph 1..."
//                       className="w-full p-2 border border-[#D1D5DB] rounded-lg text-xs outline-none focus:border-[#006A61] resize-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         if (annotationText.trim()) {
//                           showToast("info", "Annotation pinned to page 1.");
//                           setAnnotationText("");
//                           setAnnotationOpen(false);
//                         }
//                       }}
//                       className="w-full py-1.5 rounded-lg bg-[#006A61] text-white font-bold text-[11px]"
//                     >
//                       Pin Note
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Chapter Header */}
//               <div className="text-center pt-2 pb-6">
//                 <h2 className="font-serif tracking-[0.25em] text-lg sm:text-xl font-bold text-[#111111] uppercase">
//                   CHAPTER ONE
//                 </h2>
//                 <div className="w-12 h-0.5 bg-[#D1D5DB] mx-auto mt-3" />
//               </div>

//               {/* Manuscript Prose Content */}
//               <div className="font-serif text-[14px] sm:text-[15px] leading-[2] text-[#24292F] space-y-5 text-justify">
//                 <p>
//                   No live organism can continue for long to exist sanely under
//                   conditions of absolute reality; even larks and katydids are
//                   supposed, by some, to dream. Hill House, not sane, stood by
//                   itself against its hills, holding darkness within; it had
//                   stood so for eighty years and might stand for eighty more.
//                 </p>

//                 <p>
//                   Within, walls continued upright, bricks met neatly, floors
//                   were firm, and doors were sensibly shut; silence lay steadily
//                   against the wood and stone of Hill House, and whatever walked
//                   there, walked alone.
//                 </p>

//                 <p>
//                   Dr. John Montague was a doctor of philosophy; he had taken his
//                   degree in anthropology, feeling obscurely that in this field
//                   he might come closest to his true vocation, the analysis of
//                   supernatural manifestations. He was scrupulous in his use of
//                   his title, because his investigations being so unscientific,
//                   he hoped to borrow an air of respectability, even scholarly
//                   authority, from his education.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Reader Footer: Previous & Next Page */}
//           <div className="px-5 py-3 border-t border-[#F0F0F2] bg-white flex items-center justify-between text-xs text-[#6B7280]">
//             <button
//               type="button"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 text-[#374151] font-semibold transition-colors disabled:opacity-40 cursor-pointer"
//             >
//               <FiChevronLeft className="w-4 h-4" />
//               <span>Previous</span>
//             </button>

//             <span className="font-mono text-xs text-[#9CA3AF]">
//               {currentPage} / {totalDocumentPages}
//             </span>

//             <button
//               type="button"
//               onClick={() =>
//                 setCurrentPage((p) => Math.min(totalDocumentPages, p + 1))
//               }
//               disabled={currentPage === totalDocumentPages}
//               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 text-[#374151] font-semibold transition-colors disabled:opacity-40 cursor-pointer"
//             >
//               <span>Next</span>
//               <FiChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: 3 Metacards (Book Info, Author Dossier, Editorial Feedback) (approx 37% width) */}
//         <div className="lg:col-span-5 space-y-4">
//           {/* CARD 1: BOOK SUMMARY CARD */}
//           <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
//             <div className="flex items-start gap-4">
//               {/* Cover Thumbnail */}
//               <div className="w-[82px] h-[112px] rounded-xl bg-gradient-to-b from-[#0A1128] via-[#101F42] to-[#050814] border border-slate-700 p-2 flex flex-col justify-between text-white shrink-0 shadow-sm relative overflow-hidden">
//                 <div className="text-[8px] font-extrabold tracking-wider text-amber-300 uppercase leading-tight">
//                   AT SCALE
//                   <div className="text-[5px] text-amber-200/70 font-normal mt-0.5">
//                     2nd Ed
//                   </div>
//                 </div>
//                 <div className="my-auto flex items-center justify-center">
//                   <div className="w-9 h-9 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center">
//                     <div className="w-4 h-4 rotate-45 border border-cyan-300/60 bg-cyan-400/20" />
//                   </div>
//                 </div>
//                 <div className="text-[6px] text-slate-300 font-mono text-center truncate">
//                   DISTRIBUTED SYSTEMS
//                 </div>
//               </div>

//               {/* Title & Details */}
//               <div className="min-w-0 space-y-1">
//                 <span className="text-[11px] font-semibold text-[#6B7280]">
//                   {category}
//                 </span>

//                 <h3 className="text-base sm:text-lg font-bold font-syne text-[#111111] leading-snug">
//                   {bookTitle}
//                 </h3>

//                 <p className="text-xs text-[#6B7280] leading-relaxed">
//                   {subtitle}
//                 </p>

//                 <p className="text-[11px] font-mono text-[#9CA3AF] pt-0.5">
//                   ISBN: {isbn}
//                 </p>
//               </div>
//             </div>

//             {/* 4-Grid Stats */}
//             <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F0F0F2]">
//               <div className="space-y-0.5">
//                 <span className="text-[11px] text-[#6B7280] block">Page Count</span>
//                 <span className="text-lg font-bold font-syne text-[#111111]">
//                   {pagesCount}
//                 </span>
//               </div>

//               <div className="space-y-0.5">
//                 <span className="text-[11px] text-[#6B7280] block">Word Count</span>
//                 <span className="text-lg font-bold font-syne text-[#111111]">
//                   {matchedSubmission?.wordCount || "112.4k"}
//                 </span>
//               </div>

//               <div className="space-y-0.5">
//                 <span className="text-[11px] text-[#6B7280] block">
//                   Chapter Count
//                 </span>
//                 <span className="text-lg font-bold font-syne text-[#111111]">
//                   {matchedSubmission?.chapterCount || 42}
//                 </span>
//               </div>

//               <div className="space-y-0.5">
//                 <span className="text-[11px] text-[#6B7280] block">
//                   Asset Archive
//                 </span>
//                 <span className="text-lg font-bold font-syne text-[#111111]">
//                   {matchedSubmission?.assetArchive || "14.8 MB"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* CARD 2: AUTHOR DOSSIER */}
//           <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
//                 AUTHOR DOSSIER
//               </span>

//               <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
//                 <FiCheckCircle className="w-3 h-3 text-emerald-600" />
//                 <span>Verified</span>
//               </span>
//             </div>

//             {/* Profile Row */}
//             <div className="flex items-center gap-3.5">
//               <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-sm text-[#111111] shrink-0 overflow-hidden">
//                 <span className="font-syne">AT</span>
//               </div>

//               <div className="min-w-0 space-y-0.5">
//                 <h4 className="text-sm font-bold text-[#111111]">{authorName}</h4>
//                 <p className="text-xs text-[#6B7280]">
//                   {matchedSubmission?.authorDegree || "PhD Computer Science, MIT"}
//                 </p>
//                 <p className="text-xs font-mono text-[#9CA3AF] truncate">
//                   {matchedSubmission?.authorEmail || "a.thorne@nexus-research.io"}
//                 </p>
//               </div>
//             </div>

//             {/* Meta Row: 6 Books • 4.9 Avg • Tier 1 Author */}
//             <div className="flex items-center gap-2 text-xs text-[#374151] pt-1">
//               <span className="inline-flex items-center gap-1">
//                 <FiBookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
//                 <span>{matchedSubmission?.authorBooksCount || 6} Books</span>
//               </span>
//               <span>•</span>
//               <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
//                 <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
//                 <span>{matchedSubmission?.authorRating || "4.9"} Avg</span>
//               </span>
//               <span>•</span>
//               <span className="text-[#6B7280]">
//                 {matchedSubmission?.authorTier || "Tier 1 Author"}
//               </span>
//             </div>

//             {/* View Profile Button */}
//             <Link
//               href="/dashboard/library/authors"
//               className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-bold text-[#111111] transition-colors"
//             >
//               <FiUser className="w-3.5 h-3.5 text-[#6B7280]" />
//               <span>View Profile</span>
//             </Link>
//           </div>

//           {/* CARD 3: EDITORIAL FEEDBACK */}
//           <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <FiEdit3 className="w-4 h-4 text-[#6366F1]" />
//                 <h3 className="text-sm font-bold font-syne text-[#111111]">
//                   Editorial Feedback
//                 </h3>
//               </div>
//               <span className="text-xs font-mono text-[#9CA3AF]">
//                 Step 2 of 2
//               </span>
//             </div>

//             <p className="text-xs text-[#6B7280] leading-relaxed">
//               Tag issues and specify required manuscript corrections before
//               re-submitting to technical layout.
//             </p>

//             {/* Flagged Issue Categories */}
//             <div className="space-y-2">
//               <span className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
//                 Flagged Issue Categories
//               </span>
//               <div className="flex items-center gap-1.5 flex-wrap">
//                 {categoriesList.map((cat) => {
//                   const isSelected = selectedCategories.includes(cat);
//                   return (
//                     <button
//                       key={cat}
//                       type="button"
//                       onClick={() => toggleCategory(cat)}
//                       className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected
//                           ? "bg-[#2520B8] text-white shadow-2xs"
//                           : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
//                         }`}
//                     >
//                       {cat}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Detailed Revision Directives */}
//             <form onSubmit={handleSubmitChangeRequest} className="space-y-3 pt-1">
//               <div className="flex items-center justify-between text-xs">
//                 <label className="font-bold text-[#374151]">
//                   Detailed Revision Directives
//                 </label>
//                 <span className="font-mono text-[#9CA3AF]">
//                   {feedbackText.length} chars
//                 </span>
//               </div>

//               <textarea
//                 ref={feedbackInputRef}
//                 rows={5}
//                 value={feedbackText}
//                 onChange={(e) => setFeedbackText(e.target.value)}
//                 placeholder="Write specific feedback remarks and required adjustments..."
//                 className="w-full p-3 bg-white border border-[#D1D5DB] focus:border-[#2520B8] focus:ring-2 focus:ring-[#2520B8]/10 rounded-xl text-xs text-[#111111] leading-relaxed outline-none resize-none transition-all"
//               />

//               {/* Notify Checkbox */}
//               <div className="flex items-start gap-2.5 pt-1">
//                 <input
//                   type="checkbox"
//                   id="notifyAuthorCheckbox"
//                   checked={notifyAuthor}
//                   onChange={(e) => setNotifyAuthor(e.target.checked)}
//                   className="w-4 h-4 rounded text-[#2520B8] focus:ring-[#2520B8] mt-0.5 cursor-pointer"
//                 />
//                 <label
//                   htmlFor="notifyAuthorCheckbox"
//                   className="text-xs text-[#374151] cursor-pointer"
//                 >
//                   <span className="font-semibold block">
//                     Notify author via email &amp; direct message
//                   </span>
//                   <span className="text-[11px] text-[#9CA3AF]">
//                     Automated dispatch upon ticket status change
//                   </span>
//                 </label>
//               </div>

//               {/* Submit Change Request Action */}
//               <div className="space-y-2 pt-2">
//                 <button
//                   type="submit"
//                   className="w-full py-2.5 px-4 bg-[#2520B8] hover:bg-[#1D1996] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
//                 >
//                   <FiSend className="w-3.5 h-3.5" />
//                   <span>Submit Change Request</span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleClearDraft}
//                   className="w-full text-center text-xs text-[#6B7280] hover:text-[#111111] font-semibold py-1 cursor-pointer transition-colors"
//                 >
//                   Cancel / Clear Draft
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorialReviewView;



"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useLibrary } from "@/features/library/context";
import {
  BookEditorialReview,
  SubmissionStatus,
} from "@/features/library/library.types";
import {
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiList,
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiMinimize,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiBookOpen,
  FiCheck,
  FiFileText,
  // FiExternalLink,
  // FiArrowRight,
  // FiClock,
} from "react-icons/fi";

interface EditorialReviewViewProps {
  initialReview: BookEditorialReview;
}

const ISSUE_CATEGORIES = [
  "Format & Layout",
  "Code Licensing",
  "Citation Missing",
  "Typo / Grammar",
  "Scope Adjustment",
];

export function EditorialReviewView({ initialReview }: EditorialReviewViewProps) {
  // const router = useRouter();
  const { showToast, approveBook, rejectBook } = useLibrary();

  const [review, setReview] = useState<BookEditorialReview>(initialReview);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = review.pageCount || 312;

  // Zoom controls (80% to 130%)
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const readerContainerRef = useRef<HTMLDivElement>(null);


  // Editorial Feedback State
  const [flaggedIssues, setFlaggedIssues] = useState<string[]>(
    review.flaggedIssues || ["Code Licensing"]
  );
  const [revisionDirectives, setRevisionDirectives] = useState(
    review.revisionDirectives ||
    "Chapter 4 review remarks:\n1. Figure 4.2: Please upload vector SVG source and confirmation of reprint clearance rights.\n2. In Listing 4.1 (Raft log append), the monotonic timestamp synchronization..."
  );
  const [notifyAuthor, setNotifyAuthor] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(true);

  // Inline comment marker on canvas
  const [inlineCommentOpen, setInlineCommentOpen] = useState(false);
  const [inlineCommentText, setInlineCommentText] = useState("");
  const [savedInlineComments, setSavedInlineComments] = useState<
    Array<{ id: string; paragraph: number; text: string; time: string }>
  >([
    {
      id: "c1",
      paragraph: 1,
      text: "Verify terminology alignment with Chapter 3 state-machine formalisms.",
      time: "24m ago",
    },
  ]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement && readerContainerRef.current) {
      readerContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const activeChapter =
    review.chapters[currentChapterIdx] || review.chapters[0];

  const handleToggleIssue = (cat: string) => {
    if (flaggedIssues.includes(cat)) {
      setFlaggedIssues(flaggedIssues.filter((c) => c !== cat));
    } else {
      setFlaggedIssues([...flaggedIssues, cat]);
    }
  };

  const handleApprove = () => {
    setReview((prev) => ({ ...prev, status: "Approved" }));
    approveBook({
      id: review.id,
      category: review.category,
      timeAgo: "Just now",
      title: review.bookTitle,
      author: review.author.name,
      pages: review.pageCount,
      fileSize: review.assetArchiveSize,
      secondaryAction: "Inspect",
      coverTheme: "teal",
      coverTitle: review.bookTitle.toUpperCase(),
      coverSubtitle: review.isbn,
      isbn: review.isbn,
    });
    showToast(
      "success",
      `"${review.bookTitle}" has been approved and moved to the publishing catalog.`
    );
  };

  const handleReject = () => {
    setReview((prev) => ({ ...prev, status: "Rejected" }));
    rejectBook({
      id: review.id,
      category: review.category,
      timeAgo: "Just now",
      title: review.bookTitle,
      author: review.author.name,
      pages: review.pageCount,
      fileSize: review.assetArchiveSize,
      secondaryAction: "Quick Reject",
      coverTheme: review.coverTheme || "slate",
      coverTitle: review.bookTitle.toUpperCase(),
      coverSubtitle: review.isbn,
      isbn: review.isbn,
    });
    showToast(
      "error",
      `"${review.bookTitle}" was rejected due to editorial non-compliance.`
    );
  };

  const handleSubmitChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setReview((prev) => ({ ...prev, status: "Changes Requested" }));
    showToast(
      "info",
      `Change request dispatched to ${review.author.name}. Ticket status updated.`
    );
  };

  const handleAddInlineComment = () => {
    if (!inlineCommentText.trim()) return;
    setSavedInlineComments([
      ...savedInlineComments,
      {
        id: `ic-${Date.now()}`,
        paragraph: 1,
        text: inlineCommentText.trim(),
        time: "Just now",
      },
    ]);
    setInlineCommentText("");
    setInlineCommentOpen(false);
    showToast("success", "Inline editorial annotation pinned to Chapter 1.");
  };

  const renderStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAFBF1] text-[#065F46] border border-[#A7F3D0]">
            <FiCheckCircle className="w-3.5 h-3.5 text-[#0ea472]" />
            <span>Approved</span>
          </span>
        );
      case "Changes Requested":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <FiAlertCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Changes Requested</span>
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <FiX className="w-3.5 h-3.5 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      case "Pending Review":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`space-y-5 max-w-[1520px] mx-auto pb-12 ${isFullscreen ? "fixed inset-0 z-50 bg-[#FAF8F5] p-6 overflow-y-auto" : ""
        }`}
    >
      {/* 1. Top Breadcrumbs, Title, Meta & Primary Action Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        {/* Left info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Link
              href="/dashboard/library"
              className="hover:text-[#111111] transition-colors"
            >
              Library
            </Link>
            <span>&gt;</span>
            <Link
              href="/dashboard/library/reviews"
              className="hover:text-[#111111] transition-colors"
            >
              Book Reviews
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-[#111111] truncate max-w-xs sm:max-w-md">
              {review.bookTitle} ({review.edition})
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
              Editorial Review: {review.bookTitle}
            </h1>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
              {review.version}
            </span>

            {renderStatusBadge(review.status)}
          </div>

          <p className="text-xs text-[#6B7280]">
            Submitted by{" "}
            <strong className="text-[#111111] font-semibold">
              {review.submittedBy}
            </strong>{" "}
            on {review.submittedDate} • Editorial Queue:{" "}
            <span className="font-medium text-[#374151]">
              {review.editorialQueue}
            </span>
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap self-start xl:self-center">
          {/* Reject */}
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer shadow-2xs"
          >
            <FiX className="w-3.5 h-3.5" />
            <span>Reject Book</span>
          </button>

          {/* Request Changes */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("editorial-directives");
              el?.scrollIntoView({ behavior: "smooth" });
              el?.focus();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#2520B8] bg-purple-50/70 hover:bg-purple-100 border border-[#2520B8]/30 transition-all cursor-pointer shadow-2xs"
          >
            <FiFileText className="w-3.5 h-3.5" />
            <span>Request Changes</span>
          </button>

          {/* Approve Book */}
          <button
            type="button"
            onClick={handleApprove}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#006A61] hover:bg-[#065F46] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>Approve Book</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Document & Manuscript Reader View */}
        <div
          className={`lg:col-span-7 xl:col-span-8 ${isFullscreen
            ? "fixed inset-0 z-50 bg-[#F8F9FA] p-4 sm:p-6 flex flex-col gap-3 h-[100dvh] overflow-hidden"
            : "space-y-4"
            }`}
          ref={readerContainerRef}
        >
          {/* Reader Top Bar Controls */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:px-5 flex items-center justify-between gap-3 shadow-xs shrink-0">
            {/* Table of contents & chapter button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTocOpen(!tocOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${tocOpen
                  ? "bg-[#2520B8] text-white border-[#2520B8]"
                  : "bg-[#FAFAFB] border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                  }`}
                title="Table of Contents"
              >
                <FiList className="w-4 h-4" />
                <span className="hidden sm:inline">Contents</span>
              </button>

              <span className="text-xs font-mono text-[#6B7280]">
                Page{" "}
                <strong className="text-[#111111]">{currentPage}</strong> of{" "}
                {totalPages}
              </span>
            </div>

            {/* Zoom Controls & Fullscreen */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                className="p-1.5 rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] hover:bg-[#F3F4F6] text-[#374151] transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <FiZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-mono font-semibold text-[#111111] px-1.5 min-w-[42px] text-center">
                {zoomLevel}%
              </span>

              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1.5 rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] hover:bg-[#F3F4F6] text-[#374151] transition-colors cursor-pointer"
                title="Zoom In"
              >
                <FiZoomIn className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-[#E5E7EB] mx-1" />

              <button
                type="button"
                onClick={() => handleToggleFullscreen()}
                className="p-1.5 rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] hover:bg-[#F3F4F6] text-[#374151] transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reading"}
              >
                {isFullscreen ? (
                  <FiMinimize className="w-3.5 h-3.5" />
                ) : (
                  <FiMaximize className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Table of Contents Drawer / Popover */}
          {tocOpen && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-lg animate-fade-in space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F2]">
                <span className="text-xs font-bold font-syne text-[#111111]">
                  Manuscript Chapters ({review.chapters.length})
                </span>
                <button
                  type="button"
                  onClick={() => setTocOpen(false)}
                  className="text-[#9CA3AF] hover:text-[#111111]"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 text-xs">
                {review.chapters.map((ch, idx) => (
                  <button
                    key={ch.number}
                    type="button"
                    onClick={() => {
                      setCurrentChapterIdx(idx);
                      setCurrentPage(idx * 28 + 1);
                      setTocOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${currentChapterIdx === idx
                      ? "bg-[#FFF3EE] text-[#E8785A] font-bold"
                      : "hover:bg-[#FAFAFB] text-[#374151]"
                      }`}
                  >
                    <span>
                      {ch.title} — {ch.subtitle || "Chapter Content"}
                    </span>
                    <span className="text-[11px] font-mono text-[#9CA3AF]">
                      p. {idx * 28 + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reading Paper Canvas */}
          <div
            className={`bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-14 shadow-sm relative transition-all ${isFullscreen
              ? "flex-1 min-h-0 overflow-y-auto"
              : "min-h-[750px]"
              }`}
          >
            {/* Inline Comment Marker Flag (Left margin) */}
            <div className="absolute left-3 sm:left-4 top-40 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setInlineCommentOpen(!inlineCommentOpen)}
                className="w-7 h-7 rounded-lg bg-[#006A61]/10 text-[#006A61] border border-[#006A61]/30 hover:bg-[#006A61]/20 flex items-center justify-center shadow-2xs transition-transform hover:scale-105 cursor-pointer"
                title="Add inline review note"
              >
                <FiMessageSquare className="w-3.5 h-3.5" />
              </button>

              {savedInlineComments.length > 0 && (
                <span className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#006A61] text-white leading-none">
                  {savedInlineComments.length}
                </span>
              )}
            </div>

            {/* Inline Comment Popover */}
            {inlineCommentOpen && (
              <div className="absolute left-12 top-40 z-30 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3.5 space-y-2.5 text-xs animate-fade-in">
                <div className="flex items-center justify-between font-bold text-[#111111]">
                  <span>Inline Annotation (Para 1)</span>
                  <button
                    type="button"
                    onClick={() => setInlineCommentOpen(false)}
                    className="text-[#9CA3AF] hover:text-[#111111]"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {savedInlineComments.map((c) => (
                    <div
                      key={c.id}
                      className="p-2 rounded-xl bg-[#FAFAFB] border border-[#F0F0F2] text-[11px] text-[#374151]"
                    >
                      <p>{c.text}</p>
                      <span className="text-[10px] text-[#9CA3AF] font-mono mt-0.5 block">
                        {c.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex gap-1.5">
                  <input
                    type="text"
                    value={inlineCommentText}
                    onChange={(e) => setInlineCommentText(e.target.value)}
                    placeholder="Leave comment on paragraph..."
                    className="flex-1 px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D1D5DB] rounded-lg text-xs outline-none focus:border-[#006A61]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddInlineComment();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddInlineComment}
                    className="p-1.5 rounded-lg bg-[#006A61] text-white hover:bg-[#065F46] cursor-pointer"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Document Content with scaling zoom */}
            <div
              className="max-w-[620px] mx-auto text-[#1F2937] transition-all"
              style={{
                fontSize: `${(15 * zoomLevel) / 100}px`,
                lineHeight: 1.85,
              }}
            >
              {/* Chapter Header */}
              <div className="text-center space-y-3 mb-10 pt-4">
                <h2 className="text-lg sm:text-2xl font-bold font-serif tracking-[0.2em] text-[#111111] uppercase">
                  {activeChapter.title}
                </h2>
                <div className="w-16 h-0.5 bg-[#111111]/30 mx-auto" />
                {activeChapter.subtitle && (
                  <p className="text-xs text-[#6B7280] italic font-serif">
                    {activeChapter.subtitle}
                  </p>
                )}
              </div>

              {/* Prose Paragraphs matching exact text from screenshot */}
              <div className="space-y-6 font-serif text-justify font-normal selection:bg-cyan-100">
                {activeChapter.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className={
                      pIdx === 0
                        ? "first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#111111] first-letter:leading-none"
                        : ""
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Pagination Controls */}
          {/* Bottom Pagination Controls */}
          <div
            className={`flex items-center justify-between gap-3 pt-3 shrink-0 ${isFullscreen
              ? "bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 shadow-lg"
              : ""
              }`}
          >
            <button
              type="button"
              onClick={() => {
                if (currentChapterIdx > 0) {
                  setCurrentChapterIdx((c) => c - 1);
                  setCurrentPage((p) => Math.max(1, p - 28));
                }
              }}
              disabled={currentChapterIdx === 0}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FAFAFB] text-[#374151] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              &lt; Previous
            </button>

            <span className="text-xs text-[#6B7280] font-semibold text-center whitespace-nowrap">
              Chapter {currentChapterIdx + 1} of {review.chapters.length}
            </span>

            <button
              type="button"
              onClick={() => {
                if (currentChapterIdx < review.chapters.length - 1) {
                  setCurrentChapterIdx((c) => c + 1);
                  setCurrentPage((p) => Math.min(totalPages, p + 28));
                }
              }}
              disabled={currentChapterIdx === review.chapters.length - 1}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FAFAFB] text-[#374151] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next &gt;
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Book Specs, Author Dossier, Editorial Feedback */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Card 1: Book Specs & Metrics */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              {/* Cover Thumbnail with 2nd Ed tag */}
              <div className="relative shrink-0">
                <div className="w-[84px] h-[116px] rounded-xl bg-gradient-to-b from-[#0A1128] via-[#101F42] to-[#050814] border border-slate-700 p-2 flex flex-col justify-between text-white shadow-md overflow-hidden">
                  <div className="text-[8px] font-extrabold tracking-wider text-amber-300 uppercase leading-tight">
                    {review.bookTitle}
                  </div>
                  <div className="w-7 h-7 mx-auto rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rotate-45 border border-cyan-300/60 bg-cyan-400/20" />
                  </div>
                  <div className="text-[6px] text-slate-300 font-mono text-center truncate">
                    AT SCALE
                  </div>
                </div>

                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-[#111111] text-white text-[9px] font-bold font-mono shadow-xs border border-white/20">
                  {review.edition}
                </span>
              </div>

              {/* Title & Category Details */}
              <div className="min-w-0 space-y-1">
                <span className="text-[11px] font-semibold text-[#6B7280] block">
                  {review.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-syne text-[#111111] leading-snug">
                  {review.bookTitle}
                </h3>
                <p className="text-xs text-[#6B7280] leading-tight">
                  {review.bookSubtitle}
                </p>
                <p className="text-[11px] font-mono text-[#9CA3AF] pt-1">
                  ISBN: {review.isbn}
                </p>
              </div>
            </div>

            {/* 2x2 Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F0F0F2]">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#6B7280] block">Page Count</span>
                <span className="text-base font-bold font-syne text-[#111111]">
                  {review.pageCount}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-[#6B7280] block">Word Count</span>
                <span className="text-base font-bold font-syne text-[#111111]">
                  {review.wordCount}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-[#6B7280] block">Chapter Count</span>
                <span className="text-base font-bold font-syne text-[#111111]">
                  {review.chapterCount}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-[#6B7280] block">Asset Archive</span>
                <span className="text-base font-bold font-syne text-[#111111]">
                  {review.assetArchiveSize}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: AUTHOR DOSSIER */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                AUTHOR DOSSIER
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAFBF1] text-[#065F46] border border-[#A7F3D0]">
                <FiCheck className="w-3 h-3 text-[#0ea472]" />
                <span>Verified</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${review.author.avatarBg || "bg-slate-200 text-slate-800"
                  }`}
              >
                {review.author.avatarInitials}
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="font-bold text-sm text-[#111111]">
                  {review.author.name}
                </div>
                <div className="text-xs text-[#6B7280]">
                  {review.author.degree}
                </div>
                <div className="text-[11px] font-mono text-[#9CA3AF] truncate">
                  {review.author.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6B7280] bg-[#FAFAFB] p-2.5 rounded-xl border border-[#F0F0F2]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#111111]">
                <FiBookOpen className="w-3.5 h-3.5 text-[#006A61]" />
                {review.author.booksCount} Books
              </span>
              <span>•</span>
              <span className="font-semibold text-[#111111]">
                ⭐ {review.author.avgRating} Avg
              </span>
              <span>•</span>
              <span className="font-medium text-[#6B7280]">
                {review.author.tier}
              </span>
            </div>

            <Link
              href="/dashboard/library/users"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FAFAFB] text-xs font-semibold text-[#374151] transition-colors"
            >
              <FiUser className="w-3.5 h-3.5" />
              <span>View Profile</span>
            </Link>
          </div>

          {/* Card 3: EDITORIAL FEEDBACK */}
          <form
            onSubmit={handleSubmitChangeRequest}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold font-syne text-[#111111] text-sm">
                <FiFileText className="w-4 h-4 text-[#2520B8]" />
                <span>Editorial Feedback</span>
              </div>
              <span className="text-[11px] font-mono text-[#9CA3AF]">
                Step 2 of 2
              </span>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Tag issues and specify required manuscript corrections before
              re-submitting to technical layout.
            </p>

            {/* Flagged Issue Categories Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#374151] block">
                Flagged Issue Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = flaggedIssues.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleIssue(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected
                        ? "bg-[#2520B8] text-white shadow-2xs"
                        : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Revision Directives Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <label
                  htmlFor="editorial-directives"
                  className="font-semibold text-[#374151]"
                >
                  Detailed Revision Directives
                </label>
                <span className="text-[#9CA3AF] font-mono">
                  {revisionDirectives.length} chars
                </span>
              </div>

              <textarea
                id="editorial-directives"
                rows={5}
                value={revisionDirectives}
                onChange={(e) => setRevisionDirectives(e.target.value)}
                placeholder="Enter specific chapter revision instructions..."
                className="w-full p-3 rounded-xl border border-[#D1D5DB] focus:border-[#2520B8] focus:ring-2 focus:ring-[#2520B8]/10 text-xs text-[#111111] placeholder:text-[#9CA3AF] outline-none font-mono leading-relaxed resize-none"
              />
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-start gap-2 text-[#374151] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyAuthor}
                  onChange={(e) => setNotifyAuthor(e.target.checked)}
                  className="mt-0.5 rounded text-[#2520B8]"
                />
                <span className="text-[11px]">
                  <strong>Notify author</strong> via email &amp; direct message
                </span>
              </label>

              <label className="flex items-start gap-2 text-[#374151] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="mt-0.5 rounded text-[#2520B8]"
                />
                <span className="text-[11px] text-[#6B7280]">
                  Automated dispatch upon ticket status change
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2520B8] hover:bg-[#1E1996] active:scale-[0.99] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <FiSend className="w-3.5 h-3.5" />
                <span>Submit Change Request</span>
              </button>

              <button
                type="button"
                onClick={() => setRevisionDirectives("")}
                className="w-full text-center py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer"
              >
                Cancel / Clear Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EditorialReviewView;

