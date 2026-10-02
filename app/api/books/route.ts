import { NextRequest, NextResponse } from "next/server";
import { SortOrder } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";

// ==============================
// GET ALL BOOKS
// ==============================

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get("search") || "";

    const category = searchParams.get("category") || "";

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const limit = Math.max(
      1,
      Number(searchParams.get("limit")) || 10
    );

    const sort = searchParams.get("sort") || "latest";

    const availableOnly =
      searchParams.get("available") === "true";

    const query: any = {};

    // ==============================
    // SEARCH
    // ==============================

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          author: {
            $regex: search,
            $options: "i",
          },
        },

        {
          category: {
            $regex: search,
            $options: "i",
          },
        },

        {
          isbn: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ==============================
    // CATEGORY
    // ==============================

    if (category) {
      query.category = category;
    }

    if (availableOnly) {
      query.available = { $gt: 0 };
    }

    // ==============================
    // SORT
    // ==============================

    const sortOption: Record<string, SortOrder> =
      sort === "oldest"
        ? { createdAt: 1 }
        : sort === "title"
          ? { title: 1 }
          : sort === "author"
            ? { author: 1 }
            : { createdAt: -1 };

    // ==============================
    // COUNT
    // ==============================

    const totalBooks =
      await Book.countDocuments(query);

    // ==============================
    // BOOKS
    // ==============================

    const books = await Book.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const allCategories = await Book.distinct("category");
    const categories = allCategories
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));

    // ==============================
    // RESPONSE
    // ==============================

    return NextResponse.json(
      {
        success: true,

        totalBooks,

        currentPage: page,

        totalPages: Math.ceil(
          totalBooks / limit
        ),

        books,

        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET BOOKS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch books",
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// ADD BOOK
// ==============================

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      title,
      author,
      category,
      isbn,
      quantity,
    } = body;

    // ==============================
    // VALIDATION
    // ==============================

    if (
      !title ||
      !author ||
      !category ||
      !isbn ||
      quantity === undefined ||
      Number(quantity) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // ==============================
    // DUPLICATE ISBN
    // ==============================

    const existingBook =
      await Book.findOne({
        isbn,
      });

    if (existingBook) {
      return NextResponse.json(
        {
          success: false,
          message: "ISBN already exists",
        },
        {
          status: 400,
        }
      );
    }

    // ==============================
    // CREATE BOOK
    // ==============================

    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      quantity: Number(quantity),
      available: Number(quantity),
    });

    // ==============================
    // RESPONSE
    // ==============================

    return NextResponse.json(
      {
        success: true,
        message: "Book added successfully",
        book,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE BOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Book creation failed",
      },
      {
        status: 500,
      }
    );
  }
}