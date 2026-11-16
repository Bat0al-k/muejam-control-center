"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLibrary } from "@/features/library/context";
import {
  FiSearch,
  FiArrowRight,
  FiUser,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";

export default function BooksPage() {
  const router = useRouter();
  const { submissions, openModal } = useLibrary();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Systems Engineering",
    "Technical / AI",
    "Fintech",
    "Design Systems",
    "Data Science",
  ];

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((b) => {
      const matchCat =
        selectedCategory === "All" ||
        (b.category &&
          b.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.authorName.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [submissions, search, selectedCategory]);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Link
              href="/dashboard/library"
              className="hover:text-[#111111] transition-colors"
            >
              Library
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-[#111111]">Books Catalog</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-syne tracking-tight">
              Published &amp; Archival Books Catalog
            </h1>
          </div>
          <p className="text-xs text-[#6B7280]">
            Browse all books in the catalog. Click any book to inspect its
            manuscript, author dossier, and editorial directives.
          </p>
        </div>

        <div className="flex flex-row flex-nowrap justify-end items-center gap-2.5">
          <span className="flex shrink-0 items-center px-5 py-2 bg-[#EAFBF1] text-[#065F46] rounded-md text-xs font-bold border border-[#A7F3D0]">
            {filteredBooks.length} Books
          </span>
          <Link
            href="/dashboard/library"
            className="flex shrink-0 items-center px-5 py-2 rounded-lg bg-white/80 border border-[#E5E7EB] hover:bg-[#FAFAFB] text-xs font-semibold text-[#374151] transition-colors gap-1.5"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Library Overview</span>
          </Link>

          <button
            type="button"
            onClick={() => openModal({ type: "submitBook" })}
            className="flex shrink-0 items-center gap-2 px-4 py-2.5 border border-[#ff6131] bg-[#E8785A] hover:bg-[#D96948] active:scale-[0.99] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Upload New Book</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-[#111111] text-white shadow-2xs"
                : "bg-[#F8FAFC] text-[#6B7280] hover:text-[#111111] border border-[#E5E7EB]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#E8785A] focus:bg-white rounded-xl text-xs text-[#111111] outline-none transition-all"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => router.push(`/dashboard/library/books/${book.id}`)}
            className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              {/* Cover Mini Badge */}
              <div className="w-[82px] h-[112px] rounded-xl bg-gradient-to-br from-[#063940] via-[#0B5560] to-[#041F24] border border-[#006A61]/40 p-2 flex flex-col justify-between text-white shrink-0 shadow-sm relative overflow-hidden group-hover:scale-102 transition-transform">
                <div className="bg-white/95 text-[#063940] rounded px-1.5 py-1 text-[7px] font-extrabold leading-tight uppercase truncate">
                  {book.title}
                </div>
                <div className="space-y-1">
                  <div className="w-full h-5 rounded bg-[#0ea472]/20 border border-[#0ea472]/40 flex items-center justify-center">
                    <span className="text-[6px] font-mono text-[#A7F3D0] tracking-widest">
                      MANUSCRIPT
                    </span>
                  </div>
                  <p className="text-[6px] text-white/70 font-mono truncate">
                    {book.isbn}
                  </p>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#374151]">
                    {book.category || "General"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${book.status === "Approved"
                      ? "bg-[#EAFBF1] text-[#065F46] border-[#A7F3D0]"
                      : "bg-slate-100 text-[#374151] border-[#E5E7EB]"
                      }`}
                  >
                    {book.status}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold font-syne text-[#111111] leading-snug group-hover:text-[#E8785A] transition-colors truncate">
                  {book.title}
                </h3>

                <p className="text-xs text-[#6B7280] flex items-center gap-1">
                  <FiUser className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>{book.authorName}</span>
                </p>

                <p className="text-[11px] font-mono text-[#9CA3AF]">
                  {book.isbn} • {book.pages}
                </p>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6B7280]">
                Submitted {book.submittedDate}
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#006A61] group-hover:text-[#E8785A] transition-colors">
                <span>Open Reader &amp; Review</span>
                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// _______________________________________________________________
// "use client";

// import React, { useState, useMemo } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   INITIAL_EDITORIAL_REVIEWS,
//   INITIAL_SUBMISSIONS,
// } from "@/features/library/mock-data";
// import {
//   FiBookOpen,
//   FiSearch,
//   FiArrowRight,
//   FiEye,
//   FiCheckCircle,
//   FiFilter,
//   FiPlus,
// } from "react-icons/fi";

// export default function BooksCatalogPage() {
//   const router = useRouter();
//   const [query, setQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");

//   const catalogBooks = useMemo(() => {
//     return [
//       ...INITIAL_EDITORIAL_REVIEWS,
//       ...INITIAL_SUBMISSIONS.filter(
//         (s) => !INITIAL_EDITORIAL_REVIEWS.some((r) => r.id === s.id)
//       ).map((s) => ({
//         id: s.id,
//         bookTitle: s.title,
//         bookSubtitle: "Archival Digital Edition",
//         edition: "1st Ed",
//         category: s.category || "General Library",
//         version: "v1.0",
//         status: s.status,
//         submittedBy: s.authorName,
//         submittedDate: s.submittedDate,
//         editorialQueue: "Catalog Archival Tier 1",
//         isbn: s.isbn,
//         pageCount: parseInt(s.pages, 10) || 320,
//         wordCount: "94k",
//         chapterCount: 30,
//         assetArchiveSize: s.fileSize || "14 MB",
//         author: {
//           name: s.authorName,
//           degree: "Author & Researcher",
//           email: s.authorEmail,
//           avatarInitials: s.authorInitials,
//           avatarBg: s.authorAvatarBg,
//           verified: true,
//           booksCount: 3,
//           avgRating: 4.8,
//           tier: "Tier 1 Author",
//         },
//         chapters: [],
//         flaggedIssues: [],
//         revisionDirectives: "",
//         coverTheme: s.coverTheme === "draft" ? "light" : s.coverTheme,
//       })),
//     ];
//   }, []);

//   const categories = useMemo(() => {
//     const set = new Set<string>();
//     catalogBooks.forEach((b) => set.add(b.category));
//     return ["all", ...Array.from(set)];
//   }, [catalogBooks]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return catalogBooks.filter((book) => {
//       if (categoryFilter !== "all" && book.category !== categoryFilter) {
//         return false;
//       }
//       if (!q) return true;
//       return (
//         book.bookTitle.toLowerCase().includes(q) ||
//         book.submittedBy.toLowerCase().includes(q) ||
//         book.isbn.toLowerCase().includes(q)
//       );
//     });
//   }, [catalogBooks, query, categoryFilter]);

//   return (
//     <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
//       {/* Top Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-1">
//             <Link href="/dashboard/library" className="hover:text-[#111111]">
//               Library
//             </Link>
//             <span>&gt;</span>
//             <span className="font-semibold text-[#111111]">Books Catalog</span>
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
//             Digital Publications Catalog
//           </h1>
//           <p className="text-xs text-[#6B7280] mt-1">
//             Browse and inspect indexed library books, digital twins, and technical manuscripts.
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Link
//             href="/dashboard/library"
//             className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FAFAFB] text-xs font-semibold text-[#374151] transition-colors"
//           >
//             ← Library Overview
//           </Link>
//         </div>
//       </div>

//       {/* Search & Filter Bar */}
//       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
//         {/* Category Pills */}
//         <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold overflow-x-auto max-w-full">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               type="button"
//               onClick={() => setCategoryFilter(cat)}
//               className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
//                 categoryFilter === cat
//                   ? "bg-[#111111] text-white shadow-2xs"
//                   : "text-[#6B7280] hover:text-[#111111]"
//               }`}
//             >
//               {cat === "all" ? "All Categories" : cat}
//             </button>
//           ))}
//         </div>

//         {/* Search Input */}
//         <div className="relative w-full sm:w-72">
//           <FiSearch className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search catalog books, ISBN..."
//             className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:bg-white focus:border-[#2520B8] outline-none transition-colors"
//           />
//         </div>
//       </div>

//       {/* Catalog Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//         {filtered.map((book) => (
//           <div
//             key={book.id}
//             onClick={() => router.push(`/dashboard/library/books/${book.id}`)}
//             className="bg-white border border-[#E5E7EB] hover:border-[#2520B8]/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
//           >
//             <div className="space-y-3">
//               {/* Category & Badge */}
//               <div className="flex items-center justify-between gap-2">
//                 <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#374151]">
//                   {book.category}
//                 </span>

//                 <span className="text-[10px] font-mono text-[#9CA3AF]">
//                   {book.edition}
//                 </span>
//               </div>

//               {/* Title & Subtitle */}
//               <div>
//                 <h3 className="text-base font-bold font-syne text-[#111111] group-hover:text-[#2520B8] transition-colors leading-snug">
//                   {book.bookTitle}
//                 </h3>
//                 <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">
//                   {book.bookSubtitle}
//                 </p>
//               </div>

//               {/* Author and Specs */}
//               <div className="pt-2 border-t border-[#F0F0F2] flex items-center justify-between text-xs text-[#6B7280]">
//                 <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
//                   <FiBookOpen className="w-3.5 h-3.5 text-[#006A61]" />
//                   <span>{book.submittedBy}</span>
//                 </div>
//                 <div className="font-mono text-[11px] text-[#9CA3AF]">
//                   {book.pageCount} pp • {book.wordCount}
//                 </div>
//               </div>
//             </div>

//             {/* Inspect / Read CTA */}
//             <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-between text-xs font-bold text-[#2520B8]">
//               <span className="inline-flex items-center gap-1.5">
//                 <FiEye className="w-3.5 h-3.5" />
//                 <span>Open Manuscript Reader &amp; Review</span>
//               </span>
//               <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
