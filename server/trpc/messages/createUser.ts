import { users, usersTableName } from "../../db/schemas";



import { createInsertSchema } from "drizzle-zod";
export const createUserInput = createInsertSchema(users)
  .omit({ user_id: true, created_at: true });



import { kyselyDb } from "../../db/kyselyDb";
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    .input(createUserInput)
    .mutation(async (req) => {
      const input = req.input;
      const response = await kyselyDb
        .insertInto(usersTableName)
        .values({ ...input })
        .returningAll()
        .executeTakeFirstOrThrow();
      return response;
    })
)
