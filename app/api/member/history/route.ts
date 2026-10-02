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

    const history = await Issue.find({
      member: auth.member._id,
    })
      .populate("book")
      .sort({ createdAt: -1 });

    await syncOverdueIssues(history);

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("MEMBER HISTORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load borrowing history",
      },
      { status: 500 }
    );
  }
}
