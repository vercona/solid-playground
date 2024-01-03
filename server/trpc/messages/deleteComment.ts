import { comments, commentsTableName } from "../../db/schemas";


/***   INPUT   ***/
import { createSelectSchema } from "drizzle-zod";
export const deleteCommentInput = createSelectSchema(comments)
  .pick({ comment_id: true });


/***   Query   ***/
import { kyselyDb } from "../../db/kyselyDb";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
export default ( 
  protectedProcedure
    .input(deleteCommentInput)
    .mutation(async (req) => {
      const input = req.input;
      const user = req.ctx.user;
      console.log("user", user)

      const commentUserId = await kyselyDb
        .selectFrom(commentsTableName)
        .select("user_id")
        .where("comment_id", "=", input.comment_id)
        .execute();

      if(commentUserId.length === 0){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if(commentUserId[0] && commentUserId[0].user_id !== user.id){
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const response = await kyselyDb
        .updateTable(commentsTableName)
        .set({ is_deleted: true })
        .where("comment_id", "=", input.comment_id)
        .returning("comment_id")
        .execute();

      return response;
    })
)

/***   Demo   ***/
// npm run demo:trpc messages/deleteComment
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.deleteComment.mutate({
    comment_id: "9893efb1-5b36-4ce7-9f53-8b4469d30b38",
  });
}
