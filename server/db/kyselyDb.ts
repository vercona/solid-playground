import { Kysely, PostgresDialect, sql } from "kysely";
import { Kyselify } from "drizzle-orm/kysely";
import { Pool } from "pg";
import "dotenv/config";
import { users, posts, comments } from "./schemas";
import { client, db } from ".";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = process.env.DATABASE_URL;

export interface KDB {
    profiles: Kyselify<typeof users>,
    posts: Kyselify<typeof posts>,
    comments: Kyselify<typeof comments>
};

export const kyselyDb = new Kysely<KDB>({
  dialect: new PostgresDialect({
    pool: new Pool({
        connectionString
    })
  }),
});


// interface Profiles {
//   user_id: ColumnType<string, string | undefined, string | undefined>;
//   username: ColumnType<string, string, string>;
//   created_at: ColumnType<Date, Date | undefined, Date | undefined>;
// }

// interface Posts {
//   user_id: ColumnType<string, string, string>;
//   created_at: ColumnType<Date, Date | undefined, Date | undefined>;
//   post_id: ColumnType<string, string | undefined, string | undefined>;
// }

// interface Comments {
//   comment_id: ColumnType<string, string | undefined, string | undefined>;
//   comment_num: ColumnType<
//     number | null,
//     number | null | undefined,
//     number | null | undefined
//   >;
//   user_id: ColumnType<string, string, string>;
//   post_id: ColumnType<string, string | undefined, string | undefined>;
// }

// interface Database {
//   profiles: Profiles;
//   posts: Posts;
//   comments: Comments;
// }