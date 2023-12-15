import { posts, postsTableName } from "../../db/schemas"


/***   INPUT   ***/
import { createSelectSchema } from "drizzle-zod";
export const getPostInput = createSelectSchema(posts)
  .pick({ post_id: true });


/***   Query   ***/
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


/***   Demo   ***/
// npm run demo:trpc messages/getPost
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.getPost.query({
    post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
  })
}
