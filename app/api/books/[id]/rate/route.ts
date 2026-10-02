import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import Rating from "@/models/Rating";
import { requireMember, isProfileComplete } from "@/lib/member-session";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const auth = await requireMember();
    if ("error" in auth) {
      return auth.error;
    }

    if (!isProfileComplete(auth.member)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your profile (Name, Phone, and Address) before rating books.",
          code: "PROFILE_INCOMPLETE",
        },
        { status: 403 }
      );
    }

    await connectDB();
    const { id: bookId } = await context.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const numRating = Number(body.rating);

    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be a whole number between 1 and 5",
        },
        { status: 400 }
      );
    }

    const ratingValue = Math.min(5, Math.max(1, Math.round(numRating)));
    const review = String(body.review || "").trim();

    const ratingDoc = await Rating.findOneAndUpdate(
      { book: book._id, member: auth.member._id },
      { rating: ratingValue, review },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const allRatings = await Rating.find({ book: book._id });
    const totalRatings = allRatings.length;
    const sum = allRatings.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    const averageRating =
      totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : 0;

    book.rating = averageRating;
    book.totalRatings = totalRatings;
    await book.save();

    return NextResponse.json({
      success: true,
      message: "Rating saved successfully",
      rating: ratingDoc,
      book: {
        _id: book._id,
        rating: book.rating,
        totalRatings: book.totalRatings,
      },
    });
  } catch (error) {
    console.error("RATE BOOK ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit rating" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();
    const { id: bookId } = await context.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    let userRating: any = null;
    const auth = await requireMember();
    if (!("error" in auth)) {
      userRating = await Rating.findOne({
        book: book._id,
        member: auth.member._id,
      });
    }

    return NextResponse.json({
      success: true,
      rating: book.rating || 0,
      totalRatings: book.totalRatings || 0,
      userRating: userRating ? userRating.rating : null,
    });
  } catch (error) {
    console.error("GET BOOK RATING ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}