import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const PRODUCTION_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://library-management-system-eight-puce.vercel.app";

// Ensure NEXTAUTH_URL is properly set in production deployments
if (
  process.env.NODE_ENV === "production" &&
  (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))
) {
  process.env.NEXTAUTH_URL = PRODUCTION_URL;
}

const secret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
        role: {
          label: "Role",
          type: "text",
        },
      },

      async authorize(credentials) {
        if (
          process.env.NODE_ENV === "production" &&
          !process.env.NEXTAUTH_SECRET
        ) {
          throw new Error(
            "NEXTAUTH_SECRET environment variable is missing in production."
          );
        }

        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = String(credentials.email)
            .trim()
            .toLowerCase();

          const password = String(credentials.password);

          const requestedRole = String(credentials.role || "")
            .trim()
            .toLowerCase();

          await connectDB();

          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const databaseRole = String(user.role)
            .trim()
            .toLowerCase();

          if (
            requestedRole &&
            databaseRole !== requestedRole
          ) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            String(user.password)
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: databaseRole,
          };
        } catch (error) {
          console.error("AUTH ERROR:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.role = String(token.role || "");
        if (token.name) session.user.name = String(token.name);
        if (token.email) session.user.email = String(token.email);
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Relative paths must be resolved against baseUrl to produce a valid absolute URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsedUrl = new URL(url);

        // If pointing to localhost in production, extract the pathname to stay on the deployed host
        if (
          process.env.NODE_ENV === "production" &&
          parsedUrl.hostname === "localhost"
        ) {
          return `${baseUrl}${parsedUrl.pathname}${parsedUrl.search}`;
        }

        // Allows callback URLs on the same origin
        if (parsedUrl.origin === baseUrl) {
          return url;
        }

        // If URL has a valid pathname but different host, preserve pathname on baseUrl
        if (parsedUrl.pathname) {
          return `${baseUrl}${parsedUrl.pathname}${parsedUrl.search}`;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/librarian-login",
  },

  debug: process.env.NODE_ENV === "development",
};