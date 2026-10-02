import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Member from "@/models/Member";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedEmail = email.toLowerCase();

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "member",
    });

    const existingMember = await Member.findOne({
      email: normalizedEmail,
    });

    if (!existingMember) {
      await Member.create({
        name,
        email: normalizedEmail,
        phone: "",
        address: "",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Member registration successful",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Member Registration Error:", error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}