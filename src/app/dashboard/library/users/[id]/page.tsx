"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiClock,
  FiBookOpen,
  FiRefreshCw,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import { EditUserModal } from "@/components/studio/modals/EditUserModal";
import { DeleteUserModal } from "@/components/studio/modals/DeleteUserModal";
import type { LibraryUser } from "@/features/library/library.service";

type ActivityRecord = Record<string, unknown>;

interface LibraryUserDetails {
  user: {
    id: string;
    name: string;
    email: string | null;
    phoneNumber?: string | null;
    emailVerified?: boolean;
    disabled?: boolean;
    role?: string;
    product?: "studio" | "library";
    accountStatus?: "active" | "suspended";
    online?: boolean;
    onlineAt?: string | null;
    offlineAt?: string | null;
    lastSeen?: string | null;
    createdAt?: string | null;
  };
  userSessions: ActivityRecord[];
  authorProfiles: ActivityRecord[];
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (
    typeof value === "string" &&
    (key.endsWith("_at") || key === "createdAt" || key === "last_seen")
  ) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString();
    }
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function ActivitySection({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof FiClock;
  rows: ActivityRecord[];
}) {
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F2] bg-[#FAFAFB] px-5 py-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#E8785A]" />
          <h2 className="text-sm font-bold text-[#111111]">{title}</h2>
        </div>

        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[#6B7280]">
          No records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0F0F2] text-[10px] uppercase tracking-wider text-[#6B7280]">
                {columns.map((column) => (
                  <th key={column} className="whitespace-nowrap px-4 py-3 font-bold">
                    {formatLabel(column)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
              {rows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="hover:bg-[#FAFAFB]">
                  {columns.map((column) => {
                    const formatted = formatValue(column, row[column]);
                    return (
                      <td
                        key={column}
                        className="max-w-[320px] whitespace-nowrap px-4 py-3 truncate"
                      >
                        <span title={formatted}>{formatted}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function LibraryUserDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;

  const [data, setData] = useState<LibraryUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkRole() {
      try {
        const res = await fetch("/api/auth/me", { signal: controller.signal });
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated && json.user) {
            setIsDeveloper(Boolean(json.user.isDeveloper || json.user.role === "admin"));
          }
        }
      } catch {
        // Ignore background check failure
      }
    }

    checkRole();

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/library/users/${encodeURIComponent(userId)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load Library user details.");
        }

        setData(result as LibraryUserDetails);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading Library user details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [userId]);

  const modalUser: LibraryUser | null = data
    ? {
        id: data.user.id,
        displayName: data.user.name,
        email: data.user.email || "",
        lastSeen: data.user.lastSeen ?? null,
        onlineAt: data.user.onlineAt ?? null,
        offlineAt: data.user.offlineAt ?? null,
        lastLoginAt: data.user.onlineAt ?? null,
        phoneNumber: data.user.phoneNumber ?? null,
        emailVerified: Boolean(data.user.emailVerified),
        disabled: Boolean(data.user.disabled),
        accountStatus:
          data.user.accountStatus || (data.user.disabled ? "suspended" : "active"),
        product: data.user.product || "library",
        role: data.user.role || "user",
        defaultRole: data.user.role || "user",
        projectCount: 0,
        bookCount: data.authorProfiles.reduce(
          (sum, p) => sum + Number(p.number_of_books ?? 0),
          0
        ),
        isAuthorProfile: data.authorProfiles.length > 0,
        authorName:
          data.authorProfiles.length > 0
            ? String(data.authorProfiles[0].author_name ?? data.user.name)
            : null,
        online: Boolean(data.user.online),
        sessionCount: data.userSessions.length,
      }
    : null;

  const handleUserUpdated = (updatedUser: LibraryUser) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          name: updatedUser.displayName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          emailVerified: updatedUser.emailVerified,
          disabled: updatedUser.disabled,
          accountStatus: updatedUser.accountStatus,
          role: updatedUser.role,
          product: updatedUser.product,
        },
      };
    });
    setSuccessMessage(
      `User "${updatedUser.displayName}" was successfully updated in the database.`
    );
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleUserDeleted = () => {
    router.push("/dashboard/library/users");
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/library/users")}
        className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#FAFAFB]"
      >
        <FiArrowLeft />
        Back to Library Users
      </button>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#E8785A]">
          Library / Users / Details
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#111111]">
          Library User Details
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Account information, online/offline session logs, and author profiles.
        </p>
      </div>

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

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-auto inline-flex items-center gap-1 font-semibold"
          >
            <FiRefreshCw />
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-16 text-center text-sm text-[#6B7280]">
          Loading Library user details...
        </div>
      ) : data ? (
        <>
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start justify-between">
              <div className="flex items-start gap-5 min-w-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#E8785A]">
                  <FiUser className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-xl font-bold text-[#111111]">
                      {data.user.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        data.user.online
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          data.user.online ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
                        }`}
                      />
                      {data.user.online ? "Online" : "Offline"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        data.user.accountStatus === "suspended" || data.user.disabled
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {data.user.accountStatus === "suspended" || data.user.disabled
                        ? "Suspended"
                        : "Active Account"}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-[#6B7280]">
                    {data.user.email || "No email available"}
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                        User ID
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-[#374151]">
                        {data.user.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1">
                        <FiLogIn className="text-emerald-600" /> Came Online (Online At)
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#111111]">
                        {data.user.onlineAt
                          ? new Date(data.user.onlineAt).toLocaleString()
                          : "No login recorded"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1">
                        <FiLogOut className="text-stone-500" /> Went Offline (Offline At)
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#111111]">
                        {data.user.online
                          ? "Currently Online"
                          : data.user.offlineAt
                            ? new Date(data.user.offlineAt).toLocaleString()
                            : "Never connected"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isDeveloper && (
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#e6ac46] bg-[#e8b45a]/10 border border-[#e8b45a59] hover:bg-[#e8b45a35] transition-colors shadow-2xs"
                  >
                    <FiEdit2 className="w-3.5 h-3.5 text-[#e8b45a]" />
                    <span>Edit User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50/70 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors shadow-2xs"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Delete User</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-5">
            <ActivitySection
              title="Library Sessions History (Online / Offline)"
              icon={FiClock}
              rows={data.userSessions}
            />
            <ActivitySection
              title="Library Author Profiles"
              icon={FiBookOpen}
              rows={data.authorProfiles}
            />
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-12 text-center">
          <FiAlertCircle className="mx-auto h-8 w-8 text-[#9CA3AF]" />
          <h2 className="mt-3 text-base font-bold text-[#111111]">User not found</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            This account may no longer exist or could not be loaded.
          </p>
        </div>
      )}

      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={modalUser}
        onUserUpdated={handleUserUpdated}
        apiEndpoint="/api/library/users"
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={modalUser}
        onUserDeleted={handleUserDeleted}
        apiEndpoint="/api/library/users"
      />
    </div>
  );
}

