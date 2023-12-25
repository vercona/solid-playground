import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is missing");
}

if (!process.env.SUPABASE_KEY) {
  throw new Error("SUPABASE_KEY is missing");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
