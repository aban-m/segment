import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isOnboarded: boolean
    } & DefaultSession["user"]
  }
}
