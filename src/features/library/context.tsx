"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  LibraryActiveDrawerType,
  LibraryActiveModalType,
  LibraryAlert,
  LibraryDateRangeOption,
  LibraryKpiStats,
  LibraryToastMessage,
  PendingBookItem,
  SubmissionFilter,
  SubmissionRecord,
} from "./library.types";
import {
  INITIAL_LIBRARY_ALERTS,
  INITIAL_LIBRARY_KPI_STATS,
  INITIAL_PENDING_BOOKS,
  INITIAL_SUBMISSIONS,
} from "./mock-data";

export interface CreateSubmissionPayload {
  title: string;
  authorName: string;
  authorEmail?: string;
  isbn?: string;
  pages?: string;
  category?: string;
  description?: string;
  tags?: string[];
  coverImage?: string;
  manuscriptFile?: string;
}

interface LibraryContextType {
  dateRange: LibraryDateRangeOption;
  setDateRange: (range: LibraryDateRangeOption) => void;
  isRefreshing: boolean;
  syncLatency: number;
  refreshLibrary: () => Promise<void>;

  kpiStats: LibraryKpiStats;
  alerts: LibraryAlert[];
  pendingBooks: PendingBookItem[];
  submissions: SubmissionRecord[];
  filteredSubmissions: SubmissionRecord[];

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: SubmissionFilter;
  setActiveTab: (tab: SubmissionFilter) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  approveBook: (book: PendingBookItem) => void;
  rejectBook: (book: PendingBookItem) => void;
  requestChangesForBook: (book: PendingBookItem, note?: string) => void;
  createSubmission: (payload: CreateSubmissionPayload) => void;
  exportLibraryReport: (format: "csv" | "json", scope: string) => void;

  activeModal: LibraryActiveModalType;
  openModal: (modal: LibraryActiveModalType) => void;
  closeModal: () => void;

  activeDrawer: LibraryActiveDrawerType;
  openDrawer: (drawer: LibraryActiveDrawerType) => void;
  closeDrawer: () => void;

