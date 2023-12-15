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

