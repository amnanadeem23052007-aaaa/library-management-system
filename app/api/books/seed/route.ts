import { NextResponse } from "next/server";
import { seedBooksDatabase } from "@/lib/seedBooks";

export async function POST() {
  try {
    const result = await seedBooksDatabase();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("SEED BOOKS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to seed books",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const result = await seedBooksDatabase();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("SEED BOOKS GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to seed books",
      },
      {
        status: 500,
      }
    );
  }
}