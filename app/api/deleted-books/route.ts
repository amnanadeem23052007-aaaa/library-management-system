import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import DeletedBook from "@/models/DeletedBook";
import Book from "@/models/Book";

// ==========================
// GET
// ==========================

export async function GET() {
  try {
    await connectDB();

    const books = await DeletedBook.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      books,
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

// ==========================
// RESTORE BOOK
// ==========================

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    const deletedBook =
      await DeletedBook.findById(id);

    if (!deletedBook) {
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

    await Book.create({
      title: deletedBook.title,
      author: deletedBook.author,
      category: deletedBook.category,
      isbn: deletedBook.isbn,
      quantity: deletedBook.quantity,
      available: deletedBook.available,
    });

    await DeletedBook.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Book Restored",
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

// ==========================
// DELETE PERMANENTLY
// ==========================

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    await DeletedBook.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Book Deleted Permanently",
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