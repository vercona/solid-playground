import { posts, postsTableName } from "../../db/schemas";


/***   INPUT   ***/
import { createInsertSchema } from "drizzle-zod";
const createPostInput = createInsertSchema(posts)
  .omit({ post_id: true, created_at: true });


/***   Query   ***/
import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export default (
  publicProcedure
    .input(createPostInput)
    .mutation(async (req) => {
      const input = req.input;
      const response = await kyselyDb
        .insertInto(postsTableName)
        .values({
          user_id: input.user_id,
          title: input.title,
          description: input.description,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return response;
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/createPost
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  const SaitamaId = 'e274ca42-560c-49ef-95ab-c10511fb8412';
  return await trpc.messages.createPost.mutate({
    title: "Third post with Kysley",
    description: "This post was created using Kysley",
    user_id: SaitamaId,
  })
}
