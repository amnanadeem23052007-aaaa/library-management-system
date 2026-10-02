import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Member from "@/models/Member";
import DeletedMember from "@/models/DeletedMember";

// ==========================
// GET ALL DELETED MEMBERS
// ==========================

export async function GET() {
  try {
    await connectDB();

    const members = await DeletedMember.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      members,
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
// RESTORE MEMBER
// ==========================

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    const deletedMember = await DeletedMember.findById(id);

    if (!deletedMember) {
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

    await Member.create({
      name: deletedMember.name,
      email: deletedMember.email,
      phone: deletedMember.phone,
      address: deletedMember.address,
    });

    await DeletedMember.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Member Restored Successfully",
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

    await DeletedMember.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Member Deleted Permanently",
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