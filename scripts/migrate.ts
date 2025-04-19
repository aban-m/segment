import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"

// This script will run migrations on your database
async function main() {
  console.log("Running migrations...")

  // Make sure DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  // Create a Neon connection
  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  // Run migrations
  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations completed successfully!")
  process.exit(0)
}

main().catch((error) => {
  console.error("Migration failed:")
  console.error(error)
  process.exit(1)
})
