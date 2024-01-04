import { posts, postsTableName } from "../../db/schemas";

/***   INPUT   ***/
import { createSelectSchema } from "drizzle-zod";
export const getPostInput = createSelectSchema(posts);

/***   Query   ***/
import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export default publicProcedure.query(async () => {
  const postsRes = await kyselyDb
    .selectFrom(postsTableName)
    .innerJoin("profiles as users", (join) => join.onRef("posts.user_id", "=", "users.user_id"))
    .select([
        "posts.user_id",
        "post_id",
        "username",
        "posts.created_at",
        "title",
    ])
    .execute();
  return postsRes;
});

/***   Demo   ***/
// npm run demo:trpc messages/getAllPosts
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.getAllPosts.query();
}
