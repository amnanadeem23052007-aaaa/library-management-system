"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  History,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

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
  description?: string;
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
  discount?: number;
};

type Member = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

type Stats = {
  issuedBooks: number;
  pendingReturns: number;
  returnedBooks: number;
  overdueBooks: number;
  totalFine: number;
  totalBorrowed: number;
};

type DashboardData = {
  success: boolean;
  member: Member;
  stats: Stats;
  issuedBooks: Issue[];
  returnedBooks: Issue[];
  overdueBooks: Issue[];
  books: Book[];
  allBooks: Book[];
  history: Issue[];
};

type Section =
  | "dashboard"
  | "books"
  | "history"
  | "browse"
  | "profile";

export default function MemberDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] =
    useState<Section>("dashboard");

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] =
    useState<Book | null>(null);

  async function fetchDashboard(showLoader = true) {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(
        "/api/member/dashboard",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load member dashboard"
        );
      }

      setData(result);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Something went wrong while loading dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!data) return [];

    const query = search.toLowerCase().trim();

    if (!query) {
      return data.allBooks;
    }

    return data.allBooks.filter((book) => {
      return (
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.category?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query)
      );
    });
  }, [data, search]);

  function navigate(section: Section) {
    setActiveSection(section);
    setSelectedBook(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-125px)] items-center justify-center" >
        <div className="text-center">
          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <h2 className="text-base font-bold text-slate-800">
            Loading your dashboard
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[calc(100vh-125px)] items-center justify-center px-4" >
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            Dashboard couldn't load
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "Member dashboard data is unavailable."}
          </p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {activeSection === "dashboard" && (
        <DashboardHome
          data={data}
          onNavigate={navigate}
          onBookClick={setSelectedBook}
        />
      )}

      {activeSection === "books" && (
        <MyBooksSection
          issues={data.issuedBooks}
          onBookClick={setSelectedBook}
          onBack={() => navigate("dashboard")}
        />
      )}

      {activeSection === "history" && (
        <HistorySection
          history={data.history}
          onBack={() => navigate("dashboard")}
        />
      )}

      {activeSection === "browse" && (
        <BrowseSection
          books={filteredBooks}
          search={search}
          setSearch={setSearch}
          onBookClick={setSelectedBook}
          onBack={() => navigate("dashboard")}
        />
      )}

      {activeSection === "profile" && (
        <ProfileSection
          member={data.member}
          onBack={() => navigate("dashboard")}
        />
      )}

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardHome({
  data,
  onNavigate,
  onBookClick,
}: {
  data: DashboardData;
  onNavigate: (section: Section) => void;
  onBookClick: (book: Book) => void;
}) {
  const { member, stats, issuedBooks, history } = data;

  const recentActivity = history.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1500px] space-y-4"   >
      {/* Welcome */}
      <section className="relative min-h-[146px] overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#eef4ff]
       via-[#f1f5ff] to-[#eaf1ff] px-6 py-6 sm:px-7"   >
        <div className="relative z-10 max-w-[570px] "   >
          <p className="text-[10px] font-medium text-slate-500"   >
            Welcome back,
          </p>

          <h1 className="mt-1 text-[25px] font-extrabold tracking-tight text-[#101936] sm:text-[27px]">
            {member.name}{" "}
            <span className="inline-block text-[24px]">
              👋
            </span>
          </h1>

          <p className="mt-2 max-w-[500px] text-[11px] leading-5 text-slate-500 sm:text-xs">
            Manage your issued books, track your history
            and discover new books.
          </p>
        </div>

        {/* Decorative books */}
        <div className="absolute right-7 top-5 hidden h-[115px] w-[220px] lg:block">
          <div className="absolute right-5 top-4 h-9 w-[125px] rotate-[-7deg] rounded-md border-b-4 border-blue-700 bg-gradient-to-r from-blue-600 to-blue-500 shadow-md" />

          <div className="absolute right-1 top-9 h-8 w-[145px] rotate-[-4deg] rounded-md border-b-4 border-orange-500 bg-white shadow-md">
            <div className="h-1.5 bg-orange-400" />
          </div>

          <div className="absolute right-7 top-[68px] h-8 w-[138px] rotate-[3deg] rounded-md border-b-4 border-blue-700 bg-white shadow-md">
            <div className="h-1.5 bg-blue-600" />
          </div>

          {/* Plant */}
          <div className="absolute bottom-0 right-[-1px]">
            <div className="absolute bottom-9 left-3 h-10 w-4 rotate-[-25deg] rounded-full bg-green-500" />
            <div className="absolute bottom-9 left-8 h-11 w-4 rotate-[25deg] rounded-full bg-green-500" />
            <div className="absolute bottom-10 left-5 h-12 w-4 rounded-full bg-green-600" />
            <div className="h-10 w-12 rounded-b-[18px] rounded-t-md bg-white shadow-sm" />
          </div>
        </div>

        <div className="absolute right-[205px] top-5 text-blue-200">
          <Sparkles className="h-4 w-4" />
        </div>

        <div className="absolute right-[275px] bottom-12 text-blue-200">
          <Sparkles className="h-3 w-3" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Issued Books"
          value={stats.issuedBooks}
          subtitle="Currently issued"
          icon={<BookOpen />}
          iconClass="bg-blue-50 text-blue-600"
          onClick={() => onNavigate("books")}
        />

        <StatCard
          title="Due Soon"
          value={stats.pendingReturns}
          subtitle="Book due soon"
          icon={<CalendarDays />}
          iconClass="bg-emerald-50 text-emerald-600"
          onClick={() => onNavigate("books")}
        />

        <StatCard
          title="Overdue"
          value={stats.overdueBooks}
          subtitle={
            stats.overdueBooks > 0
              ? "Needs attention"
              : "No overdue books"
          }
          icon={<Clock3 />}
          iconClass="bg-orange-50 text-orange-500"
          danger={stats.overdueBooks > 0}
          onClick={() => onNavigate("books")}
        />

        <StatCard
          title="Total Read"
          value={stats.returnedBooks}
          subtitle="Books completed"
          icon={<CheckCircle2 />}
          iconClass="bg-violet-50 text-violet-600"
          onClick={() => onNavigate("history")}
        />

        <StatCard
          title="Total Fine"
          value={`Rs. ${stats.totalFine}`}
          subtitle="Outstanding fine"
          icon={<WalletCards />}
          iconClass="bg-rose-50 text-rose-500"
          danger={stats.totalFine > 0}
          onClick={() => onNavigate("history")}
        />
      </section>

      {/* Main bottom area */}
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.25fr_1fr]">
        {/* Issued books */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
            <h2 className="text-[13px] font-extrabold text-slate-900">
              Currently Issued Books
            </h2>

            <button
              onClick={() => onNavigate("books")}
              className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {issuedBooks.length === 0 ? (
            <EmptyState
              icon={<BookOpen />}
              title="No books borrowed"
              description="You currently don't have any issued books."
              actionText="Browse Books"
              onAction={() => onNavigate("browse")}
            />
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {issuedBooks.slice(0, 3).map((issue) => (
                  <IssueRow
                    key={issue._id}
                    issue={issue}
                    onClick={() => {
                      if (issue.book) {
                        onBookClick(issue.book);
                      }
                    }}
                  />
                ))}
              </div>

              <div className="px-4 pb-4 pt-2">
                <button
                  onClick={() => onNavigate("books")}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#2444e8] text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  View All Issued Books
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
            <h2 className="text-[13px] font-extrabold text-slate-900">
              Recent Activity
            </h2>

            <button
              onClick={() => onNavigate("history")}
              className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <EmptyState
              icon={<History />}
              title="No recent activity"
              description="Your recent borrowing activity will appear here."
            />
          ) : (
            <div className="px-4 py-2">
              {recentActivity.map((issue, index) => (
                <ActivityItem
                  key={issue._id}
                  issue={issue}
                  isLast={index === recentActivity.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  danger,
  onClick,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        min-h-[94px]
        rounded-xl
        border
        bg-white
        p-3.5
        text-left
        shadow-[0_2px_9px_rgba(15,23,42,0.035)]
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${
          danger
            ? "border-red-100"
            : "border-slate-200"
        }
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[9px] font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-1 text-[20px] font-extrabold leading-none ${
              danger
                ? "text-red-600"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>

          <p
            className={`mt-1.5 truncate text-[8px] ${
              danger
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {cloneIcon(icon)}
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   ISSUE ROW
========================================================= */

function IssueRow({
  issue,
  onClick,
}: {
  issue: Issue;
  onClick: () => void;
}) {
  const overdue =
    issue.status === "overdue" ||
    new Date(issue.dueDate) < new Date();

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
    >
      <BookCover book={issue.book} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold text-slate-800">
          {issue.book?.title || "Unknown Book"}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-slate-400">
          {issue.book?.author || "Unknown Author"}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 text-slate-400" />

          <span className="text-[8px] text-slate-500">
            Issued: {formatDate(issue.issueDate)}
          </span>
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-[8px] text-slate-400">
          Due
        </p>

        <p
          className={`mt-0.5 text-[9px] font-bold ${
            overdue
              ? "text-red-500"
              : "text-emerald-500"
          }`}
        >
          {formatDate(issue.dueDate)}
        </p>
      </div>

      <StatusBadge
        status={overdue ? "overdue" : issue.status}
      />

      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-blue-500" />
    </button>
  );
}

/* =========================================================
   RECENT ACTIVITY
========================================================= */

function ActivityItem({
  issue,
  isLast,
}: {
  issue: Issue;
  isLast: boolean;
}) {
  const returned = issue.status === "returned";
  const overdue =
    issue.status === "overdue" ||
    (!returned &&
      new Date(issue.dueDate) < new Date());

  let title = "Issued";
  let icon = <BookOpen className="h-3.5 w-3.5" />;
  let color =
    "bg-emerald-500 text-white";

  if (returned) {
    title = "Returned";
    icon = <CheckCircle2 className="h-3.5 w-3.5" />;
    color = "bg-violet-500 text-white";
  } else if (overdue) {
    title = "Overdue";
    icon = <AlertCircle className="h-3.5 w-3.5" />;
    color = "bg-red-500 text-white";
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}
        >
          {icon}
        </div>

        {!isLast && (
          <div className="my-1 h-8 w-px bg-slate-100" />
        )}
      </div>

      <div className="min-w-0 flex-1 pb-3">
        <p className="text-[10px] font-semibold text-slate-700">
          {title} “{issue.book?.title || "Book"}”
        </p>

        <p className="mt-0.5 text-[8px] text-slate-400">
          {formatDate(issue.returnDate || issue.issueDate)}
          {" • "}
          {formatTime(
            issue.returnDate || issue.issueDate
          )}
        </p>

        {issue.fine && issue.fine > 0 ? (
          <p className="mt-0.5 text-[8px] font-semibold text-red-500">
            Fine: Rs. {issue.fine}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
      icon: React.ReactNode;
    }
  > = {
    issued: {
      label: "Issued",
      className:
        "bg-blue-50 text-blue-600",
      icon: <BookOpen className="h-2.5 w-2.5" />,
    },
    returned: {
      label: "Returned",
      className:
        "bg-emerald-50 text-emerald-600",
      icon: <CheckCircle2 className="h-2.5 w-2.5" />,
    },
    overdue: {
      label: "Overdue",
      className:
        "bg-red-50 text-red-600",
      icon: <AlertCircle className="h-2.5 w-2.5" />,
    },
  };

  const item =
    config[status] || config.issued;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold ${item.className}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

/* =========================================================
   BOOK COVER
========================================================= */

function BookCover({
  book,
}: {
  book: Book | null;
}) {
  if (!book) {
    return (
      <div className="flex h-[58px] w-[42px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-300">
        <BookOpen className="h-5 w-5" />
      </div>
    );
  }

  if (book.coverImage) {
    return (
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-[58px] w-[42px] shrink-0 rounded-md object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-[58px] w-[42px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-300">
      <BookOpen className="h-5 w-5" />
    </div>
  );
}

/* =========================================================
   MY BOOKS
========================================================= */

function MyBooksSection({
  issues,
  onBookClick,
  onBack,
}: {
  issues: Issue[];
  onBookClick: (book: Book) => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeading
        title="My Books"
        description="Books currently issued to your account"
        onBack={onBack}
      />

      {issues.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={<BookMarked />}
            title="No borrowed books"
            description="You don't have any books currently issued."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => (
            <BorrowedBookCard
              key={issue._id}
              issue={issue}
              onClick={() => {
                if (issue.book) {
                  onBookClick(issue.book);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BorrowedBookCard({
  issue,
  onClick,
}: {
  issue: Issue;
  onClick: () => void;
}) {
  const book = issue.book;

  if (!book) return null;

  const overdue =
    issue.status === "overdue" ||
    new Date(issue.dueDate) < new Date();

  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex gap-4 p-5">
        <BookCover book={book} />

        <div className="min-w-0 flex-1">
          <StatusBadge
            status={overdue ? "overdue" : "issued"}
          />

          <h3 className="mt-3 line-clamp-2 text-sm font-bold text-slate-900">
            {book.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {book.author}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-slate-100">
        <div className="p-4">
          <p className="text-xs text-slate-400">
            Due date
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              overdue
                ? "text-red-600"
                : "text-slate-700"
            }`}
          >
            {formatDate(issue.dueDate)}
          </p>
        </div>

        <div className="border-l border-slate-100 p-4">
          <p className="text-xs text-slate-400">
            Fine
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700">
            Rs. {issue.fine || 0}
          </p>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   HISTORY
========================================================= */

function HistorySection({
  history,
  onBack,
}: {
  history: Issue[];
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeading
        title="Borrowing History"
        description="Complete history of your borrowed books"
        onBack={onBack}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {history.length === 0 ? (
          <EmptyState
            icon={<History />}
            title="No borrowing history"
            description="Your borrowing history will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Book
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Return Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Fine
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {history.map((issue) => (
                  <tr
                    key={issue._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <BookCover book={issue.book} />

                        <div>
                          <p className="max-w-[250px] truncate text-sm font-bold text-slate-800">
                            {issue.book?.title ||
                              "Unknown Book"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {issue.book?.author || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(issue.issueDate)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(issue.dueDate)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {issue.returnDate
                        ? formatDate(issue.returnDate)
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={issue.status}
                      />
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                      Rs. {issue.fine || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   BROWSE
========================================================= */

function BrowseSection({
  books,
  search,
  setSearch,
  onBookClick,
  onBack,
}: {
  books: Book[];
  search: string;
  setSearch: (value: string) => void;
  onBookClick: (book: Book) => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeading
        title="Browse Books"
        description="Explore books available in the library"
        onBack={onBack}
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by title, author, category or ISBN..."
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        />
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={<Search />}
            title="No books found"
            description="Try another search term."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => onBookClick(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-20 w-20 text-blue-200" />
          </div>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-emerald-600 shadow-sm backdrop-blur">
          {book.available > 0
            ? `${book.available} Available`
            : "Unavailable"}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold text-blue-600">
          {book.category}
        </p>

        <h3 className="mt-1 line-clamp-2 font-bold text-slate-900">
          {book.title}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          by {book.author}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="max-w-[150px] truncate text-xs text-slate-400">
            ISBN: {book.isbn}
          </span>

          <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileSection({
  member,
  onBack,
}: {
  member: Member;
  onBack?: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      {onBack && (
        <PageHeading
          title="My Profile"
          description="Your member account information"
          onBack={onBack}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#1938d8] to-[#334de8] px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-bold text-blue-600 shadow-xl">
              {member.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {member.name}
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                {member.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {member.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
          <ProfileItem
            icon={<Mail />}
            label="Email"
            value={member.email}
          />

          <ProfileItem
            icon={<Phone />}
            label="Phone"
            value={member.phone || "Not provided"}
          />

          <ProfileItem
            icon={<MapPin />}
            label="Address"
            value={member.address || "Not provided"}
          />

          <ProfileItem
            icon={<UserRound />}
            label="Account Type"
            value="Library Member"
          />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {cloneIcon(icon)}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-700">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BOOK DETAILS MODAL
========================================================= */

function BookDetailsModal({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative">
          <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-100">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="h-28 w-28 text-blue-200" />
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
            {book.category}
          </span>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {book.title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            by {book.author}
          </p>

          {book.description && (
            <p className="mt-5 text-sm leading-7 text-slate-500">
              {book.description}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoBox
              label="ISBN"
              value={book.isbn}
            />

            <InfoBox
              label="Quantity"
              value={String(book.quantity)}
            />

            <InfoBox
              label="Available"
              value={String(book.available)}
            />

            <InfoBox
              label="Rating"
              value={`${book.rating || 0}/5`}
            />
          </div>

          <button
            onClick={onClose}
            className="mt-7 flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PAGE HEADING
========================================================= */

function PageHeading({
  title,
  description,
  onBack,
}: {
  title: string;
  description: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
        </div>

        <p className="mt-2 pl-12 text-sm text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
        {cloneIcon(icon)}
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date?: string | null) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date?: string | null) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function cloneIcon(icon: React.ReactNode) {
  if (
    icon &&
    typeof icon === "object" &&
    "type" in icon
  ) {
    const element =
      icon as React.ReactElement<any>;

    return {
      ...element,
      props: {
        ...element.props,
        className: `${
          element.props.className || ""
        } h-5 w-5`,
      },
    };
  }

  return icon;
}