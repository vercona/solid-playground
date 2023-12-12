import { comments, commentsTableName } from "../../db/schemas";



import { createSelectSchema } from "drizzle-zod";
export const deleteCommentInput = createSelectSchema(comments)
  .pick({ comment_id: true });



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