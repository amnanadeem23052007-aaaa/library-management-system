"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserCircle,
} from "lucide-react";

import useMembers from "@/hooks/useMembers";
import Loader from "@/components/common/Loader";

export default function MemberTable() {
  const {
    members,
    loading,
  } = useMembers();

  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter((member: any) => {
      return (
        member.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.phone
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.address
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [members, search]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 transition-colors duration-200">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors duration-200" style={{padding:"20px"}}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" style={{padding:"10px"}}>
        <div className="relative w-full sm:w-96">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 
            dark:bg-slate-800/80 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400
             dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500
              focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" style={{padding:"10px"}}
          />
        </div>

        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Total Members: <span className="text-blue-600 dark:text-blue-400 font-bold">{members.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{padding:"10px"}}>
        <table className="w-full text-left" style={{padding:"10px"}}>
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs
             font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{padding:"10px"}}>
              <th className="px-6 py-4" style={{padding:"10px"}}>Member</th>
              <th className="px-6 py-4" style={{padding:"10px"}}>Email</th>
              <th className="px-6 py-4" style={{padding:"10px"}}>Phone</th>
              <th className="px-6 py-4" style={{padding:"10px"}}>Address</th>
              <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Profile Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800" >
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member: any) => {
                const isComplete =
                  member.isProfileComplete ||
                  Boolean(
                    member.name?.trim() &&
                    member.phone?.trim() &&
                    member.address?.trim()
                  );

                return (
                  <tr
                    key={member._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="px-6 py-4" style={{padding:"10px"}}>
                      <div className="flex items-center gap-3">
                        <UserCircle size={36} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {member.name}
                          </p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs">
                            ID: {member._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{member.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{member.phone || "—"}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{member.address || "—"}</td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          isComplete
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50"
                            : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50" 
                        }`} style={{padding:"10px"}}
                      >
                        {isComplete ? "Completed" : "Incomplete"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
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