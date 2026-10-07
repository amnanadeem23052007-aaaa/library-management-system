import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Ensure NEXTAUTH_URL is not mistakenly set to localhost in production deployments
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXTAUTH_URL?.includes("localhost")
) {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else {
    delete process.env.NEXTAUTH_URL;
  }
}

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
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("AUTH: Missing credentials");
            return null;
          }

          const email = String(credentials.email)
            .trim()
            .toLowerCase();

          const password = String(credentials.password);

          const requestedRole = String(credentials.role || "")
            .trim()
            .toLowerCase();

          console.log("LOGIN:", {
            email,
            requestedRole,
          });

          await connectDB();

          const user = await User.findOne({ email });

          if (!user) {
            console.log("AUTH: User not found");
            return null;
          }

          const databaseRole = String(user.role)
            .trim()
            .toLowerCase();

          console.log("USER ROLE:", databaseRole);

          if (
            requestedRole &&
            databaseRole !== requestedRole
          ) {
            console.log("AUTH: Wrong role");
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            String(user.password)
          );

          if (!passwordMatch) {
            console.log("AUTH: Wrong password");
            return null;
          }

          console.log("AUTH: Login successful");

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

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.role = String(token.role || "");
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return url;
      }

      try {
        const parsedUrl = new URL(url);

        // If pointing to localhost in production, extract the pathname to stay on the deployed host
        if (
          process.env.NODE_ENV === "production" &&
          parsedUrl.hostname === "localhost"
        ) {
          return `${parsedUrl.pathname}${parsedUrl.search}`;
        }

        // Allows callback URLs on the same origin
        if (parsedUrl.origin === baseUrl) {
          return url;
        }

        // If the URL has a valid pathname, preserve the relative pathname
        if (parsedUrl.pathname) {
          return `${parsedUrl.pathname}${parsedUrl.search}`;
        }
      } catch {
        // Fallback for relative or malformed URLs
        if (url.startsWith("/")) {
          return url;
        }
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/librarian-login",
  },

  debug: process.env.NODE_ENV === "development",
};