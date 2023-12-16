import { Kysely, PostgresDialect } from "kysely";
import { Kyselify } from "drizzle-orm/kysely";
import { Pool } from "pg";
import "dotenv/config";
import { users, posts, comments } from "./schemas";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = process.env.DATABASE_URL;

export interface KyselyDatabase {
    profiles: Kyselify<typeof users>,
    posts: Kyselify<typeof posts>,
    comments: Kyselify<typeof comments>
};

export const kyselyDb = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
        connectionString
    })
  }),
});
