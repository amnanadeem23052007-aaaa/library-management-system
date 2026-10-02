import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Member from "@/models/Member";

export async function requireMember() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  }).select("-password");

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      ),
    };
  }

  if (user.role !== "member") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Only members can access this resource",
        },
        { status: 403 }
      ),
    };
  }

  let member = await Member.findOne({ email: user.email });

  if (!member) {
    member = await Member.create({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: "",
    });
  }

  return { user, member };
}

export function isProfileComplete(member: any): boolean {
  if (member?.isProfileComplete) return true;
  const name = String(member?.name || "").trim();
  const phone = String(member?.phone || "").trim();
  const address = String(member?.address || "").trim();
  return Boolean(name && phone && address);
}

export function serializeMember(member: any, user: any) {
  const complete = isProfileComplete(member);
  return {
    id: member._id.toString(),
    userId: user._id.toString(),
    name: member.name || user.name,
    email: member.email || user.email,
    phone: member.phone || user.phone || "",
    address: member.address || "",
    role: "member",
    isProfileComplete: complete,
  };
}

export async function requireCompleteMember() {
  const auth = await requireMember();
  if ("error" in auth) {
    return auth;
  }

  if (!isProfileComplete(auth.member)) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Please complete your profile (Name, Phone, and Address) before accessing library books and services.",
          code: "PROFILE_INCOMPLETE",
        },
        { status: 403 }
      ),
    };
  }

  return auth;
}
