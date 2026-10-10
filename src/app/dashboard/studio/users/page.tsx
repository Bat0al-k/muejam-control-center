// "use client";

// import React, { useState } from "react";
// import { FiUsers, FiSearch, FiCheckCircle } from "react-icons/fi";

// const studioUsers = [
//   { id: "usr-1", name: "Sarah Lin", email: "sarah.lin@creators.muejam.com", role: "Creator Pro", activePipelines: 1, totalCredits: 42100, status: "Active" },
//   { id: "usr-2", name: "Marcus Vance", email: "m.vance@enterprise.studio", role: "Enterprise Studio", activePipelines: 2, totalCredits: 125000, status: "Active" },
//   { id: "usr-3", name: "Dr. Aris Thorne", email: "thorne@linguistics.cam.ac.uk", role: "Academic Tier", activePipelines: 1, totalCredits: 18400, status: "Active" },
//   { id: "usr-4", name: "Elena Gomez", email: "elena@motionreel.io", role: "Pro Creator", activePipelines: 1, totalCredits: 34200, status: "Active" },
//   { id: "usr-5", name: "Kavita Rao", email: "kavita.rao@apexai.org", role: "Enterprise Studio", activePipelines: 0, totalCredits: 89000, status: "Active" },
// ];

// export default function UsersPage() {
//   const [query, setQuery] = useState("");

//   const filtered = studioUsers.filter(
//     (u) =>
//       u.name.toLowerCase().includes(query.toLowerCase()) ||
//       u.email.toLowerCase().includes(query.toLowerCase()) ||
//       u.role.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="space-y-6 max-w-[1440px] mx-auto">
//       <div>
//         <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
//           Studio Creators &amp; Accounts
//         </h1>
//         <p className="text-xs text-[#6B7280] mt-1">
//           Active tenant creators provisioned with GPU cluster synthesis privileges.
//         </p>
//       </div>

//       <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
//         <div className="p-4 sm:p-5 border-b border-[#F0F0F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAFB]">
//           <div className="flex items-center gap-2">
//             <FiUsers className="w-4 h-4 text-[#E8785A]" />
//             <h3 className="font-bold font-syne text-[#111111] text-sm">
//               Provisioned Studio Accounts ({filtered.length})
//             </h3>
//           </div>

//           <div className="relative w-full sm:w-64">
//             <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search creators..."
//               className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs">
//             <thead>
//               <tr className="border-b border-[#F0F0F2] bg-[#FAFAFB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
//                 <th className="py-3 px-4">User</th>
//                 <th className="py-3 px-4">Email</th>
//                 <th className="py-3 px-4">Tier / Role</th>
//                 <th className="py-3 px-4">Active Jobs</th>
//                 <th className="py-3 px-4 text-right">Available Credits</th>
//                 <th className="py-3 px-4">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
//               {filtered.map((u) => (
//                 <tr key={u.id} className="hover:bg-[#FAFAFB] transition-colors">
//                   <td className="py-3.5 px-4 font-bold text-[#111111]">{u.name}</td>
//                   <td className="py-3.5 px-4 text-[#6B7280]">{u.email}</td>
//                   <td className="py-3.5 px-4">
//                     <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
//                       {u.role}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-4 font-mono font-semibold">
//                     {u.activePipelines} running
//                   </td>
//                   <td className="py-3.5 px-4 font-mono font-bold text-right text-[#111111]">
//                     {u.totalCredits.toLocaleString()} cr
//                   </td>
//                   <td className="py-3.5 px-4">
//                     <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200">
//                       <FiCheckCircle className="w-3 h-3 text-emerald-600" />
//                       {u.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


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
} from "react-icons/fi";
import { useRouter } from "next/navigation";


interface StudioUser {
  id: string;
  displayName: string;
  email: string;
  lastSeen: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  disabled: boolean;
  projectCount: number;
  online: boolean;
}

interface StudioUsersResponse {
  users: StudioUser[];
  totalAccounts: number;
  onlineUsers: number;
  verifiedEmails: number;
}

function formatLastSeen(value: string | null): string {
  if (!value) return "No activity recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString();
}

export default function UsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<StudioUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/studio/users", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load Studio users.");
        }

        const result: StudioUsersResponse = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading users.",
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
        (user.phoneNumber ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [data, query]);


  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
          Studio Creators &amp; Accounts
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Monitor Studio accounts, email verification, activity, and projects.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
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

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
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

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
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
              placeholder="Search name, email, or phone..."
              aria-label="Search Studio users"
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0F0F2] bg-[#FAFAFB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Email Verification</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 px-4 text-center text-[#6B7280]"
                  >
                    Loading Studio accounts...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 px-4 text-center text-[#6B7280]"
                  >
                    Unable to load accounts. Please try again.
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 px-4 text-center text-[#6B7280]"
                  >
                    No Studio accounts found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
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
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      {user.displayName}
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280]">
                      <span className="inline-flex items-center gap-1.5">
                        <FiMail className="shrink-0" />
                        {user.email || "—"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280]">
                      {user.phoneNumber || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280]">
                      {formatLastSeen(user.lastSeen)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <FiFolder className="text-[#9CA3AF]" />
                        {user.projectCount}
                      </span>
                    </td>

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

                    <td className="py-3.5 px-4">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0F0F2] px-4 py-3">
            <p className="text-xs text-[#6B7280]">
              {filteredUsers.length === 0
                ? "Showing 0 users"
                : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredUsers.length,
                )} of ${filteredUsers.length} users`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1 || loading}
                className="rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40"
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
                className="rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}