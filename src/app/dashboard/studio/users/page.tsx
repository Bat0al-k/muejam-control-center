"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiFolder,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { EditUserModal } from "@/components/studio/modals/EditUserModal";
import { DeleteUserModal } from "@/components/studio/modals/DeleteUserModal";

export interface StudioUser {
  id: string;
  displayName: string;
  email: string;
  lastSeen: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  disabled: boolean;
  role: string;
  defaultRole: string;
  projectCount: number;
  online: boolean;
}

interface CurrentUserAuth {
  id: string;
  role: string;
  isDeveloper: boolean;
}

interface StudioUsersResponse {
  users: StudioUser[];
  totalAccounts: number;
  onlineUsers: number;
  verifiedEmails: number;
  currentUser?: CurrentUserAuth;
}

function formatLastSeen(value: string | null): string {
  if (!value) return "No activity recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString();
}

function getRoleBadge(role: string) {
  const norm = (role || "").toLowerCase();
  switch (norm) {
    case "admin":
      return { label: "Developer", classes: "bg-purple-50 text-purple-700 border-purple-200" };
    case "sub_admin":
      return { label: "Admin", classes: "bg-blue-50 text-blue-700 border-blue-200" };
    case "user":
      return { label: "User", classes: "bg-slate-100 text-slate-700 border-slate-200" };
    case "author":
    default:
      return { label: "Author", classes: "bg-stone-100 text-stone-700 border-stone-200" };
  }
}

export default function UsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<StudioUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Authentication & Developer permission state
  const [currentUser, setCurrentUser] = useState<CurrentUserAuth | null>(null);

  // Modals state for Developer actions
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<StudioUser | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<StudioUser | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const isDeveloper = Boolean(currentUser?.isDeveloper || currentUser?.role === "admin");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch Studio users data
        const response = await fetch("/api/studio/users", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load Studio users.");
        }

        const result: StudioUsersResponse = await response.json();
        setData(result);

        if (result.currentUser) {
          setCurrentUser(result.currentUser);
        } else {
          // Fallback to /api/auth/me to verify user identity & role
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
            : "Something went wrong while loading users."
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
      return (
        user.displayName.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        (user.phoneNumber ?? "").toLowerCase().includes(normalizedQuery) ||
        (user.role ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [data, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle successful update from Edit modal
  const handleUserUpdated = (updatedUser: StudioUser) => {
    setData((prev) => {
      if (!prev) return prev;
      const nextUsers = prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      return {
        ...prev,
        users: nextUsers,
        verifiedEmails: nextUsers.filter((u) => u.emailVerified).length,
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
      return {
        ...prev,
        users: remainingUsers,
        totalAccounts: remainingUsers.length,
        onlineUsers: remainingUsers.filter((u) => u.online).length,
        verifiedEmails: remainingUsers.filter((u) => u.emailVerified).length,
      };
    });

    setSuccessMessage(`User "${deletedUser?.displayName || deletedUserId}" was permanently removed from the database.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
            Studio Creators &amp; Accounts
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Monitor Studio accounts, permissions, email verification, activity, and projects.
          </p>
        </div>

        {/* Developer Badge status indicator */}
        {isDeveloper && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold self-start sm:self-auto shadow-2xs">
            <FiShield className="w-3.5 h-3.5 text-purple-600" />
            <span>Developer Mode: Edit &amp; Delete Enabled</span>
          </div>
        )}
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

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Total Accounts
            </p>
            <FiUsers className="w-5 h-5 text-[#E8785A]" />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#111111]">
            {loading ? "—" : (data?.totalAccounts ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            All Studio accounts
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280]">
              Online Users
            </p>
            <FiClock className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-[#111111]">
            {loading ? "—" : (data?.onlineUsers ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Based on activity in the last 5 minutes
          </p>
        </div>

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
          <p className="mt-1 text-xs text-[#6B7280]">
            Accounts with verified email addresses
          </p>
        </div>
      </div>

      {/* Accounts Table Container */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#F0F0F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAFB]">
          <div className="flex items-center gap-2">
            <FiUsers className="w-4 h-4 text-[#E8785A]" />
            <h3 className="font-bold font-syne text-[#111111] text-sm">
              Provisioned Studio Accounts ({filteredUsers.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, role..."
              aria-label="Search Studio users"
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
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Email Verification</th>
                <th className="py-3 px-4">Account Status</th>
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
                    Loading Studio accounts...
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
                    No Studio accounts found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role || user.defaultRole);

                  return (
                    <tr
                      key={user.id}
                      onClick={() => router.push(`/dashboard/studio/users/${user.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          router.push(`/dashboard/studio/users/${user.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`View details for ${user.displayName}`}
                      className="cursor-pointer hover:bg-[#FAFAFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8785A] transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-[#111111]">
                        {user.displayName}
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

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-[#6B7280]">
                        {user.phoneNumber || "—"}
                      </td>

                      {/* Last Seen */}
                      <td className="py-3.5 px-4 text-[#6B7280]">
                        {formatLastSeen(user.lastSeen)}
                      </td>

                      {/* Projects */}
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <FiFolder className="text-[#9CA3AF]" />
                          {user.projectCount}
                        </span>
                      </td>

                      {/* Email Verification */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${user.emailVerified
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

                      {/* Account Status */}
                      <td className="py-3.5 px-4.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${user.disabled
                            ? "text-red-700 bg-red-50 border-red-200"
                            : user.online
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : "text-stone-700 bg-stone-100 border-stone-200"
                            }`}
                        >
                          {user.disabled
                            ? "Disabled"
                            : user.online
                              ? "Online"
                              : user.lastSeen
                                ? "Offline"
                                : "No activity data"}
                        </span>
                      </td>

                      {/* DEVELOPER ONLY: Edit & Delete Actions */}
                      {isDeveloper && (
                        <td
                          className="py-3.5 px-4 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            {/* Edit Button */}
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
                              {/* <span>Edit</span> */}
                            </button>

                            {/* Delete Button */}
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
                              {/* <span>Delete</span> */}
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
                )} of ${filteredUsers.length} users`}
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
      />

      {/* Delete User Modal with Confirmation Flow */}
      <DeleteUserModal
        isOpen={Boolean(selectedUserForDelete)}
        onClose={() => setSelectedUserForDelete(null)}
        user={selectedUserForDelete}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}