import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Issue from "@/models/Issue";
import Book from "@/models/Book";

// ==============================
// GET RETURN RECORDS
// ==============================

export async function GET() {
  try {
    await connectDB();

    const returnedBooks =
      await Issue.find({
        status: "returned",
      })
        .populate("book")
        .populate("member")
        .sort({
          updatedAt: -1,
        });

    const issuedBooks =
      await Issue.find({
        status: {
          $in: [
            "issued",
            "overdue",
          ],
        },
      })
        .populate("book")
        .populate("member")
        .sort({
          createdAt: -1,
        });

    return NextResponse.json({
      success: true,

      returnedBooks,

      issuedBooks,
    });
  } catch (error) {
    console.error(
      "GET RETURNS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch return records",
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// RETURN BOOK
// ==============================

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      issueId,
      fine = 0,
    } = body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!issueId) {
      return NextResponse.json(
        {
          success: false,
          message: "Issue ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // ==============================
    // FIND ISSUE
    // ==============================

    const issue =
      await Issue.findById(
        issueId
      );

    if (!issue) {
      return NextResponse.json(
        {
          success: false,
          message: "Issue not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==============================
    // ALREADY RETURNED
    // ==============================

    if (
      issue.status === "returned"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Book has already been returned",
        },
        {
          status: 400,
        }
      );
    }

    // ==============================
    // FIND BOOK
    // ==============================

    const book =
      await Book.findById(
        issue.book
      );

    // ==============================
    // UPDATE ISSUE
    // ==============================

    issue.status = "returned";

    issue.returnDate = new Date();

    issue.fine = Math.max(
      0,
      Number(fine) || 0
    );

    await issue.save();

    // ==============================
    // RESTORE STOCK
    // ==============================

    if (book) {
      book.available = Math.min(
        book.quantity,
        book.available + 1
      );

      await book.save();
    }

    // ==============================
    // POPULATE
    // ==============================

    const updatedIssue =
      await Issue.findById(
        issue._id
      )
        .populate("book")
        .populate("member");

    return NextResponse.json({
      success: true,

      message:
        "Book returned successfully",

      issue: updatedIssue,
    });
  } catch (error) {
    console.error(
      "RETURN BOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to return book",
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// DELETE RETURN RECORD
// ==============================

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { issueId } = body;

    if (!issueId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Issue ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const issue =
      await Issue.findById(
        issueId
      );

    if (!issue) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Return record not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      issue.status !== "returned"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only returned records can be deleted",
        },
        {
          status: 400,
        }
      );
    }

    await Issue.findByIdAndDelete(
      issueId
    );

    return NextResponse.json({
      success: true,

      message:
        "Return record deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE RETURN ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete return record",
      },
      {
        status: 500,
      }
    );
  }
}