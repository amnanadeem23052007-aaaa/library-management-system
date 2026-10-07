"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
  role: "librarian" | "member";
}

const inputClass =
  "w-full h-[50px] rounded-[12px] border border-white/20 bg-white/10 px-4 py-3 pr-12 text-base text-white placeholder:text-white/45 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20";

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const targetUrl = role === "librarian" ? "/dashboard" : "/member";

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        role,
        redirect: false,
        callbackUrl: targetUrl,
      });

      console.log("LOGIN RESULT:", result);

      if (!result?.ok || result?.error) {
        const errorMsg =
          result?.error || "Login failed. Please check your credentials.";
        console.error("Login failed:", errorMsg, result);
        alert(
          result?.error === "CredentialsSignin"
            ? (role === "librarian"
                ? "Invalid librarian email or password"
                : "Invalid member email or password")
            : `Authentication error: ${errorMsg}`
        );
        return;
      }

      window.location.href = targetUrl;
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/login-image.webp')",
        }}
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* LEFT SIDE */}
        <section className="hidden min-h-screen items-center justify-center px-12 xl:px-20 lg:flex lg:w-[58%]">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-lg font-semibold text-blue-300 xl:text-xl" style={{ paddingBottom: "20px" }}>
              Library Management System
            </p>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-7xl">
              Welcome to
              <br />
              Library
              <br />
              Management
              <br />
              System
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/75 xl:text-lg" style={{ paddingTop: "20px" }}>
              Manage books, members, issue books, return books,
              inventory and reports from one beautiful modern
              dashboard.
            </p>

            <div className="mt-10 flex gap-8 xl:gap-12" style={{ paddingTop: "20px" }}>
              <div>
                <h3 className="text-3xl font-bold text-blue-400 xl:text-4xl">
                  500+
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  Books
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-green-400 xl:text-4xl">
                  300+
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  Members
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-purple-400 xl:text-4xl">
                  100%
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  Secure
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[42%] lg:px-10 xl:px-14">
          {/* Transparent Login Card */}
          <div className="w-full max-w-[460px] rounded-[20px] border
           border-white/20 bg-white/10 p-8 flex flex-col gap-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10"
            style={{ padding: "40px 30px" }}>

            {/* Icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-blue-300">
              {role === "librarian" ? (
                <ShieldCheck size={28} />
              ) : (
                <Users size={28} />
              )}
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Login
            </h2>

            {/* Subtitle */}
            <p className="mt-3 text-base leading-6 text-white/70">
              Login as{" "}
              <span className="font-bold text-blue-300">
                {role === "librarian" ? "Librarian" : "Member"}
              </span>{" "}
              to continue.
            </p>

            {/* Form */}
            <div className="mt-8 flex flex-col gap-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/90" style={{ marginBottom: "10px" }}>
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputClass} style={{ padding: "10px 15px" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/90" style={{ marginBottom: "10px" }}>
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass} style={{ padding: "10px 15px" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-blue-300"
                  >
                    {showPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="mt-5 flex items-center justify-between gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2.5 text-white/70">
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-blue-600"
                />
                Remember Me
              </label>

              <button
                type="button"
                className="shrink-0 font-semibold text-blue-300 hover:text-blue-200 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-6 h-[50px] w-full rounded-[12px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-base font-bold text-white shadow-lg shadow-blue-900/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

            {/* OR */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20" />

              <span className="text-xs font-medium text-white/50">
                OR
              </span>

              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Other Login */}
            {role === "librarian" ? (
              <Link
                href="/member-login"
                className="flex h-[50px] w-full items-center justify-center rounded-[12px] border border-white/20 bg-white/10 text-base font-bold text-white transition hover:bg-white/15"
              >
                Member Login
              </Link>
            ) : (
              <Link
                href="/librarian-login"
                className="flex h-[50px] w-full items-center justify-center rounded-[12px] border border-white/20 bg-white/10 text-base font-bold text-white transition hover:bg-white/15"
              >
                Librarian Login
              </Link>
            )}

            {/* Register Link */}
            <p className="mt-6 text-center text-sm leading-6 text-white/70">
              Don&apos;t have an account?

              {role === "member" ? (
                <Link
                  href="/member-register"
                  className="ml-2 font-bold text-blue-300 hover:underline"
                >
                  Register as Member
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="ml-2 font-bold text-blue-300 hover:underline"
                >
                  Register as Librarian
                </Link>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}