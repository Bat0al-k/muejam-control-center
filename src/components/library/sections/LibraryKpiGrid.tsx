"use client";

import React from "react";
import Link from "next/link";
import { useLibrary } from "@/features/library/context";
import {
  FiUsers,
  FiEdit3,
  FiBookOpen,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
} from "react-icons/fi";

export function LibraryKpiGrid() {
  const { kpiStats, pendingBooks, setActiveTab, setCurrentPage } = useLibrary();

  const handleFilterShortcut = (tab: "pending" | "approved" | "issues") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* 1. Total Users */}
      <Link
        href="/dashboard/library/users"
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111111] transition-colors">
            Total Users
          </span>
          <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FiUsers className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] mt-2">
            <span className="font-bold text-[#059669]">↑ {kpiStats.usersTrend}</span>
            <span className="text-[#6B7280]">this month</span>
          </div>
        </div>
      </Link>

      {/* 2. Total Authors */}
      <Link
        href="/dashboard/library/authors"
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111111] transition-colors">
            Total Authors
          </span>
          <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FiEdit3 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.totalAuthors.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] mt-2">
            <FiTrendingUp className="w-3 h-3 text-[#059669] shrink-0" />
            <span className="font-bold text-[#059669]">{kpiStats.authorsTrend}</span>
            <span className="text-[#6B7280] truncate">contributors</span>
          </div>
        </div>
      </Link>

      {/* 3. Total Books */}
      <Link
        href="/dashboard/library/books"
        className="group bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111111] transition-colors">
            Total Books
          </span>
          <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FiBookOpen className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.totalBooks.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-2">
            <span className="font-semibold text-[#374151]">{kpiStats.indexedPercent}</span>{" "}
            indexed
          </div>
        </div>
      </Link>

      {/* 4. Pending Books (Highlighted) */}
      <button
        type="button"
        onClick={() => handleFilterShortcut("pending")}
        className="bg-white border border-[#FCD9CE] hover:border-[#E8785A] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
      >
        <div className="flex items-center justify-between gap-1.5 mb-3">
          <span className="text-xs font-bold text-[#111111]">
            Pending Books
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold leading-tight bg-[#FFF3EE] text-[#E8785A] border border-[#FCD9CE] text-center">
            Action Req.
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-syne text-[#E8785A] tracking-tight">
            {(kpiStats.pendingBooksBase + pendingBooks.length).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E8785A] mt-2">
            <span className="w-2 h-2 rounded-full bg-[#E8785A]" />
            <span>Awaiting Editorial</span>
          </div>
        </div>
      </button>

      {/* 5. Approved Books */}
      <button
        type="button"
        onClick={() => handleFilterShortcut("approved")}
        className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#6B7280]">
            Approved Books
          </span>
          <span className="w-7 h-7 rounded-lg bg-[#EAFBF1] text-[#059669] flex items-center justify-center shrink-0">
            <FiCheckCircle className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.approvedBooks.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-2">
            <span className="font-bold text-[#059669]">
              {kpiStats.activeCatalogPercent}
            </span>{" "}
            active catalog
          </div>
        </div>
      </button>

      {/* 6. Rejected Books */}
      <button
        type="button"
        onClick={() => handleFilterShortcut("issues")}
        className="bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl p-4 text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#6B7280]">
            Rejected Books
          </span>
          <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#6B7280] flex items-center justify-center shrink-0">
            <FiXCircle className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            {kpiStats.rejectedBooks.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-2 truncate">
            Policy non-compliant
          </div>
        </div>
      </button>
    </div>
  );
}

