"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, Clock3 } from "lucide-react";

import Loader from "@/components/common/Loader";
import { useMemberRefresh } from "@/components/member/MemberRefreshContext";

type IssueItem = {
  _id: string;
  status: string;
  fine?: number;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  book?: {
    title?: string;
    author?: string;
    category?: string;
    isbn?: string;
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

export default function MyBooksPage() {
  const { refreshKey } = useMemberRefresh();
  const [issued, setIssued] = useState<IssueItem[]>([]);
  const [overdue, setOverdue] = useState<IssueItem[]>([]);
  const [returned, setReturned] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/member/books", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load books");
        }
        setIssued(data.issued || []);
        setOverdue(data.overdue || []);
        setReturned(data.returned || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 sm:p-20 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10" style={{padding:"10px"}}>
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900" style={{padding:"10px"}}>
          My Books
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500" style={{padding:"10px"}}>
          Track books currently issued, overdue, and returned to your account.
        </p>
      </div>

      <BookSection
        title="Currently Issued"
        description="Active book loans issued to your member account"
        items={issued}
        empty="No books currently issued to your account."
        badgeColor="bg-blue-50 text-blue-700 border-blue-200/50" 
      />

      <BookSection
        title="Overdue Books"
        description="Books past due date that need immediate return"
        items={overdue}
        empty="No overdue books. Great job keeping your loans on time!"
        badgeColor="bg-red-50 text-red-700 border-red-200/50" 
      />

      <BookSection
        title="Returned Books"
        description="History of all completed book returns"
        items={returned}
        empty="No returned books yet."
        badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/50"
      />
    </div>
  );
}

function BookSection({
  title,
  description,
  items,
  empty,
  badgeColor,
}: {
  title: string;
  description: string;
  items: IssueItem[];
  empty: string;
  badgeColor: string;
}) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-9 transition-colors duration-200 space-y-6" style={{padding:"10px",marginBottom:"20px"}}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100"  >
        <div  >
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {title}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {description}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor} self-start sm:self-auto`} style={{padding:"10px"}}
        >
          {items.length} {items.length === 1 ? "book" : "books"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center" style={{padding:"10px"}}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3 border border-slate-100">
            <BookOpen size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500">{empty}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" style={{padding:"10px"}}>
          {items.map((issue) => (
            <article
              key={issue._id}
              className="group flex flex-col justify-between rounded-3xl
               border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl" style={{padding:"20px"}}
            >
              <div style={{padding:"10px"}}>
                <div className="flex items-start justify-between gap-3" style={{padding:"10px"}}>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors" >
                    {issue.book?.title || "Unknown Book"}
                  </h3>
                  {issue.status === "overdue" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3
                     py-1 text-xs font-semibold text-red-700 border border-red-200/50 shrink-0" >
                      <AlertTriangle size={13}  />
                      Overdue
                    </span>
                  ) : issue.status === "returned" ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/50 shrink-0" style={{padding:"10px"}}>
                      Returned
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/50 shrink-0">
                      Issued
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs font-medium text-slate-500" style={{padding:"10px"}}>
                  by {issue.book?.author || "Unknown Author"}
                </p>

                <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 p-4 text-xs" >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium" style={{padding:"10px"}}>Category</span>
                    <span className="font-semibold text-purple-700 bg-purple-50 border border-purple-200/50 px-2 py-0.5 rounded-full text-[11px]">
                      {issue.book?.category || "General"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium" style={{padding:"10px"}}>ISBN</span>
                    <span className="font-mono text-slate-700">{issue.book?.isbn || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium" style={{padding:"10px"}}>Issue Date</span>
                    <span className="font-semibold text-slate-800">{formatDate(issue.issueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium" style={{padding:"10px"}}>Due Date</span>
                    <span className="font-semibold text-slate-800">{formatDate(issue.dueDate)}</span>
                  </div>
                  {issue.returnDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium" style={{padding:"10px"}}>Returned Date</span>
                      <span className="font-semibold text-emerald-700">{formatDate(issue.returnDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-slate-200/60 pt-2.5">
                    <span className="text-slate-500 font-medium" style={{padding:"10px"}}>Fine Accrued</span>
                    <span className={`font-bold ${issue.fine && issue.fine > 0 ? "text-red-600" : "text-slate-800"}`}>
                      Rs. {issue.fine || 0}
                    </span>
                  </div>
                </div>
              </div>

              {issue.status !== "returned" ? (
                <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-center text-xs font-semibold text-amber-800">
                  Please return this book through the library desk.
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={15} />
                  <span style={{padding:"10px"}}>Successfully Returned</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
