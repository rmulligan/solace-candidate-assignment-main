import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Determine connection URL, defaulting to local Docker Compose settings if not provided
const connectionString = process.env.DATABASE_URL
  || 'postgres://postgres:password@localhost:5433/solaceassignment';
if (!process.env.DATABASE_URL) {
  console.warn(
    `DATABASE_URL is not set; defaulting to '${connectionString}'`
  );
}
// Initialize Postgres client and Drizzle ORM
const queryClient = postgres(connectionString);
const db = drizzle(queryClient);
export default db;
