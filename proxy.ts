import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // =========================
  // MEMBER ROUTES
  // =========================

  if (
    pathname === "/member" ||
    pathname.startsWith("/member/")
  ) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/member-login", request.url)
      );
    }

    if (token.role !== "member") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  // =========================
  // LIBRARIAN ROUTES
  // =========================

  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  ) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/librarian-login", request.url)
      );
    }

    if (token.role !== "librarian") {
      return NextResponse.redirect(
        new URL("/member", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/member",
    "/member/:path*",
  ],
};