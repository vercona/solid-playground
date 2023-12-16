import { comments, commentsTableName } from "../../db/schemas";


/***   INPUT   ***/
import { createSelectSchema } from "drizzle-zod";
export const deleteCommentInput = createSelectSchema(comments)
  .pick({ comment_id: true });


/***   Query   ***/
import { kyselyDb } from "../../db/kyselyDb";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
export default ( 
  publicProcedure
    .input(deleteCommentInput)
    .mutation(async (req) => {
      const input = req.input;

      const response = await kyselyDb
        .updateTable(commentsTableName)
        .set({ is_deleted: true })
        .where("comment_id", "=", input.comment_id)
        .returning("comment_id")
        .execute();

      if (response.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      return response;
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/deleteComment
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.deleteComment.mutate({
    comment_id: "9f1b96dc-fce8-4751-ac9a-ab06c966a820",
  })
}