  toasts: LibraryToastMessage[];
  showToast: (
    type: "success" | "error" | "info",
    message: string,
    title?: string
  ) => void;
  dismissToast: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<LibraryDateRangeOption>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncLatency, setSyncLatency] = useState(28);

  const [kpiStats, setKpiStats] = useState<LibraryKpiStats>(
    INITIAL_LIBRARY_KPI_STATS
  );
  const [alerts] = useState<LibraryAlert[]>(INITIAL_LIBRARY_ALERTS);
  const [pendingBooks, setPendingBooks] = useState<PendingBookItem[]>(
    INITIAL_PENDING_BOOKS
  );
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(
    INITIAL_SUBMISSIONS
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SubmissionFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [activeModal, setActiveModal] =
    useState<LibraryActiveModalType>(null);
  const [activeDrawer, setActiveDrawer] =
    useState<LibraryActiveDrawerType>(null);
  const [toasts, setToasts] = useState<LibraryToastMessage[]>([]);

  const showToast = (
    type: "success" | "error" | "info",
    message: string,
    title?: string
  ) => {
    const id = `lib-toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshLibrary = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setSyncLatency(Math.floor(20 + Math.random() * 18));
    setIsRefreshing(false);
    showToast("success", "Library catalog & editorial queue synchronized.");
  };

  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((item) => {
      if (
        activeTab === "pending" &&
        item.status !== "Pending Review" &&
        item.status !== "Draft"
      ) {
        return false;
      }
      if (activeTab === "approved" && item.status !== "Approved") {
        return false;
      }
      if (
        activeTab === "issues" &&
        item.status !== "Rejected" &&
        item.status !== "Changes Requested"
      ) {
        return false;
      }

      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q) ||
        item.authorEmail.toLowerCase().includes(q) ||
        item.isbn.toLowerCase().includes(q)
      );
    });
  }, [submissions, searchQuery, activeTab]);

  const approveBook = (book: PendingBookItem) => {
    setPendingBooks((prev) => prev.filter((b) => b.id !== book.id));
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.title === book.title ? { ...sub, status: "Approved" } : sub
      )
    );
    setKpiStats((prev) => ({
      ...prev,
      approvedBooks: prev.approvedBooks + 1,
    }));
    setActiveModal(null);
    showToast(
      "success",
      `"${book.title}" has been approved and indexed in the catalog.`
    );
  };

  const rejectBook = (book: PendingBookItem) => {
    setPendingBooks((prev) => prev.filter((b) => b.id !== book.id));
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.title === book.title ? { ...sub, status: "Rejected" } : sub
      )
    );
    setKpiStats((prev) => ({
      ...prev,
      rejectedBooks: prev.rejectedBooks + 1,
    }));
    setActiveModal(null);
    showToast("info", `"${book.title}" was marked as policy non-compliant.`);
  };

  const requestChangesForBook = (book: PendingBookItem, note?: string) => {
    setPendingBooks((prev) => prev.filter((b) => b.id !== book.id));
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.title === book.title
          ? { ...sub, status: "Changes Requested" }
          : sub
      )
    );
    setActiveModal(null);
    showToast(
      "info",
      note
        ? `Changes requested for "${book.title}": ${note}`
        : `Requested editorial revisions for "${book.title}".`
    );
  };

  const createSubmission = (payload: CreateSubmissionPayload) => {
    const initials = payload.authorName
      .trim()
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const created: SubmissionRecord = {
      id: `sub-${Date.now()}`,
      title: payload.title.trim(),
      isbn: payload.isbn?.trim()
        ? `ISBN ${payload.isbn.trim()}`
        : "Pending ISBN",
      pages: payload.pages?.trim() ? `${payload.pages.trim()} pp` : "320 pp est.",
      authorName: payload.authorName.trim(),
      authorEmail: payload.authorEmail?.trim() || "author@publisher.io",
      authorInitials: initials || "AU",
      authorAvatarBg: "bg-[#FFF3EE] text-[#E8785A]",
      submittedDate: "Just now",
      submittedTime: "Live EST",
      isToday: true,
      status: "Pending Review",
      coverTheme: "teal",
      category: payload.category?.trim() || "EDITORIAL QUEUE",
      fileSize: payload.manuscriptFile ? `${payload.manuscriptFile} (Attached)` : "14.2 MB PDF",
      description: payload.description,
      tags: payload.tags,
      coverImageUrl: payload.coverImage,
    };

    const pendingCard: PendingBookItem = {
      id: `rev-${Date.now()}`,
      category: created.category || "EDITORIAL QUEUE",
      timeAgo: "Just now",
      title: created.title,
      author: created.authorName,
      pages: parseInt(payload.pages || "320", 10) || 320,
      fileSize: "14.2 MB PDF",
      secondaryAction: "Inspect",
      coverTheme: "teal",
      coverTitle: created.title.toUpperCase(),
      coverSubtitle: created.isbn,
      isbn: created.isbn,
    };

    setSubmissions((prev) => [created, ...prev]);
    setPendingBooks((prev) => [pendingCard, ...prev]);
    setKpiStats((prev) => ({
      ...prev,
      totalBooks: prev.totalBooks + 1,
    }));
    setActiveModal(null);
    showToast(
      "success",
      `"${created.title}" submitted to the editorial review queue.`
    );
  };

  const exportLibraryReport = (format: "csv" | "json", scope: string) => {
    setActiveModal(null);
    showToast(
      "success",
      `Exported ${scope} report in ${format.toUpperCase()} format.`
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        dateRange,
        setDateRange,
        isRefreshing,
        syncLatency,
        refreshLibrary,
        kpiStats,
        alerts,
        pendingBooks,
        submissions,
        filteredSubmissions,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        currentPage,
        setCurrentPage,
        approveBook,
        rejectBook,
        requestChangesForBook,
        createSubmission,
        exportLibraryReport,
        activeModal,
        openModal: setActiveModal,
        closeModal: () => setActiveModal(null),
        activeDrawer,
        openDrawer: setActiveDrawer,
        closeDrawer: () => setActiveDrawer(null),
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}

export function useLibraryOptional() {
  return useContext(LibraryContext);
}

