"use client";

import { useMemo, useState } from "react";

import {
  RotateCcw,
  Trash2,
  Search,
  User,
} from "lucide-react";

import Loader from "@/components/common/Loader";
import useDeletedMembers from "@/hooks/useDeletedMembers";

export default function DeleteMemberTable() {
  const {
    members,
    loading,
    fetchDeletedMembers,
  } = useDeletedMembers();

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return members.filter((member: any) => {
      return (
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.phone?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [members, search]);

  async function restoreMember(id: string) {
    const ok = confirm("Restore this member?");
    if (!ok) return;

    try {
      const res = await fetch("/api/deleted-members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Member Restored Successfully");
      fetchDeletedMembers();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMember(id: string) {
    const ok = confirm("Permanently delete this member? This cannot be undone.");
    if (!ok) return;

    try {
      const res = await fetch("/api/deleted-members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Member Deleted Permanently");
      fetchDeletedMembers();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors duration-200" style={{padding:"30px"}}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-12 rounded-2xl
             border border-slate-200 dark:border-slate-700 bg-slate-50/50
              dark:bg-slate-800/80 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100
               placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition
                focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" style={{padding:"10px"}}
          />
        </div>

        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Deleted Members: <span className="text-red-600 dark:text-red-400 font-bold">{members.length}</span>
        </div>
      </div>
 
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{padding:"20px"}}>
        <table className="w-full text-left" >
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4" style={{padding:"10px"}}>Name</th>
              <th className="px-6 py-4" style={{padding:"10px"}}>Email</th>
              <th className="px-6 py-4" style={{padding:"10px"}}>Phone</th>
              <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Deleted</th>
              <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length > 0 ? (
              filtered.map((member: any) => (
                <tr
                  key={member._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <User
                        size={18}
                        className="text-blue-600 dark:text-blue-400 shrink-0"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-100" style={{padding:"10px"}}>
                        {member.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm" style={{padding:"10px"}}>
                    {member.email}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm" style={{padding:"10px"}}>
                    {member.phone || "—"}
                  </td>

                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300 text-sm" style={{padding:"10px"}}>
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => restoreMember(member._id)}
                        className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 transition flex items-center justify-center"
                        title="Restore Member"
                      >
                        <RotateCcw size={16} />
                      </button>

                      <button
                        onClick={() => deleteMember(member._id)}
                        className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition flex items-center justify-center"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm"
                >
                  No deleted members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}