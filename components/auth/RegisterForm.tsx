"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Users,
  ShieldCheck,
} from "lucide-react";

interface RegisterFormProps {
  role: "librarian" | "member";
}

const inputClass =
  "w-full h-[50px] rounded-[12px] border border-white/20 bg-white/10 px-4 py-3 pr-12 text-base text-white placeholder:text-white/45 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20";

export default function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert(
        role === "member"
          ? "Member registration successful!"
          : "Librarian registration successful!"
      );

      if (role === "member") {
        router.push("/member-login");
      } else {
        router.push("/librarian-login");
      }

      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong while registering.");
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
              Create Your
              <br />
              <span className="text-blue-400">
                {role === "member"
                  ? "Member Account"
                  : "Librarian Account"}
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/75 xl:text-lg" style={{ paddingTop: "20px" }}>
              Join the Library Management System and manage your library
              activities easily with a modern, secure and user-friendly
              platform.
            </p>

            <div className="mt-10 flex gap-8 xl:gap-12" style={{ paddingTop: "20px" }}>
              <div>
                <h3 className="text-3xl font-bold text-blue-400 xl:text-4xl">
                  500+
                </h3>
                <p className="mt-1 text-sm text-white/65">Books</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-green-400 xl:text-4xl">
                  300+
                </h3>
                <p className="mt-1 text-sm text-white/65">Members</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-purple-400 xl:text-4xl">
                  100%
                </h3>
                <p className="mt-1 text-sm text-white/65">Secure</p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[42%] lg:px-10 xl:px-14"
          style={{ padding: "40px 30px" }}>
          {/* Transparent Register Card */}
          <div className="w-full max-w-[460px] rounded-[20px] border border-white/20 bg-white/10 p-8
           shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10"style={{ padding: "40px 30px" }}>

            {/* Icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-blue-300">
              {role === "member" ? (
                <Users size={28} />
              ) : (
                <ShieldCheck size={28} />
              )}
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl" style={{ marginTop: "10px" }}>
              Register
            </h2>

            {/* Subtitle */}
            <p className="mt-3 text-base leading-6 text-white/70" style={{ marginTop: "10px" }}>
              Create your{" "}
              <span className="font-bold text-blue-300">
                {role === "member" ? "Member" : "Librarian"}
              </span>{" "}
              account.
            </p>

            {/* Form */}
            <div className="mt-8 flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/90" style={{ marginBottom: "10px" }}>
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={inputClass} style={{ padding: "10px 15px" }}
                  />
                </div>
              </div>

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
                    placeholder="Create password"
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

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="mt-7 h-[50px] w-full rounded-[12px] 
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-base 
              font-bold text-white shadow-lg shadow-blue-900/30 transition duration-200
               hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60" style={{ marginTop: "20px" }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm leading-6 text-white/70" style={{ marginTop: "20px" }}>
              Already have an account?

              <Link
                href={
                  role === "member"
                    ? "/member-login"
                    : "/librarian-login"
                }
                className="ml-2 font-bold text-blue-300 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}