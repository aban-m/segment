declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL?: string
  }
}
