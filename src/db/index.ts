import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Determine connection URL from environment
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'Environment variable DATABASE_URL must be set to connect to the database'
  );
}
// Initialize Postgres client and Drizzle ORM
const queryClient = postgres(connectionString);
const db = drizzle(queryClient);
export default db;
