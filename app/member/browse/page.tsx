"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen, Search, Star, X } from "lucide-react";
import { toast } from "sonner";

import Loader from "@/components/common/Loader";
import { useMemberRefresh } from "@/components/member/MemberRefreshContext";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  quantity: number;
  available: number;
  rating?: number;
  totalRatings?: number;
  coverImage?: string;
};

function BrowseBooksContent() {
  const router = useRouter();
  const { refresh, refreshKey } = useMemberRefresh();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [borrowId, setBorrowId] = useState<string | null>(null);
  const [borrowing, setBorrowing] = useState(false);

  // Rating modal state
  const [ratingBook, setRatingBook] = useState<Book | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  async function loadBooks(nextPage = page, nextSearch = search) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        limit: "12",
        page: String(nextPage),
        search: nextSearch,
        sort,
        available: "true",
      });

      if (category) {
        params.set("category", category);
      }

      const response = await fetch(`/api/books?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load books");
      }

      const availableBooks = (data.books || []).filter(
        (book: Book) => Number(book.available) > 0
      );

      setBooks(availableBooks);
      setTotalPages(data.totalPages || 1);

      if (Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        const uniqueCategories = Array.from(
          new Set(
            (data.books || [])
              .map((book: Book) => book.category)
              .filter(Boolean)
          )
        ) as string[];

        if (uniqueCategories.length > 0) {
          setCategories((current) =>
            Array.from(new Set([...current, ...uniqueCategories])).sort()
          );
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadAllCategories() {
      try {
        const res = await fetch("/api/books/categories");
        const catData = await res.json();
        if (catData.success && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error("Failed to load initial categories:", err);
      }
    }
    loadAllCategories();
  }, []);

  useEffect(() => {
    loadBooks(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, sort, refreshKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      loadBooks(1, search);
    }, 350);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function submitRating() {
    if (!ratingBook) return;

    try {
      setSubmittingRating(true);
      const res = await fetch(`/api/books/${ratingBook._id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: ratingValue,
          review: reviewText,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "PROFILE_INCOMPLETE") {
          toast.error("Please complete your profile before rating books.");
          router.push("/member/profile");
          return;
        }
        throw new Error(data.message || "Failed to submit rating");
      }

      toast.success("Thank you for your rating!");
      setRatingBook(null);
      setReviewText("");
      setRatingValue(5);
      await loadBooks(page, search);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit rating"
      );
    } finally {
      setSubmittingRating(false);
    }
  }

  async function borrowBook() {
    if (!borrowId) return;

    try {
      setBorrowing(true);
      const response = await fetch("/api/issue-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: borrowId }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === "PROFILE_INCOMPLETE") {
          toast.error("Please complete your profile before borrowing books.");
          router.push("/member/profile");
          return;
        }
        throw new Error(data.message || "Unable to borrow this book");
      }

      toast.success("Book borrowed successfully");
      setBorrowId(null);
      refresh();
      await loadBooks(page, search);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Unable to borrow this book"
      );
    } finally {
      setBorrowing(false);
    }
  }

  return (
    <div className="space-y-8 sm:space-y-10" style={{padding:"10px"}}>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Browse Books
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500">
          Explore books currently available in the library and borrow instantly.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 transition-colors duration-200" style={{padding:"10px"}}>

        {/* ── Controls bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8" >
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-3xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
             style={{padding:"10px"}} />
            </div>

            {/* Category */}
            <select style={{padding:"10px"}}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 shrink-0"
            >
              <option value="" style={{padding:"10px"}}>All Categories ({categories.length || 0})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort */}
            <select style={{padding:"10px"}}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 shrink-0"
            >
              <option value="latest" style={{padding:"10px"}}>Newest First</option>
              <option value="oldest" style={{padding:"10px"}}>Oldest First</option>
              <option value="title" style={{padding:"10px"}}>Title A–Z</option>
              <option value="author" style={{padding:"10px"}}>Author A–Z</option>
            </select>
          </div>

          {/* Available count */}
          <div className="text-sm font-semibold text-slate-500 self-end md:self-auto shrink-0">
            Available:{" "}
            <span className="text-blue-600 font-bold">{books.length}</span>
          </div>
        </div>

        {/* ── Table / States ── */}
        {loading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : books.length === 0 ? (
          /* Empty state */
          <div className="overflow-x-auto rounded-2xl border border-slate-100"  >
            <table className="w-full text-left" >
              <thead >
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500" >
                  <th className="px-6 py-4" >Book</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">ISBN</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4 text-center">Available</th>
                  <th className="px-6 py-4 text-center">Total</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <BookOpen size={28} />
                      </div>
                      <p className="text-base font-bold text-slate-700">No available books found</p>
                      <p className="text-sm text-slate-400 max-w-xs">
                        Try adjusting your search query or category filter.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* Books table */
          <div className="overflow-x-auto rounded-2xl border border-slate-100" style={{padding:"10px"}}>
            <table className="w-full text-left min-w-[860px]" >
              <thead >
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500" >
                  <th className="px-6 py-4" style={{padding:"10px"}}>Book</th>
                  <th className="px-6 py-4" style={{padding:"10px"}}>Subject</th>
                  <th className="px-6 py-4"style={{padding:"10px"}}>ISBN</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Rating</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Available</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Total</th>
                  <th className="px-6 py-4 text-center" style={{padding:"10px"}}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" >
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/80 transition-colors duration-150" 
                  >
                    {/* Book column */}
                    <td className="px-6 py-4 sm:py-5" style={{padding:"20px"}}>
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Cover / icon */}
                        {book.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-12 w-9 shrink-0 rounded-lg object-cover shadow-sm border border-slate-100"
                          />
                        ) : (
                          <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            <BookOpen size={18} />
                          </div>
                        )}
                        {/* Title + Author */}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                            {book.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 font-medium truncate">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject / Category */}
                    <td className="px-6 py-4 sm:py-5">
                      <span className="inline-flex bg-purple-50 text-purple-700 border 
                      border-purple-200/50 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{padding:"10px"}}>
                        {book.category}
                      </span>
                    </td>

                    {/* ISBN */}
                    <td className="px-6 py-4 sm:py-5 text-xs font-mono text-slate-500 whitespace-nowrap" style={{padding:"10px"}}>
                      {book.isbn}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4 sm:py-5 text-center" >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1" >
                          <Star
                            size={14}
                            className={
                              Number(book.rating || 0) > 0
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300" 
                            }
                          />
                          <span className="text-sm font-bold text-slate-800" >
                            {Number(book.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({book.totalRatings || 0})
                        </span>
                      </div>
                    </td>

                    {/* Available */}
                    <td className="px-6 py-4 sm:py-5 text-center" >
                      <span className="inline-flex px-3 py-1 rounded-full text-xs
                       font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/50 whitespace-nowrap" style={{padding:"10px"}}>
                        {book.available} in stock
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 sm:py-5 text-center text-sm font-medium text-slate-600">
                      {book.quantity}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 sm:py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBorrowId(book._id) }
                          className="w-full min-w-[110px] h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 px-4"
                        >
                          Borrow Book
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRatingBook(book);
                            setRatingValue(5);
                            setReviewText("");
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          Rate Book
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">{books.length}</strong> books
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2" style={{padding:"10px"}}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((c) => Math.max(1, c - 1))}
                className="border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition" style={{padding:"10px"}}
              >
                Previous
              </button>

              <span className="bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm" style={{padding:"10px"}}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
                className="border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition" style={{padding:"10px"}}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Borrow Confirmation Modal ── */}
      {borrowId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200" style={{padding:"20px"}}>
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl" style={{padding:"20px"}}>
            <div className="flex items-center gap-3 mb-4" style={{padding:"20px"}}>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center" >
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Confirm Book Loan
                </h3>
                <p className="text-xs text-slate-400">Library Circulation Desk</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              This book will be issued to your member account for 14 days under
              standard library circulation rules.
            </p>

            <div className="mt-8 flex justify-end gap-3" style={{padding:"20px"}}>
              <button
                onClick={() => setBorrowId(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition" style={{padding:"10px"}}
              >
                Cancel
              </button>
              <button
                onClick={borrowBook}
                disabled={borrowing}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition
                 disabled:opacity-60 flex items-center gap-2" style={{padding:"10px"}}
              >
                {borrowing ? "Issuing..." : "Confirm & Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rate Book Modal ── */}
      {ratingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200" style={{padding:"10px"}}>
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl" style={{padding:"10px"}}>
            <div className="flex items-start justify-between" style={{padding:"10px"}}>
              <div>
                <h3 className="text-xl font-bold text-slate-900" style={{padding:"10px"}}>
                  Rate &quot;{ratingBook.title}&quot;
                </h3>
                <p className="text-xs text-slate-500 mt-0.5" style={{padding:"10px"}}>
                  by {ratingBook.author}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRatingBook(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Your Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        star <= ratingValue
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-slate-700">
                  {ratingValue} / 5
                </span>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2" style={{padding:"10px"}}>
                Review Feedback (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this book with other members..."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                maxLength={500}
             style={{padding:"10px"}} />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRatingBook(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition" style={{padding:"10px"}}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRating}
                disabled={submittingRating}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60
                 flex items-center gap-2" style={{padding:"10px"}}
              >
                {submittingRating ? "Saving..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrowseBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <BrowseBooksContent />
    </Suspense>
  );
}
