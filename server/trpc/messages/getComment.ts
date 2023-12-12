import { commentsTableName } from "../../db/schemas";



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