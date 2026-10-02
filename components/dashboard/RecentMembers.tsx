"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Loader from "@/components/common/Loader";

type Member = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
};

export default function RecentMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecentMembers() {
    try {
      setLoading(true);

      const res = await fetch("/api/members", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch members"
        );
      }

      const membersData = Array.isArray(data.members)
        ? data.members
        : [];

      // Latest members first
      const sortedMembers = [...membersData]
        .sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

          return dateB - dateA;
        })
        .slice(0, 5);

      setMembers(sortedMembers);
    } catch (error) {
      console.log(
        "Recent Members Error:",
        error
      );

      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentMembers();
  }, []);

  function getJoinedText(
    createdAt?: string
  ) {
    if (!createdAt) {
      return "Unknown";
    }

    const createdDate = new Date(createdAt);

    if (Number.isNaN(createdDate.getTime())) {
      return "Unknown";
    }

    const now = new Date();

    const difference =
      now.getTime() - createdDate.getTime();

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return "Today";
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} Days Ago`;
    }

    if (days < 30) {
      const weeks = Math.floor(days / 7);

      return weeks === 1
        ? "1 Week Ago"
        : `${weeks} Weeks Ago`;
    }

    const months = Math.floor(days / 30);

    return months === 1
      ? "1 Month Ago"
      : `${months} Months Ago`;
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-9 transition-colors
     duration-200" style={{ padding: "20px" }}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8" style={{ padding: "20px" }}>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Recent Members
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Newly registered library members
          </p>
        </div>

        <Link
          href="/dashboard/members"
          className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition self-start sm:self-auto"
        >
          <span>View All</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{ padding: "20px" }}>
        <table className="w-full text-left min-w-[620px]" >
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100
             dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ padding: "20px" }}>
              <th className="px-6 py-4.5">Member</th>
              <th className="px-6 py-4.5">Email</th>
              <th className="px-6 py-4.5">Phone</th>
              <th className="px-6 py-4.5">Joined</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800" >
            {members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                >
                  {/* MEMBER */}
                  <td className="px-6 py-4.5 sm:py-5" style={{ padding: "10px" }}>
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                        {member.name}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4.5 sm:py-5 text-slate-600 dark:text-slate-300 text-sm">
                    {member.email}
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-4.5 sm:py-5 text-slate-600 dark:text-slate-300 text-sm">
                    {member.phone || "—"}
                  </td>

                  {/* JOINED */}
                  <td className="px-6 py-4.5 sm:py-5">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50" style={{marginLeft:"20px",padding:"5px"}}>
                      {getJoinedText(member.createdAt)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm"
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}