import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PRODUCTION_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://library-management-system-eight-puce.vercel.app";

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))
) {
  process.env.NEXTAUTH_URL = PRODUCTION_URL;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const secret = process.env.NEXTAUTH_SECRET;

  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error(
      "NEXTAUTH_SECRET environment variable is missing in production."
    );
  }

  const isSecure =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https" ||
    request.cookies.has("__Secure-next-auth.session-token") ||
    Boolean(process.env.VERCEL);

  // Attempt retrieving token with secureCookie flag matching the environment
  let token = await getToken({
    req: request,
    secret,
    secureCookie: isSecure,
  });

  // Fallback attempt to retrieve token if secureCookie setting differed
  if (!token) {
    token = await getToken({
      req: request,
      secret,
      secureCookie: !isSecure,
    });
  }

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