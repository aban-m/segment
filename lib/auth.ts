import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      })

      // If not, create a new user
      if (!existingUser) {
        await db.insert(users).values({
          name: user.name || "User",
          email: user.email,
          profileImage: user.image,
          isOnboarded: false,
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && session.user.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, session.user.email),
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.isOnboarded = dbUser.isOnboarded
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
}
