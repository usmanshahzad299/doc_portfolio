import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(8).max(128),
});

const failedLoginAttempts = new Map<
  string,
  { attempts: number; lockUntilMs: number }
>();
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;
const DUMMY_PASSWORD_HASH =
  "$2a$10$hA6QMSQ1hYgVqadM6Qxw0O2C3ly4m0cR3hEGQmyKl3fN5m9QhGXq6";

function getClientIp(request?: Request) {
  const forwardedFor = request?.headers.get("x-forwarded-for")?.split(",")[0];
  const realIp = request?.headers.get("x-real-ip");
  return (forwardedFor ?? realIp ?? "unknown").trim();
}

function buildAttemptKey(email: string, request?: Request) {
  return `${email}:${getClientIp(request)}`;
}

function isLockedOut(key: string, nowMs: number) {
  const record = failedLoginAttempts.get(key);
  if (!record) return false;

  if (record.lockUntilMs > nowMs) return true;
  failedLoginAttempts.delete(key);
  return false;
}

function registerFailedAttempt(key: string, nowMs: number) {
  const existing = failedLoginAttempts.get(key);
  const attempts = (existing?.attempts ?? 0) + 1;

  if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    failedLoginAttempts.set(key, {
      attempts,
      lockUntilMs: nowMs + LOGIN_LOCK_WINDOW_MS,
    });
    return;
  }

  failedLoginAttempts.set(key, { attempts, lockUntilMs: 0 });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = credentialsSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email;
        const password = parsed.data.password;
        const nowMs = Date.now();
        const attemptKey = buildAttemptKey(email, request);
        if (isLockedOut(attemptKey, nowMs)) {
          return null;
        }

        // Dynamically import prisma and bcrypt only when needed (not in Edge runtime)
        const { prisma } = await import("@/lib/prisma");
        const bcryptModule = await import("bcryptjs");
        const compare =
          bcryptModule.compare ?? bcryptModule.default?.compare;
        if (!compare) {
          throw new Error("bcrypt compare() not available");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });
        const hashToCompare = user?.password ?? DUMMY_PASSWORD_HASH;
        const passwordsMatch = await compare(password, hashToCompare);

        if (!user || !passwordsMatch) {
          registerFailedAttempt(attemptKey, nowMs);
          return null;
        }

        failedLoginAttempts.delete(attemptKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
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
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
