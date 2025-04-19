import { exec } from "child_process"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// This script will generate migrations based on schema changes
async function main() {
  console.log("Generating migrations...")

  // Make sure DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  // Run drizzle-kit generate
  exec("npx drizzle-kit generate", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
      return
    }
    console.log(stdout)
    console.log("Migration files generated successfully!")
  })
}

main().catch((error) => {
  console.error("Migration generation failed:")
  console.error(error)
  process.exit(1)
})
