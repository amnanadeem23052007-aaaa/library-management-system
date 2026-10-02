import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

import Issue from "@/models/Issue";
import Book from "@/models/Book";
import Member from "@/models/Member";
import User from "@/models/User";

// ==============================
// GET ALL ISSUES
// ==============================

export async function GET() {
  try {
    await connectDB();

    const issues = await Issue.find()
      .populate("book")
      .populate("member")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error(
      "GET ISSUES ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch issued books",
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// ISSUE BOOK
// ==============================

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();

    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        {
          success: false,
          message: "Book ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (user.role !== "member") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only members are allowed to borrow books. Librarians cannot borrow books.",
        },
        {
          status: 403,
        }
      );
    }

    const sessionMember = await Member.findOne({
      email: user.email,
    });

    if (!sessionMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Member profile not found. Please contact support.",
        },
        {
          status: 404,
        }
      );
    }

    const isComplete =
      sessionMember.isProfileComplete ||
      Boolean(
        sessionMember.name?.trim() &&
          sessionMember.phone?.trim() &&
          sessionMember.address?.trim()
      );

    if (!isComplete) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your profile (Name, Phone, and Address) before borrowing books.",
          code: "PROFILE_INCOMPLETE",
        },
        {
          status: 403,
        }
      );
    }

    // Always identify the member strictly from the authenticated session
    const memberId = sessionMember._id.toString();

    // ==============================
    // FIND BOOK
    // ==============================

    const book =
      await Book.findById(bookId);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==============================
    // FIND MEMBER
    // ==============================

    const member =
      await Member.findById(memberId);

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==============================
    // STOCK
    // ==============================

    if (book.available <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Book is currently out of stock",
        },
        {
          status: 400,
        }
      );
    }

    // ==============================
    // ALREADY ISSUED
    // ==============================

    const alreadyIssued =
      await Issue.findOne({
        book: bookId,

        member: memberId,

        status: {
          $in: [
            "issued",
            "overdue",
          ],
        },
      });

    if (alreadyIssued) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This book is already issued to this member",
        },
        {
          status: 400,
        }
      );
    }

    // ==============================
    // DATES
    // ==============================

    const issueDate = new Date();

    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate() + 14
    );

    // ==============================
    // CREATE ISSUE
    // ==============================

    const issue =
      await Issue.create({
        book: bookId,

        member: memberId,

        issueDate,

        dueDate,

        returnDate: null,

        status: "issued",

        fine: 0,

        discount: 0,
      });

    // ==============================
    // UPDATE STOCK
    // ==============================

    book.available = Math.max(
      0,
      book.available - 1
    );

    await book.save();

    // ==============================
    // POPULATE
    // ==============================

    const populatedIssue =
      await Issue.findById(
        issue._id
      )
        .populate("book")
        .populate("member");

    return NextResponse.json(
      {
        success: true,

        message:
          "Book issued successfully",

        issue: populatedIssue,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ISSUE BOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to issue book",
      },
      {
        status: 500,
      }
    );
  }
}