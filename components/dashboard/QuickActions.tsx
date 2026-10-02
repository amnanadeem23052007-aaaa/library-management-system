"use client";

import { useState } from "react";
import Link from "next/link";

import {
  BookPlus,
  Users,
  BookMarked,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

export default function QuickActions() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 
    sm:p-8 lg:p-9 relative transition-colors duration-200" style={{ padding: "20px" }}>
      {/* TITLE */}
      <div className="mb-6 sm:mb-8" style={{ padding: "20px" }}>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Frequent librarian tasks and shortcuts
        </p>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* ADD BOOK */}
        <Link
          href="/dashboard/books"
          className="rounded-2xl bg-blue-600 
          text-white p-5 sm:p-7 flex flex-col items-center justify-center gap-3 hover:bg-blue-700 hover:scale-[1.02] transition shadow-sm group" style={{ padding: "10px" }}>

          <BookPlus size={30} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm sm:text-base text-center">
            Add Book
          </span>
        </Link>

        {/* VIEW MEMBERS */}
        <Link
          href="/dashboard/members"
          className="rounded-2xl bg-emerald-600 text-white p-5 sm:p-7 flex flex-col items-center justify-center gap-3 hover:bg-emerald-700 hover:scale-[1.02] transition shadow-sm group"
        >
          <Users size={30} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm sm:text-base text-center">
            Members
          </span>
        </Link>

        {/* ISSUED BOOKS */}
        <Link
          href="/dashboard/issue-books"
          className="rounded-2xl bg-amber-500 text-white p-5 sm:p-7 flex flex-col items-center justify-center gap-3 hover:bg-amber-600 hover:scale-[1.02] transition shadow-sm group"
        >
          <BookMarked size={30} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm sm:text-base text-center">
            Issued Books
          </span>
        </Link>

        {/* MORE */}
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="rounded-2xl bg-violet-600 text-white p-5 sm:p-7 flex flex-col items-center  justify-center gap-3 hover:bg-violet-700 hover:scale-[1.02] transition shadow-sm group"
        >
          {showMore ? (
            <X size={30} className="group-hover:scale-110 transition-transform" />
          ) : (
            <Plus size={30} className="group-hover:scale-110 transition-transform" />
          )}
          <span className="font-semibold text-sm sm:text-base text-center">
            More
          </span>
        </button>
      </div>

      {/* MORE MENU */}
      {showMore && (
        <div
          className="
            absolute
            right6 sm:right-4
            bottom-6 sm:bottom-2
            w-64
            bg-white dark:bg-slate-900
            border
            border-slate-200 dark:border-slate-800
            rounded-2xl
            shadow-2xl
            overflow-hidden
            z-50
          "
        >
          {/* RETURN BOOK */}
          <Link
            href="/dashboard/return-books"
            onClick={() => setShowMore(false)}
            className="
              flex
              items-center
              gap-3
              px-5
              py-4
              text-slate-700 dark:text-slate-200
              hover:bg-slate-50 dark:hover:bg-slate-800
              transition
            " style={{ padding: "10px" }}
          >
            <RotateCcw
              size={20}
              className="text-violet-600 dark:text-violet-400"
            />
            <span className="font-medium text-sm">
              Return Book
            </span>
          </Link>

          {/* DELETED BOOKS */}
          <Link
            href="/dashboard/deleted-books"
            onClick={() => setShowMore(false)}
            className="
              flex
              items-center
              gap-3
              px-5
              py-4
              text-slate-700 dark:text-slate-200
              hover:bg-slate-50 dark:hover:bg-slate-800
              transition
            "  >

            <Trash2
              size={20}
              className="text-red-600 dark:text-red-400" style={{ marginLeft: "7px" }}
            />
            <span className="font-medium text-sm">
              Deleted Books
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}