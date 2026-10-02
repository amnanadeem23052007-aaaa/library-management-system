"use client";

import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  SquarePen,
  Trash2,
  Star,
} from "lucide-react";

import Loader from "@/components/common/Loader";
import useBooks from "@/hooks/useBooks";

import AddBookModal from "./AddBookModal";
import EditBookModal from "./EditBookModal";

export default function BookTable() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const {
    books,
    categories,
    loading,
    page,
    totalPages,
    totalBooks,
    search,
    category,
    setPage,
    setSearch,
    setCategory,
    fetchBooks,
  } = useBooks();

  const filteredBooks = books;

  if (loading && books.length === 0) {
    return <Loader />;
  }

  const deleteBook = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete book");
        return;
      }

      fetchBooks();

      alert("Book Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 
      p-6 md:p-8 transition-colors duration-200" style={{ padding: "20px" }}>
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1" style={{ padding: "20px" }}>
              <Search
                size={18}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none "
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 rounded-2xl border
                 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100
                  placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500
                   focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" style={{ padding: "10px" }}
              />
            </div>

            <select style={{ padding: "10px" }}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 shrink-0"
            >
              <option value="" style={{ padding: "10px" }}>All Categories ({categories.length || 50})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-2xl flex
              items-center justify-center gap-2 font-semibold shadow-sm transition shrink-0" style={{ padding: "10px" }}
          >
            <Plus size={18} />
            <span>Add Book</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left" style={{ padding: "20px" }}>
            <thead style={{ padding: "10px" }}>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800
               text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4" style={{ padding: "10px" }}>Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">ISBN</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-center">Available</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800" style={{ padding: "10px" }}>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book: any) => (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition" style={{ padding: "10px" }}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100" style={{ padding: "10px" }}>
                      {book.title}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm" >
                      {book.author}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border
                       border-purple-200/50 dark:border-purple-800/50 px-3 py-1 rounded-full text-xs font-semibold" >
                        {book.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-mono">
                      {book.isbn}
                    </td>

                    <td className="px-6 py-4 text-center font-medium text-slate-700 dark:text-slate-200" style={{ padding: "10px" }}>
                      {book.quantity}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${book.available > 0
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50"
                            : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50"
                          }`} style={{ padding: "10px" }}
                      >
                        {book.available}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Star
                          size={15}
                          className={
                            book.rating && Number(book.rating) > 0
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {book.rating ? Number(book.rating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          ({book.totalRatings || 0})
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setOpenEdit(true);
                          }}
                          className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 transition flex justify-center items-center"
                          title="Edit Book" style={{ padding: "10px" }}
                        >
                          <SquarePen size={18} />
                        </button>

                        <button
                          onClick={() => deleteBook(book._id)}
                          className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition flex justify-center items-center"
                          title="Delete Book"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No books match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-700 dark:text-slate-200">{filteredBooks.length}</strong> of{" "}
            <strong className="text-slate-700 dark:text-slate-200">{totalBooks}</strong> books
          </p>

          <div className="flex items-center gap-2" style={{ padding: "20px" }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="border border-slate-200 dark:border-slate-700 text-slate-700 
              dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition" style={{ padding: "10px" }}
            >
              Previous
            </button>

            <span className="bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm" style={{ padding: "10px" }}>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="border border-slate-200 dark:border-slate-700
               text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition" style={{ padding: "10px" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddBookModal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          fetchBooks();
        }}
      />

      <EditBookModal
        open={openEdit}
        book={selectedBook}
        onClose={() => {
          setOpenEdit(false);
          setSelectedBook(null);
          fetchBooks();
        }}
      />
    </>
  );
}