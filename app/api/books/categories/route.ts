import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET() {
  try {
    await connectDB();
    const categories = await Book.distinct("category");
    const sorted = categories.filter(Boolean).sort((a: string, b: string) => a.localeCompare(b));

    return NextResponse.json(
      {
        success: true,
        categories: sorted,
        count: sorted.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET CATEGORIES ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
        categories: [],
      },
      { status: 500 }
    );
  }
}
