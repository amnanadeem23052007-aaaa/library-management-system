"use client";

import { useMemo, useState } from "react";

import {
  Search,
  RotateCcw,
  CheckCircle,
  Pencil,
  Trash2,
} from "lucide-react";

import Loader from "@/components/common/Loader";
import useReturn from "@/hooks/useReturn";
import ReturnModal from "./ReturnModal";

export default function ReturnTable() {
  const {
    returnedBooks,
    loading,
    fetchReturnedBooks,
  } = useReturn();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  function editReturn(item: any) {
    setSelectedReturn(item);
    setEditOpen(true);
  }

  async function deleteReturn(id: string) {
    const ok = confirm("Delete this return record?");
    if (!ok) return;

    try {
      const res = await fetch("/api/return-books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Return Record Deleted");
      fetchReturnedBooks();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  const filtered = useMemo(() => {
    return returnedBooks.filter((book: any) => {
      return (
        book.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.member?.name?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [returnedBooks, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 
      dark:border-slate-800 p-6 md:p-8 transition-colors duration-200" style={{padding:"30px"}}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by book or member..."
              className="w-full h-12 rounded-2xl
               border border-slate-200 dark:border-slate-700 bg-slate-50/50 
               dark:bg-slate-800/80 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 
               placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition 
               focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" style={{padding:"10px"}}
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 rounded-2xl 
             flex items-center gap-2 font-semibold shadow-sm transition shrink-0" style={{padding:"10px"}}
          >
            <RotateCcw size={18} />
            <span>Process Return</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{padding:"10px"}}>
          <table className="w-full text-left" >
            <thead >
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4" style={{padding:"10px"}}>Book</th>
                <th className="px-6 py-4" style={{padding:"10px"}}>Member</th>
                <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Issue Date</th>
                <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Return Date</th>
                <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Fine</th>
                <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800" >
              {filtered.length > 0 ? (
                filtered.map((book: any) => (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition" 
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100" style={{padding:"10px"}}>
                      {book.book?.title || "Unknown Book"}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                      {book.member?.name || "Unknown Member"}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300 text-sm">
                      {book.issueDate ? new Date(book.issueDate).toLocaleDateString() : "—"}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300 text-sm">
                      {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "—"}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-200 font-medium text-sm">
                      Rs {book.fine ?? 0}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                        <CheckCircle size={14} />
                        <span className="capitalize" style={{padding:"10px"}}>{book.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => editReturn(book)}
                          className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 transition flex items-center justify-center"
                          title="Edit Return Record"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => deleteReturn(book._id)}
                          className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition flex items-center justify-center"
                          title="Delete Return Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No returned book records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReturnModal
        open={open || editOpen}
        issue={selectedReturn}
        onClose={() => {
          setOpen(false);
          setEditOpen(false);
          setSelectedReturn(null);
          fetchReturnedBooks();
        }}
      />
    </>
  );
}