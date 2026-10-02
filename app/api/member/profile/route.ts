import { NextResponse } from "next/server";

import User from "@/models/User";
import Member from "@/models/Member";
import { requireMember, serializeMember } from "@/lib/member-session";

export async function GET() {
  try {
    const auth = await requireMember();

    if ("error" in auth) {
      return auth.error;
    }

    return NextResponse.json({
      success: true,
      member: serializeMember(auth.member, auth.user),
    });
  } catch (error) {
    console.error("MEMBER PROFILE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load profile",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireMember();

    if ("error" in auth) {
      return auth.error;
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();

    if (!name || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone number, and address are all required to complete your profile.",
        },
        { status: 400 }
      );
    }

    const member = await Member.findByIdAndUpdate(
      auth.member._id,
      {
        name,
        phone,
        address,
        isProfileComplete: true,
      },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      auth.user._id,
      { name, phone },
      { new: true }
    ).select("-password");

    if (!member || !user) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      member: serializeMember(member, user),
    });
  } catch (error) {
    console.error("MEMBER PROFILE PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
