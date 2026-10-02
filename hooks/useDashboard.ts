"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  totalBooks: number;
  totalMembers: number;
  issuedBooks: number;
  returnedBooks: number;

  booksGrowth: string;
  membersGrowth: string;
  issuedGrowth: string;
  returnedGrowth: string;
};

function getArray(data: any, keys: string[]) {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
}

function getMonthGrowth(
  items: any[],
  dateKeys: string[]
): string {
  if (!items.length) {
    return "0%";
  }

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let currentCount = 0;
  let previousCount = 0;

  items.forEach((item) => {
    let dateValue = null;

    for (const key of dateKeys) {
      if (item?.[key]) {
        dateValue = item[key];
        break;
      }
    }

    if (!dateValue) return;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return;

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      currentCount++;
    }

    const previousMonth = new Date(
      currentYear,
      currentMonth - 1,
      1
    );

    if (
      date.getMonth() === previousMonth.getMonth() &&
      date.getFullYear() === previousMonth.getFullYear()
    ) {
      previousCount++;
    }
  });

  if (previousCount === 0) {
    if (currentCount === 0) {
      return "0%";
    }

    return "+100%";
  }

  const growth =
    ((currentCount - previousCount) / previousCount) * 100;

  const rounded = Math.round(growth);

  return rounded >= 0
    ? `+${rounded}%`
    : `${rounded}%`;
}

export default function useDashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData>({
      totalBooks: 0,
      totalMembers: 0,
      issuedBooks: 0,
      returnedBooks: 0,

      booksGrowth: "0%",
      membersGrowth: "0%",
      issuedGrowth: "0%",
      returnedGrowth: "0%",
    });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        booksRes,
        membersRes,
        issuesRes,
        returnsRes,
      ] = await Promise.all([
        fetch("/api/books", {
          cache: "no-store",
        }),

        fetch("/api/members", {
          cache: "no-store",
        }),

        fetch("/api/issue-books", {
          cache: "no-store",
        }),

        fetch("/api/return-books", {
          cache: "no-store",
        }),
      ]);

      const [
        booksData,
        membersData,
        issuesData,
        returnsData,
      ] = await Promise.all([
        booksRes.json(),
        membersRes.json(),
        issuesRes.json(),
        returnsRes.json(),
      ]);

      /*
       * BOOKS
       */
      const books = getArray(booksData, [
        "books",
        "data",
      ]);

      /*
       * MEMBERS
       */
      const members = getArray(membersData, [
        "members",
        "data",
      ]);

      /*
       * ISSUED BOOKS
       *
       * Different APIs can return:
       * issues
       * issueBooks
       * issuedBooks
       */
      const issuedBooks = getArray(issuesData, [
        "issues",
        "issueBooks",
        "issuedBooks",
        "data",
      ]);

      /*
       * RETURNED BOOKS
       */
      const returnedBooks = getArray(returnsData, [
        "returnedBooks",
        "returns",
        "returnBooks",
        "data",
      ]);

      setDashboard({
        totalBooks: books.length,

        totalMembers: members.length,

        issuedBooks: issuedBooks.length,

        returnedBooks: returnedBooks.length,

        booksGrowth: getMonthGrowth(
          books,
          ["createdAt", "created_at"]
        ),

        membersGrowth: getMonthGrowth(
          members,
          ["createdAt", "created_at"]
        ),

        issuedGrowth: getMonthGrowth(
          issuedBooks,
          [
            "issueDate",
            "issuedAt",
            "createdAt",
            "created_at",
          ]
        ),

        returnedGrowth: getMonthGrowth(
          returnedBooks,
          [
            "returnDate",
            "returnedAt",
            "createdAt",
            "created_at",
          ]
        ),
      });
    } catch (error) {
      console.log("Dashboard Error:", error);

      setError(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
  };
}