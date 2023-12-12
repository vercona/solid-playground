import { publicProcedure } from "../trpc";
import { comments } from "../../db/schemas";
import { kyselyDb } from "../../db/kyselyDb";



import { createSelectSchema } from "drizzle-zod";
export const deleteCommentInput = createSelectSchema(comments)
  .pick({ comment_id: true });



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