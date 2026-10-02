"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, History } from "lucide-react";

import Loader from "@/components/common/Loader";
import { useMemberRefresh } from "@/components/member/MemberRefreshContext";

type HistoryItem = {
  _id: string;
  status: string;
  fine?: number;
  discount?: number;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  book?: {
    title?: string;
    author?: string;
  };
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BorrowingHistoryPage() {
  const { refreshKey } = useMemberRefresh();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/member/history", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load history");
        }
        setHistory(data.history || []);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load history"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return history
      .filter((item) => {
        const matchesStatus = status === "all" || item.status === status;
        const matchesSearch =
          !query ||
          item.book?.title?.toLowerCase().includes(query) ||
          item.book?.author?.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const left = new Date(a.issueDate).getTime();
        const right = new Date(b.issueDate).getTime();
        return sort === "oldest" ? left - right : right - left;
      });
  }, [history, search, status, sort]);

  return (
    <div className="space-y-8 sm:space-y-10" style={{padding:"30px"}}>
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900" style={{padding:"10px"}}>
          Borrowing History
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500" style={{padding:"10px"}}>
          Your complete record of all borrowed, returned, and overdue books.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 transition-colors duration-200" style={{padding:"30px"}}>
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by book or author..."
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-800
                 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" style={{padding:"10px"}}
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 outline-none
               transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 shrink-0" style={{padding:"10px"}}
            >
              <option value="all" style={{padding:"10px"}}>All Statuses</option>
              <option value="issued" style={{padding:"10px"}}>Issued</option>
              <option value="overdue" style={{padding:"10px"}}>Overdue</option>
              <option value="returned" style={{padding:"10px"}}>Returned</option>
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 
              text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 shrink-0" style={{padding:"10px"}}
            >
              <option value="newest" style={{padding:"10px"}}>Newest First</option>
              <option value="oldest" style={{padding:"10px"}}>Oldest First</option>
            </select>
          </div>

          <div className="text-sm font-semibold text-slate-500 self-end md:self-auto" style={{padding:"10px"}}>
            Total Records: <span className="text-blue-600 font-bold">{filtered.length}</span>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-12" >
            <Loader />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100" style={{padding:"20px"}}>
            <table className="w-full text-left min-w-[760px]">
              <thead >
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500"style={{padding:"10px"}}>
                  <th className="px-6 py-4" style={{padding:"10px"}}>Book</th>
                  <th className="px-6 py-4" style={{padding:"10px"}}>Author</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Issue Date</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Due Date</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Return Date</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Status</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="px-6 py-4.5 sm:py-5 font-semibold text-slate-800 text-sm" style={{padding:"10px"}}>
                        {item.book?.title || "Unknown Book"}
                      </td>
                      <td className="px-6 py-4.5 sm:py-5 text-slate-600 text-sm" style={{padding:"10px"}}>
                        {item.book?.author || "—"}
                      </td>
                      <td className="px-6 py-4.5 sm:py-5 text-center text-slate-600 text-sm" style={{padding:"10px"}}>
                        {formatDate(item.issueDate)}
                      </td>
                      <td className="px-6 py-4.5 sm:py-5 text-center text-slate-600 text-sm" style={{padding:"10px"}}>
                        {formatDate(item.dueDate)}
                      </td>
                      <td className="px-6 py-4.5 sm:py-5 text-center text-slate-600 text-sm" style={{padding:"10px"}} >
                        {formatDate(item.returnDate)}
                      </td>
                      <td className="px-6 py-4.5 sm:py-5 text-center" style={{padding:"10px"}}>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                            item.status === "returned"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : item.status === "overdue"
                              ? "bg-red-50 text-red-700 border-red-200/50"
                              : "bg-blue-50 text-blue-700 border-blue-200/50"
                          }`}  style={{padding:"10px"}}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 sm:py-5 text-center">
                        <span
                          className={`font-bold text-sm ${
                            item.fine && item.fine > 0
                              ? "text-red-600"
                              : "text-slate-700"
                          }`}
                        >
                          Rs. {item.fine || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-14 text-center text-slate-400 text-sm"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                          <History size={22} />
                        </div>
                        <p className="font-medium text-slate-500">No borrowing records match your filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
