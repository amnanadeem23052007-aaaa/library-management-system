import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";
import DeletedMember from "@/models/DeletedMember";


// ==========================
// GET MEMBER
// ==========================
export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const member = await Member.findById(id);

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, member }, { status: 200 });
  } catch (error) {
    console.error("GET MEMBER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// ==========================
// UPDATE MEMBER (DISABLED)
// ==========================
export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Librarians cannot edit members. Members manage their own profiles.",
    },
    {
      status: 403,
    }
  );
}

// ==========================
// DELETE MEMBER (DISABLED)
// ==========================
export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Librarians cannot delete members. Member accounts are managed by members.",
    },
    {
      status: 403,
    }
  );
}