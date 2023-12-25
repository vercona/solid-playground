import { users, usersTableName } from "../../db/schemas";


/***   INPUT   ***/
import { createInsertSchema } from "drizzle-zod";
export const createUserInput = createInsertSchema(users)
  .omit({ created_at: true });


/***   Query   ***/
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


/***   Demo   ***/
// npm run demo:trpc messages/createUser
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.createUser.mutate({ 
    username: "Baam" 
  })
}
