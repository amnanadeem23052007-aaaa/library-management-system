import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Issue from "@/models/Issue";
import Book from "@/models/Book";

// =======================
// RETURN BOOK
// =======================

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const issue = await Issue.findById(id);

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

    issue.status = "returned";
    issue.returnDate = new Date();

    await issue.save();

    const book = await Book.findById(issue.book);

    if (book) {
      book.available += 1;
      await book.save();
    }

    return NextResponse.json({
      success: true,
      issue,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

// =======================
// EDIT ISSUE
// =======================

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const { bookId, memberId } = await req.json();

    const issue = await Issue.findById(id);

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

    issue.book = bookId;
    issue.member = memberId;

    await issue.save();

    const updatedIssue = await Issue.findById(id)
      .populate("book")
      .populate("member");

    return NextResponse.json({
      success: true,
      message: "Issue Updated Successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

// =======================
// DELETE ISSUE
// =======================

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    const issue = await Issue.findById(id);

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

    // Agar issue abhi return nahi hui to stock wapas kar do
    if (issue.status !== "returned") {
      const book = await Book.findById(issue.book);

      if (book) {
        book.available += 1;
        await book.save();
      }
    }

    await Issue.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Issue Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}