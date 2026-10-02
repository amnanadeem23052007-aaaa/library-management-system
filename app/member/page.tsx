"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
  RefreshCw,
  WalletCards,
  ArrowRight,
} from "lucide-react";

import Loader from "@/components/common/Loader";
import { useMemberRefresh } from "@/components/member/MemberRefreshContext";

type Book = {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
};

type Issue = {
  _id: string;
  book: Book | null;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: "issued" | "returned" | "overdue";
  fine?: number;
};

type DashboardData = {
  member: {
    name: string;
  };
  stats: {
    issuedBooks: number;
    dueSoon?: number;
    pendingReturns: number;
    overdueBooks: number;
    returnedBooks: number;
    totalFine: number;
  };
  issuedBooks: Issue[];
  history: Issue[];
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

function formatTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MemberDashboardPage() {
  const { refreshKey } = useMemberRefresh();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/member/dashboard", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load dashboard");
      }
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 sm:p-20 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Dashboard couldn&apos;t load
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const dueSoon = data.stats.dueSoon ?? data.stats.pendingReturns;
  const recentActivity = buildActivity(data.history).slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"  style={{padding:"10px"}}>
          Member Dashboard
        </h1>
        <p className="mt-1.5 text-base text-slate-500"  style={{padding:"10px"}}>
          Welcome back, {data.member.name} 👋 Here is an overview of your active loans and library activity.
        </p>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"  style={{padding:"10px"}}>
        <StatCard
          title="Issued Books"
          value={data.stats.issuedBooks}
          subtitle={`${data.stats.issuedBooks} active loans`}
          href="/member/books"
          icon={<BookOpen size={28} />}
          color="from-blue-500 to-blue-700 "  
        />
        <StatCard 
          title="Due Soon"
          value={dueSoon}
          subtitle={dueSoon > 0 ? `${dueSoon} books due within 3 days` : "No books due soon"}
          href="/member/books"
          icon={<CalendarDays size={28} />}
          color="from-amber-500 to-orange-600" 
        / >
        <StatCard
          title="Overdue Books"
          value={data.stats.overdueBooks}
          subtitle={data.stats.overdueBooks > 0 ? "Requires attention" : "No overdue books"}
          href="/member/books"
          icon={<Clock3 size={28} />}
          color="from-rose-500 to-red-600"
          danger={data.stats.overdueBooks > 0}
        />
        <StatCard
          title="Total Read"
          value={data.stats.returnedBooks}
          subtitle={`${data.stats.returnedBooks} completed`}
          href="/member/history"
          icon={<CheckCircle2 size={28} />}
          color="from-emerald-500 to-green-600"
        />
        <StatCard
          title="Total Fines"
          value={`Rs. ${data.stats.totalFine}`}
          subtitle={data.stats.totalFine > 0 ? "Pending payment" : "All fines cleared"}
          href="/member/history"
          icon={<WalletCards size={28} />}
          color="from-violet-500 to-purple-700"
          danger={data.stats.totalFine > 0}
        />
      </section>

      {/* Currently Issued Books Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-9 transition-colors duration-200"  style={{padding:"10px"}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"  style={{padding:"10px"}}>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900"  style={{padding:"10px"}}>
              Currently Issued Books
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Books currently checked out to your member account
            </p>
          </div>

          <Link
            href="/member/books"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:underline transition self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {data.issuedBooks.length === 0 ? (
          <EmptyState
            title="No books currently issued"
            description="You currently don't have any issued books. Browse our catalog to find your next read."
            href="/member/browse"
            action="Browse Books"  
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100" style={{padding:"20px"}}>
            <table className="w-full text-left min-w-[640px]" >
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4.5" >Book</th>
                  <th className="px-6 py-4.5">Author</th>
                  <th className="px-6 py-4.5 text-center">Issue Date</th>
                  <th className="px-6 py-4.5 text-center">Due Date</th>
                  <th className="px-6 py-4.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.issuedBooks.map((issue) => (
                  <tr
                    key={issue._id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="px-6 py-4.5 sm:py-5 font-semibold text-slate-800 text-sm">
                      <div className="flex items-center gap-3.5" style={{padding:"10px"}}>
                        <BookCover book={issue.book} />
                        <span className="font-semibold text-slate-800 text-sm">
                          {issue.book?.title || "Unknown Book"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 sm:py-5 text-slate-600 text-sm">
                      {issue.book?.author || "Unknown Author"}
                    </td>
                    <td className="px-6 py-4.5 sm:py-5 text-center text-slate-600 text-sm">
                      {formatDate(issue.issueDate)}
                    </td>
                    <td className="px-6 py-4.5 sm:py-5 text-center text-slate-600 text-sm">
                      {formatDate(issue.dueDate)}
                    </td>
                    <td className="px-6 py-4.5 sm:py-5 text-center">
                      <StatusBadge status={issue.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-9 transition-colors duration-200"  style={{margin:"10px",padding:"10px"}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Timeline of your library transactions
            </p>
          </div>
          <Link
            href="/member/history"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex
             items-center gap-1 hover:underline transition self-start sm:self-auto"
            
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <EmptyState
            title="No borrowing history yet."
            description="Your recent borrowing and return activity will appear here." 
          />
        ) : (
          <div className="space-y-3 sm:space-y-4"  style={{padding:"20px"}}>
            {recentActivity.map((item) => (
              <ActivityItem  
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  href,
  icon,
  color,
  danger,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className="
        group
        block
        bg-white
        rounded-3xl
        p-6 sm:p-7
        shadow-sm
        hover:shadow-xl
        border
        border-slate-200
        transition-all
        duration-300
        hover:-translate-y-1
        cursor-pointer
      "
    >
      <div className="flex justify-between items-start" style={{padding:"10px"}} >
        <div>
          <p className="text-slate-500 text-[15px] font-medium">{title}</p>
          <h2
            className={`text-4xl font-bold mt-3 ${
              danger ? "text-red-600" : "text-slate-900"
            }`}
          >
            {value}
          </h2>
          <p
            className={`mt-4 text-sm font-semibold ${
              danger ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`
            w-16
            h-16
            rounded-2xl
            bg-gradient-to-r
            ${color}
            text-white
            flex
            items-center
            justify-center
            shadow-lg
            group-hover:scale-105
            transition-transform
            duration-300
            shrink-0
          `}
        >
          {icon}
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    issued: "bg-blue-50 text-blue-700 border-blue-200/50",
    overdue: "bg-red-50 text-red-700 border-red-200/50",
    returned: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
        styles[status] || "bg-slate-100 text-slate-600 border-slate-200" 
      }`} style={{padding:"10px"}}
    >
      {status}
    </span>
  );
}

type Activity = {
  id: string;
  title: string;
  book?: string;
  date?: string | null;
  fine?: number;
  kind: "issued" | "returned" | "overdue" | "fine";
};

function buildActivity(history: Issue[]): Activity[] {
  const items: Activity[] = [];

  for (const issue of history) {
    const book = issue.book?.title || "Book";

    if (issue.status === "returned") {
      items.push({
        id: `${issue._id}-returned`,
        title: "Returned book",
        book,
        date: issue.returnDate || issue.issueDate,
        kind: "returned",
      });
      if (Number(issue.fine || 0) > 0) {
        items.push({
          id: `${issue._id}-fine`,
          title: "Fine recorded",
          book,
          date: issue.returnDate || issue.issueDate,
          fine: issue.fine,
          kind: "fine",
        });
      }
    } else if (issue.status === "overdue") {
      items.push({
        id: `${issue._id}-overdue`,
        title: "Overdue book",
        book,
        date: issue.dueDate,
        fine: issue.fine,
        kind: "overdue",
      });
    } else {
      items.push({
        id: `${issue._id}-issued`,
        title: "Issued book",
        book,
        date: issue.issueDate,
        kind: "issued",
      });
    }
  }

  return items;
}

function ActivityItem({
  item,
}: {
  item: Activity;
}) {
  const styles = {
    issued: "bg-blue-600 text-white shadow-blue-500/20",
    overdue: "bg-orange-500 text-white shadow-orange-500/20",
    returned: "bg-emerald-600 text-white shadow-emerald-500/20",
    fine: "bg-red-500 text-white shadow-red-500/20",
  };

  return (
    <div className="flex items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition" style={{padding:"20px"}}>
      <div
        className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl shadow-md ${styles[item.kind]}`}
      >
        {item.kind === "returned" ? (
          <CheckCircle2 size={20} />
        ) : item.kind === "fine" ? (
          <AlertCircle size={20} />
        ) : (
          <BookOpen size={20} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <p className="text-sm font-bold text-slate-900">
            {item.title}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            {formatDate(item.date)}
            {item.date ? ` • ${formatTime(item.date)}` : ""}
          </p>
        </div>

        {item.book && (
          <p className="mt-1 text-sm text-slate-600 font-medium truncate">
            {item.book}
          </p>
        )}

        {item.fine && item.fine > 0 ? (
          <p className="mt-1 text-xs sm:text-sm font-semibold text-red-600">
            Fine: Rs. {item.fine}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function BookCover({ book }: { book: Book | null }) {
  if (book?.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-12 w-9 shrink-0 rounded-lg object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
      <BookOpen size={18} />
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <History size={24} />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
        {description}
      </p>
      {href && action ? (
        <Link
          href={href}
          className="mt-5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}
