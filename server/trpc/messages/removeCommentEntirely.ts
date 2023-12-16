import { publicProcedure } from "../trpc";
import { comments } from "../../db/schemas";
import { kyselyDb } from "../../db/kyselyDb";


/***   INPUT   ***/
import { createSelectSchema } from "drizzle-zod";
export const deleteCommentInput = createSelectSchema(comments)
  .pick({ comment_id: true });


/***   Query   ***/
export default (
  publicProcedure
    .input(deleteCommentInput)
    .mutation(async (req) => {
      const input = req.input;
      const response = await kyselyDb
        .deleteFrom("comments")
        .where("comments.comment_id", "=", input.comment_id)
        .returning("comment_id")
        .execute();
      return response;
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/removeCommentEntirely
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  let id = ''
  return await trpc.messages.removeCommentEntirely.mutate({
    comment_id: id,
  })
}
