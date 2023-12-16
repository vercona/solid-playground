import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}
if (!process.env.PROJECT_URL) {
  throw new Error("PROJECT_URL is missing");
}
if (!process.env.SUPABASE_KEY) {
  throw new Error("SUPABASE_KEY is missing");
}


const connectionString = process.env.DATABASE_URL;
export const client = postgres(connectionString);

export const db = drizzle(client);


// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(
  process.env.PROJECT_URL,
  process.env.SUPABASE_KEY
);