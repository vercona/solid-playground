import { commentsTableName } from "../../db/schemas";


/***   Query   ***/
import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export default (
  publicProcedure
    .query(async () => {
      const allComments = await kyselyDb
        .selectFrom(commentsTableName)
        .selectAll()
        .execute();
      return allComments;
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/getComment
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.getComment.query()
}
