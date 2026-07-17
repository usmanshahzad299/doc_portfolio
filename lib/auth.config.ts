import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const userId =
          "id" in user && typeof user.id === "string" ? user.id : token.sub;
        const userRole =
          "role" in user && typeof user.role === "string" ? user.role : undefined;

        if (userId) {
          token.id = userId;
        }
        if (userRole) {
          token.role = userRole;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const tokenId = typeof token.id === "string" ? token.id : token.sub;
        if (tokenId) {
          session.user.id = tokenId;
        }
        if (typeof token.role === "string") {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
