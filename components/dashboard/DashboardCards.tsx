"use client";

import {
  BookOpen,
  Users,
  BookMarked,
  RotateCcw,
} from "lucide-react";

import StatCard from "./StatCard";

import Loader from "@/components/common/Loader";

import useDashboard from "@/hooks/useDashboard";

export default function DashboardCards() {
  const {
    dashboard,
    loading,
    error,
  } = useDashboard();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7" style={{padding:"10px"}}>
        <div className="col-span-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50 rounded-3xl p-6" >
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6" >

      {/* TOTAL BOOKS */}

      <StatCard
        title="Total Books"
        value={dashboard.totalBooks}
        growth={dashboard.booksGrowth}
        icon={BookOpen}
        color="from-blue-500 to-blue-700"
        href="/dashboard/books"
      />

      {/* MEMBERS */}

      <StatCard
        title="Members"
        value={dashboard.totalMembers}
        growth={dashboard.membersGrowth}
        icon={Users}
        color="from-emerald-500 to-green-600"
        href="/dashboard/members"
      />

      {/* ISSUED BOOKS */}

      <StatCard
        title="Issued Books"
        value={dashboard.issuedBooks}
        growth={dashboard.issuedGrowth}
        icon={BookMarked}
        color="from-orange-500 to-orange-600"
        href="/dashboard/issue-books"
      />

      {/* RETURNED BOOKS */}

      <StatCard
        title="Returned Books"
        value={dashboard.returnedBooks}
        growth={dashboard.returnedGrowth}
        icon={RotateCcw}
        color="from-violet-500 to-purple-700"
        href="/dashboard/return-books"
      />

    </section>
  );
}