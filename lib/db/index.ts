import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

// Create a connection to the database
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
