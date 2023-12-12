import { commentsTableName } from "../../db/schemas";



import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export const getComment = (
  publicProcedure
    .query(async () => {
      const allComments = await kyselyDb
        .selectFrom(commentsTableName)
        .selectAll()
        .execute();
      return allComments;
    })
)