// "use client";

// import React, { useState } from "react";
// import { useStudio } from "@/features/studio/context";
// import { FiClock, FiSearch } from "react-icons/fi";

// export function ActivityLogTable() {
//   const { recentActivity, openDrawer } = useStudio();
//   const [query, setQuery] = useState("");

//   const filtered = recentActivity.filter(
//     (act) =>
//       act.userName.toLowerCase().includes(query.toLowerCase()) ||
//       act.description.toLowerCase().includes(query.toLowerCase()) ||
//       act.eventType.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
//       <div className="p-4 sm:p-5 border-b border-[#F0F0F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAFB]">
//         <div>
//           <h3 className="font-bold font-syne text-[#111111] text-sm">
//             Platform Activity Audit Logs
//           </h3>
//           <p className="text-xs text-[#6B7280]">
//             Complete chronological event stream across synthesis jobs, security policies, and token top-ups
//           </p>
//         </div>

//         <div className="relative w-full sm:w-64">
//           <FiSearch className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-3" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search activity records..."
//             className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A]"
//           />
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-xs">
//           <thead>
//             <tr className="border-b border-[#F0F0F2] bg-[#FAFAFB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
//               <th className="py-3 px-4">Actor</th>
//               <th className="py-3 px-4">Role Badge</th>
//               <th className="py-3 px-4">Action Summary</th>
//               <th className="py-3 px-4">Event Type</th>
//               <th className="py-3 px-4 text-right">Credits Delta</th>
//               <th className="py-3 px-4">Timestamp</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
//             {filtered.map((act) => (
//               <tr
//                 key={act.id}
//                 onClick={() => openDrawer({ type: "activityDetails", activityId: act.id })}
//                 className="hover:bg-[#FFF5F2] cursor-pointer transition-colors"
//               >
//                 <td className="py-3.5 px-4 font-bold text-[#111111]">
//                   {act.userName}
//                 </td>
//                 <td className="py-3.5 px-4">
//                   <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
//                     {act.userBadge}
//                   </span>
//                 </td>
//                 <td className="py-3.5 px-4 text-[#4B5563] max-w-xs truncate">
//                   {act.description}
//                 </td>
//                 <td className="py-3.5 px-4">
//                   <span className="font-medium text-[#111111]">{act.eventType}</span>
//                 </td>
//                 <td
//                   className={`py-3.5 px-4 font-mono font-bold text-right ${
//                     act.creditsChange > 0 ? "text-emerald-600" : "text-[#111111]"
//                   }`}
//                 >
//                   {act.creditsChange > 0
//                     ? `+${act.creditsChange.toLocaleString()}`
//                     : act.creditsChange.toLocaleString()}
//                 </td>
//                 <td className="py-3.5 px-4 text-[#6B7280] font-mono text-[11px]">
//                   <span className="flex items-center gap-1">
//                     <FiClock className="w-3 h-3" />
//                     {act.timeAgo}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useStudio } from "@/features/studio/context";
import { FiSearch, FiUser, FiRefreshCw } from "react-icons/fi";

interface ActivityUser {
  userId: string;
  userName: string;
  email: string | null;
  latestActivityAt?: string;
  activityCount: number;
}

export function ActivityLogTable() {
  const { openDrawer } = useStudio();

  const [users, setUsers] = useState<ActivityUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  async function loadUsers(signal?: AbortSignal) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/studio/activity/users",
        {
          cache: "no-store",
          signal,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load Studio users.");
      }

      const result: { users: ActivityUser[] } =
        await response.json();

      setUsers(result.users ?? []);
      // } catch (err) {
      //   if (err instanceof Error && err.name === "AbortError") {
      //     return;
      //   }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Failed to load Studio activity users:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users",
      );
    }

    //   setError(
    //     err instanceof Error
    //       ? err.message
    //       : "Something went wrong.",
    //   );
    // }
    finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
    // finally {
    //   if (!signal.aborted) {
    //     setLoading(false);
    //   }
    // }
  }

  // useEffect(() => {
  //   const controller = new AbortController();

  //   void loadUsers(controller.signal);

  //   return () => controller.abort();
  // }, []);

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [
        user.userName,
        user.email ?? "",
        user.userId,
      ].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [users, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(
    filteredUsers.length / ITEMS_PER_PAGE,
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function formatDate(value?: string) {
    if (!value) return "No recorded activity";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleString();
  }

  return (
    <section className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="">
          <h2 className="text-base font-bold text-gray-900">
            Studio Users
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Each user appears once. Select a user to inspect their records.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1 sm:w-72">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search name, email, or ID..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            title="Refresh users"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="px-5 py-3 font-semibold">User ID</th>
              <th className="px-5 py-3 font-semibold">
                Latest activity
              </th>
              <th className="px-5 py-3 text-right font-semibold">
                Details
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Loading Studio users...
                </td>
              </tr>
            )}

            {!loading && !error && filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}

            {/* {filteredUsers.map((user) => ( */}
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                // onClick={() =>
                //   openDrawer({
                //     type: "userActivity",
                //     userId: user.userId,
                //   })
                // }
                onClick={() => {
                  console.log("Clicked user:", user.userId);

                  openDrawer({
                    type: "userActivity",
                    userId: user.userId,
                  });
                }}
                className="cursor-pointer transition-colors hover:bg-indigo-50/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <FiUser size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {user.userName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 font-mono text-xs text-gray-500">
                  {user.userId}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {formatDate(user.latestActivityAt)}
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-semibold text-indigo-600">
                    View details →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
        {filteredUsers.length} user(s)
      </div> */}

      <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          {filteredUsers.length === 0
            ? "0 users"
            : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
              currentPage * ITEMS_PER_PAGE,
              filteredUsers.length,
            )} of ${filteredUsers.length} users`}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1),
              )
            }
            disabled={currentPage >= totalPages || totalPages === 0}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

    </section>
  );
}