"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Loader from "@/components/common/Loader";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  available: number;
  quantity: number;
  createdAt?: string;
};

export default function RecentBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecentBooks() {
    try {
      setLoading(true);

      const res = await fetch("/api/books", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch books"
        );
      }

      const booksData = Array.isArray(data.books)
        ? data.books
        : [];

      // Latest books first
      const sortedBooks = [...booksData]
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

      setBooks(sortedBooks);
    } catch (error) {
      console.log("Recent Books Error:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentBooks();
  }, []);

  function getStatus(book: Book) {
    if (book.available > 0) {
      return "Available";
    }

    return "Issued";
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-9 transition-colors duration-200"
      style={{ padding: "10px" }}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8" style={{ padding: "10px" }}>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Recent Books
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Recently cataloged books in the library system</p>
        </div>

        <Link
          href="/dashboard/books"
          className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition self-start sm:self-auto"
        >
          <span>View All</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{ padding: "10px" }}>
        <table className="w-full text-left min-w-[620px]" >
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs
             font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ padding: "10px" }}>
              <th className="px-6 py-4.5" style={{ padding: "10px" }}>Title</th>
              <th className="px-6 py-4.5" style={{ padding: "10px" }}>Author</th>
              <th className="px-6 py-4.5" style={{ padding: "10px" }}>Category</th>
              <th className="px-6 py-4.5 text-center" style={{ padding: "10px" }}>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {books.length > 0 ? (
              books.map((book) => {
                const status = getStatus(book);

                return (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="px-6 py-4.5 sm:py-5 font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      {book.title}
                    </td>

                    <td className="px-6 py-4.5 sm:py-5 text-slate-600 dark:text-slate-300 text-sm">
                      {book.author}
                    </td>

                    <td className="px-6 py-4.5 sm:py-5">
                      <span className="inline-flex items-center bg-purple-50 dark:bg-purple-950/50 text-purple-700
                       dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200/50 dark:border-purple-800/50" style={{ padding: "2px" }}>
                        {book.category}
                      </span>
                    </td>

                    <td className="px-6 py-4.5 sm:py-5 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${status === "Available"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50"
                            : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50"
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm"
                >
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}