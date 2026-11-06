"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiBookOpen,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiCheck,
  FiUserCheck,
  FiWifi,
  FiWifiOff,
  FiLayers,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EditUserModal } from "@/components/studio/modals/EditUserModal";
import { DeleteUserModal } from "@/components/studio/modals/DeleteUserModal";
import type { LibraryUser } from "@/features/library/library.service";

export type { LibraryUser };

interface CurrentUserAuth {
  id: string;
  role: string;
  isDeveloper: boolean;
}

interface LibraryUsersResponse {
  users: LibraryUser[];
  totalAccounts: number;
  activeUsers: number;
  suspendedUsers: number;
  onlineUsers: number;
  offlineUsers: number;
  verifiedEmails: number;
  authorAccounts: number;
  readerAccounts: number;
  isolatedStudioAccounts: number;
  currentUser?: CurrentUserAuth;
}

type StatusFilter = "all" | "active" | "online" | "offline" | "authors" | "readers" | "suspended";

function formatTimestamp(value: string | null): string {
  if (!value) return "No session recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "Just now";
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

function getRoleBadge(role: string, isLibraryAuthor: boolean) {
  const norm = (role || "").toLowerCase();
  if (norm === "admin") {
    return { label: "Developer", classes: "bg-purple-50 text-purple-700 border-purple-200" };
  }
  if (norm === "sub_admin") {
    return { label: "Admin", classes: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (norm === "author" || isLibraryAuthor) {
    return { label: "Author", classes: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  return { label: "Reader", classes: "bg-slate-100 text-slate-700 border-slate-200" };
}

export default function LibraryUsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [data, setData] = useState<LibraryUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Authentication & Developer permission state
  const [currentUser, setCurrentUser] = useState<CurrentUserAuth | null>(null);

  // Modals state for Developer actions
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<LibraryUser | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<LibraryUser | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const isDeveloper = Boolean(currentUser?.isDeveloper || currentUser?.role === "admin");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/library/users", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load Library users.");
        }

        const result: LibraryUsersResponse = await response.json();
        setData(result);

        if (result.currentUser) {
          setCurrentUser(result.currentUser);
        } else {
          try {
            const meRes = await fetch("/api/auth/me", { signal: controller.signal });
            if (meRes.ok) {
              const meData = await meRes.json();
              if (meData.authenticated && meData.user) {
                setCurrentUser(meData.user);
              }
            }
          } catch {
            // Ignore background session check errors
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading Library users."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!data) return [];

    return data.users.filter((user) => {
      if (statusFilter === "active" && (user.disabled || user.accountStatus === "suspended")) {
        return false;
      }
      if (statusFilter === "online" && !user.online) {
        return false;
      }
      if (statusFilter === "offline" && (user.online || user.disabled)) {
        return false;
      }
      if (statusFilter === "authors" && !user.isAuthorProfile && user.role !== "author") {
        return false;
      }
      if (statusFilter === "readers" && (user.isAuthorProfile || user.role === "author")) {
        return false;
      }
      if (statusFilter === "suspended" && !user.disabled && user.accountStatus !== "suspended") {
        return false;
      }

      if (!normalizedQuery) return true;

      return (
        user.displayName.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        (user.phoneNumber ?? "").toLowerCase().includes(normalizedQuery) ||
        (user.role ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [data, query, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle successful update from Edit modal
  const handleUserUpdated = (updatedUser: LibraryUser) => {
    setData((prev) => {
      if (!prev) return prev;
      // If product was switched to studio, remove from Library list and increment isolatedStudioAccounts
      const nextUsers =
        updatedUser.product === "studio"
          ? prev.users.filter((u) => u.id !== updatedUser.id)
          : prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));

      const activeCount = nextUsers.filter((u) => !u.disabled && u.accountStatus === "active").length;
      const onlineCount = nextUsers.filter((u) => u.online).length;
      const authorCount = nextUsers.filter((u) => u.isAuthorProfile || u.role === "author").length;

      return {
        ...prev,
        users: nextUsers,
        totalAccounts: nextUsers.length,
        activeUsers: activeCount,
        suspendedUsers: nextUsers.length - activeCount,
        onlineUsers: onlineCount,
        offlineUsers: nextUsers.length - onlineCount,
        verifiedEmails: nextUsers.filter((u) => u.emailVerified).length,
        authorAccounts: authorCount,
        readerAccounts: nextUsers.length - authorCount,
        isolatedStudioAccounts:
          updatedUser.product === "studio"
            ? prev.isolatedStudioAccounts + 1
            : prev.isolatedStudioAccounts,
      };
    });

    setSuccessMessage(`Changes for "${updatedUser.displayName}" were successfully saved to the database.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle successful deletion from Delete modal
  const handleUserDeleted = (deletedUserId: string) => {
    const deletedUser = data?.users.find((u) => u.id === deletedUserId);
    setData((prev) => {
      if (!prev) return prev;
      const remainingUsers = prev.users.filter((u) => u.id !== deletedUserId);
      const activeCount = remainingUsers.filter((u) => !u.disabled && u.accountStatus === "active").length;
      const onlineCount = remainingUsers.filter((u) => u.online).length;
      const authorCount = remainingUsers.filter((u) => u.isAuthorProfile || u.role === "author").length;

      return {
        ...prev,
        users: remainingUsers,
        totalAccounts: remainingUsers.length,
        activeUsers: activeCount,
        suspendedUsers: remainingUsers.length - activeCount,
        onlineUsers: onlineCount,
        offlineUsers: remainingUsers.length - onlineCount,
        verifiedEmails: remainingUsers.filter((u) => u.emailVerified).length,
        authorAccounts: authorCount,
        readerAccounts: remainingUsers.length - authorCount,
      };
    });

    setSuccessMessage(`User "${deletedUser?.displayName || deletedUserId}" was permanently removed from the database.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFF3EE] border border-[#FCD9CE] text-[#E8785A] text-[11px] font-bold mb-2">
            <FiLayers className="w-3.5 h-3.5" />
            <span>libaray Schema • Strict Product Isolation</span>
          </div>
          <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            Library Readers, Authors &amp; Accounts
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Monitor isolated Library accounts, real-time online/offline session timestamps, active user counts, and published books.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/dashboard/studio/users"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#E8785A] text-[#374151] hover:text-[#E8785A] text-xs font-semibold transition-colors shadow-2xs"
          >
            <FiUsers className="w-3.5 h-3.5 text-[#E8785A]" />
            <span>
              Switch to Studio Accounts ({loading ? "—" : data?.isolatedStudioAccounts ?? 0})
            </span>
          </Link>

          {/* Developer Badge status indicator */}
          {isDeveloper && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-purple-600" />
              <span>Developer Mode: Edit &amp; Delete Enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in shadow-2xs"
        >
          <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-emerald-600 hover:text-emerald-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top KPI Cards (5 Cards: Library Accounts, Active Users, Online Users, Offline Users, Verified Emails) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Library Accounts (Separated) */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Library Accounts
            </p>
            <FiUsers className="w-5 h-5 text-[#E8785A]" />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#111111]">
            {loading ? "—" : (data?.totalAccounts ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Isolated from{" "}
            <span className="font-semibold text-[#111111]">
              {loading ? "—" : (data?.isolatedStudioAccounts ?? 0).toLocaleString()}
            </span>{" "}
            Studio accounts
          </p>
        </div>

        {/* 2. Active Users */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Active Users
            </p>
            <FiUserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#111111]">
            {loading ? "—" : (data?.activeUsers ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Enabled accounts •{" "}
            <span className="text-red-600 font-semibold">
              {loading ? "—" : data?.suspendedUsers ?? 0} suspended
            </span>
          </p>
        </div>

        {/* 3. Online Users */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Online Users
            </p>
            <FiWifi className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold text-emerald-700">
              {loading ? "—" : (data?.onlineUsers ?? 0).toLocaleString()}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Active session heartbeat (&lt; 90s)
          </p>
        </div>

        {/* 4. Offline Users */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Offline Users
            </p>
            <FiWifiOff className="w-5 h-5 text-stone-500" />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#111111]">
            {loading ? "—" : (data?.offlineUsers ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Disconnected or ended session
          </p>
        </div>

        {/* 5. Verified Emails */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Verified Emails
            </p>
            <FiCheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#111111]">
            {loading ? "—" : (data?.verifiedEmails ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            {loading
              ? "—"
              : `${data?.authorAccounts ?? 0} authors • ${data?.readerAccounts ?? 0} readers`}
          </p>
        </div>
      </div>

      {/* Accounts Table Container */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#F0F0F2] flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#FAFAFB]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-[#E8785A]" />
              <h3 className="font-bold font-syne text-[#111111] text-sm">
                Provisioned Library Accounts ({filteredUsers.length})
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 text-[11px] font-semibold">
              {(
                [
                  { id: "all", label: `All (${data?.totalAccounts ?? 0})` },
                  { id: "active", label: `Active (${data?.activeUsers ?? 0})` },
                  { id: "online", label: `Online (${data?.onlineUsers ?? 0})` },
                  { id: "offline", label: `Offline (${data?.offlineUsers ?? 0})` },
                  { id: "authors", label: `Authors (${data?.authorAccounts ?? 0})` },
                  { id: "readers", label: `Readers (${data?.readerAccounts ?? 0})` },
                  { id: "suspended", label: `Suspended (${data?.suspendedUsers ?? 0})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === tab.id
                      ? "bg-[#E8785A] text-white"
                      : "text-[#6B7280] hover:text-[#111111] hover:bg-[#FAFAFB]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, role..."
              aria-label="Search Library users"
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0F0F2] bg-[#FAFAFB] text-[#5f6572] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Came Online (Online At)</th>
                <th className="py-3 px-4">Went Offline (Offline At)</th>
                <th className="py-3 px-4">Books</th>
                <th className="py-3 px-4">Email Verification</th>
                <th className="py-3 px-4">Presence &amp; Status</th>
                {isDeveloper && (
                  <th className="py-3 px-4 text-center">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
              {loading ? (
                <tr>
                  <td
                    colSpan={isDeveloper ? 9 : 8}
                    className="py-10 px-4 text-center text-[#6B7280]"
                  >
                    Loading Library accounts...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={isDeveloper ? 9 : 8}
                    className="py-10 px-4 text-center text-[#6B7280]"
                  >
                    Unable to load accounts. Please try again.
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={isDeveloper ? 9 : 8}
                    className="py-10 px-4 text-center text-[#6B7280]"
                  >
                    No Library accounts match your current filter.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const roleBadge = getRoleBadge(
                    user.role || user.defaultRole,
                    user.isAuthorProfile
                  );
                  const onlineRelative = formatRelativeTime(user.onlineAt);
                  const offlineRelative = formatRelativeTime(user.offlineAt);

                  return (
                    <tr
                      key={user.id}
                      onClick={() => router.push(`/dashboard/library/users/${user.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          router.push(`/dashboard/library/users/${user.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`View details for ${user.displayName}`}
                      className="cursor-pointer hover:bg-[#FAFAFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8785A] transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#111111]">{user.displayName}</div>
                        {user.phoneNumber && (
                          <div className="text-[10px] text-[#9CA3AF] mt-0.5">
                            {user.phoneNumber}
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-[#6B7280]">
                        <span className="inline-flex items-center gap-1.5">
                          <FiMail className="shrink-0" />
                          {user.email || "—"}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadge.classes}`}
                        >
                          {roleBadge.label}
                        </span>
                      </td>

                      {/* Came Online (Online At) */}
                      <td className="py-3.5 px-4">
                        {user.onlineAt ? (
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 font-medium text-[#111111]">
                              <FiLogIn className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{formatTimestamp(user.onlineAt)}</span>
                            </div>
                            {onlineRelative && (
                              <div className="text-[10px] text-[#6B7280] pl-5">
                                Started {onlineRelative}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#9CA3AF]">No login recorded</span>
                        )}
                      </td>

                      {/* Went Offline (Offline At) */}
                      <td className="py-3.5 px-4">
                        {user.online ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Currently Online
                          </span>
                        ) : user.offlineAt ? (
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 font-medium text-[#374151]">
                              <FiLogOut className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                              <span>{formatTimestamp(user.offlineAt)}</span>
                            </div>
                            {offlineRelative && (
                              <div className="text-[10px] text-[#6B7280] pl-5">
                                Offline {offlineRelative}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#9CA3AF]">Never connected</span>
                        )}
                      </td>

                      {/* Books */}
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <FiBookOpen className="text-[#9CA3AF]" />
                          {user.bookCount}
                        </span>
                      </td>

                      {/* Email Verification */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            user.emailVerified
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : "text-amber-700 bg-amber-50 border-amber-200"
                          }`}
                        >
                          {user.emailVerified ? (
                            <FiCheckCircle className="w-3 h-3" />
                          ) : (
                            <FiClock className="w-3 h-3" />
                          )}
                          {user.emailVerified ? "Verified" : "Not verified"}
                        </span>
                      </td>

                      {/* Presence & Account Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Presence Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              user.online
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : "text-stone-700 bg-stone-100 border-stone-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.online ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
                              }`}
                            />
                            {user.online ? "Online" : "Offline"}
                          </span>

                          {/* Active / Suspended Badge */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              user.disabled || user.accountStatus === "suspended"
                                ? "text-red-700 bg-red-50 border-red-200"
                                : "text-blue-700 bg-blue-50 border-blue-200"
                            }`}
                          >
                            {user.disabled || user.accountStatus === "suspended"
                              ? "Suspended"
                              : "Active"}
                          </span>
                        </div>
                      </td>

                      {/* DEVELOPER ONLY: Edit & Delete Actions */}
                      {isDeveloper && (
                        <td
                          className="py-3.5 px-4 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserForEdit(user);
                              }}
                              title={`Edit ${user.displayName}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#374151] bg-[#e8b45a]/10 border border-[#e8b45a59] hover:bg-[#e8b45a35] hover:text-[#e8785a] transition-colors shadow-2xs"
                            >
                              <FiEdit2 className="w-4 h-4 text-[#e8b45a]" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserForDelete(user);
                              }}
                              title={`Delete ${user.displayName}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 bg-red-50/70 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors shadow-2xs"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0F0F2] px-4 py-3">
            <p className="text-xs text-[#6B7280]">
              {filteredUsers.length === 0
                ? "Showing 0 users"
                : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredUsers.length
                  )} of ${filteredUsers.length} Library users`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1 || loading}
                className="rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#FAFAFB] transition-colors"
              >
                Previous
              </button>

              <span className="text-xs text-[#6B7280]">
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage >= totalPages || loading}
                className="rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#FAFAFB] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal with Confirmation Flow */}
      <EditUserModal
        isOpen={Boolean(selectedUserForEdit)}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onUserUpdated={handleUserUpdated}
        apiEndpoint="/api/library/users"
      />

      {/* Delete User Modal with Confirmation Flow */}
      <DeleteUserModal
        isOpen={Boolean(selectedUserForDelete)}
        onClose={() => setSelectedUserForDelete(null)}
        user={selectedUserForDelete}
        onUserDeleted={handleUserDeleted}
        apiEndpoint="/api/library/users"
      />
    </div>
  );
}
