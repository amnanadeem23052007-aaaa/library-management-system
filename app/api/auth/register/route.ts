import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Member from "@/models/Member";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role?.trim().toLowerCase();

    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !password || !role) {
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

    // =========================
    // ROLE CHECK
    // =========================

    if (!["librarian", "member"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // CHECK USER
    // =========================

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is already registered. Please login.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // =========================
    // CREATE USER
    // =========================

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // =========================
    // CREATE MEMBER PROFILE
    // =========================

    let member = null;

    if (role === "member") {
      member = await Member.create({
        name,
        email,
        phone: "",
        address: "",
      });

      console.log("MEMBER PROFILE CREATED:", {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
      });
    }

    // =========================
    // SUCCESS
    // =========================

    console.log("REGISTER SUCCESS:", {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      memberId: member
        ? member._id.toString()
        : null,
    });

    return NextResponse.json(
      {
        success: true,

        message:
          role === "member"
            ? "Member registration successful"
            : "Librarian registration successful",

        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },

        member: member
          ? {
              id: member._id.toString(),
              name: member.name,
              email: member.email,
              phone: member.phone,
              address: member.address,
            }
          : null,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTRATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Server error during registration",
      },
      {
        status: 500,
      }
    );
  }
}