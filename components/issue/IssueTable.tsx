"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";

import Loader from "@/components/common/Loader";
import useIssues from "@/hooks/useIssue";

export default function IssueTable() {
  const { issues, loading, fetchIssues } = useIssues();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return issues.filter((item: any) => {
      return (
        item.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.member?.name?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [issues, search]);

  async function returnBook(id: string) {
    const ok = confirm("Are you sure you want to mark this book as returned?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/issue-books/${id}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to return book");
        return;
      }

      alert("Book marked as returned successfully");
      fetchIssues();
    } catch (error) {
      console.log(error);
      alert("Something went wrong while returning book");
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border
     border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors duration-200" style={{padding:"20px"}}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book or member..."
            className="w-full h-12 rounded-2xl border border-slate-200 
            dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 pl-11 pr-4 text-sm text-slate-800
             dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500 
             focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" style={{padding:"20px"}}
          />
        </div>

        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Total Records: <span className="text-blue-600 dark:text-blue-400 font-bold">{issues.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{padding:"20px"}}>
        <table className="w-full text-left" >
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4" style={{padding:"20px"}}>Book</th>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4 text-center">Issue Date</th>
              <th className="px-6 py-4 text-center">Due Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800" >
            {filtered.length > 0 ? (
              filtered.map((item: any) => (
                <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100" style={{padding:"20px"}} >
                    {item.book?.title || "Unknown Book"}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                    {item.member?.name || "Unknown Member"}
                  </td>

                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300 text-sm">
                    {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : "—"}
                  </td>

                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300 text-sm">
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "—"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                        item.status === "issued"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50"
                          : item.status === "overdue"
                            ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50"
                            : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50"
                      }`} style={{padding:"10px"}}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {item.status !== "returned" ? (
                        <button
                          onClick={() => returnBook(item._id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-sm transition"
                          title="Return Book" style={{padding:"10px"}}
                        >
                          <RotateCcw size={14} />
                          <span>Return</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Returned</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No issued book records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}