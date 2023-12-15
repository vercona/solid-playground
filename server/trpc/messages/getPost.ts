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
// npx tsx server\trpc\messages\getPost.ts
import { demoTRPC, CMDL_IIF } from '../demo'
CMDL_IIF(
  async ()=>
    await demoTRPC.messages.getPost.query({
      post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    }),
  require.main === module
)
