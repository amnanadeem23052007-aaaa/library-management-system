import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import DeletedBook from "@/models/DeletedBook";



// ==========================
// GET SINGLE BOOK
// ==========================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        book,
      },
      {
        status: 200,
      }
    );
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



// ==========================
// UPDATE BOOK
// ==========================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const book = await Book.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        book,
      },
      {
        status: 200,
      }
    );
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



// ==========================
// DELETE BOOK
// ==========================


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found",
        },
        {
          status: 404,
        }
      );
    }

    // Save book in deleted history

    await DeletedBook.create({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
      available: book.available,
    });

    // Delete original book

    await Book.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Book deleted and moved to history",
      },
      {
        status: 200,
      }
    );
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