import { posts, postsTableName } from "../../db/schemas"



import { createSelectSchema } from "drizzle-zod";
export const getPostInput = createSelectSchema(posts)
  .pick({ post_id: true });



import { publicProcedure } from "../trpc"
import { kyselyDb } from "../../db/kyselyDb"
export default (
  publicProcedure
    .input(getPostInput)
    .query(async (req) => {
      const { post_id } = req.input;
      const postRes = await kyselyDb
        .selectFrom(postsTableName)
        .selectAll()
        .where("post_id", "=", post_id)
        .execute();
      return postRes;
    })
)
