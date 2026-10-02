import { NextResponse } from "next/server";

import Issue from "@/models/Issue";
import { requireCompleteMember } from "@/lib/member-session";
import { syncOverdueIssues } from "@/lib/sync-overdue";

export async function GET() {
  try {
    const auth = await requireCompleteMember();

    if ("error" in auth) {
      return auth.error;
    }

    const issues = await Issue.find({
      member: auth.member._id,
    })
      .populate("book")
      .sort({ createdAt: -1 });

    await syncOverdueIssues(issues);

    return NextResponse.json({
      success: true,
      issued: issues.filter(
        (issue: { status: string }) => issue.status === "issued"
      ),
      overdue: issues.filter(
        (issue: { status: string }) => issue.status === "overdue"
      ),
      returned: issues.filter(
        (issue: { status: string }) => issue.status === "returned"
      ),
      books: issues,
    });
  } catch (error) {
    console.error("MEMBER BOOKS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load your books",
      },
      { status: 500 }
    );
  }
}
