import { NextResponse } from "next/server";

import Issue from "@/models/Issue";
import Book from "@/models/Book";
import { requireMember, serializeMember } from "@/lib/member-session";
import { syncOverdueIssues } from "@/lib/sync-overdue";

export async function GET() {
  try {
    const auth = await requireMember();

    if ("error" in auth) {
      return auth.error;
    }

    const { user, member } = auth;

    const issues = await Issue.find({
      member: member._id,
    })
      .populate("book")
      .sort({ createdAt: -1 });

    await syncOverdueIssues(issues);

    const issuedBooks = issues.filter(
      (issue: { status: string }) => issue.status === "issued"
    );
    const overdueBooks = issues.filter(
      (issue: { status: string }) => issue.status === "overdue"
    );
    const returnedBooks = issues.filter(
      (issue: { status: string }) => issue.status === "returned"
    );

    const totalFine = issues.reduce(
      (total: number, issue: { fine?: number }) =>
        total + Number(issue.fine || 0),
      0
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const dueSoonLimit = new Date(startOfToday);
    dueSoonLimit.setDate(dueSoonLimit.getDate() + 3);

    const dueSoon = issuedBooks.filter((issue: { dueDate?: Date }) => {
      if (!issue.dueDate) return false;
      const due = new Date(issue.dueDate);
      due.setHours(0, 0, 0, 0);
      return due >= startOfToday && due <= dueSoonLimit;
    });

    const availableBooks = await Book.find({
      available: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(8);

    const serializedMember = serializeMember(member, user);

    return NextResponse.json({
      success: true,
      member: serializedMember,
      isProfileComplete: serializedMember.isProfileComplete,
      stats: {
        issuedBooks: issuedBooks.length,
        pendingReturns: issuedBooks.length + overdueBooks.length,
        dueSoon: dueSoon.length,
        returnedBooks: returnedBooks.length,
        overdueBooks: overdueBooks.length,
        totalFine,
        totalBorrowed: issues.length,
      },
      issuedBooks,
      returnedBooks,
      overdueBooks,
      recentlyBorrowed: issues.slice(0, 6),
      books: availableBooks,
      history: issues,
    });
  } catch (error) {
    console.error("MEMBER DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load member dashboard",
      },
      { status: 500 }
    );
  }
}
