import { usersTableName } from "../../db/schemas";


/***   Query   ***/
import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export default (
  publicProcedure
    .query(async () => {
      const allUsers = await kyselyDb
        .selectFrom(usersTableName)
        .selectAll()
        .execute();
      return allUsers;
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/getAllUsers
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.getAllUsers.query()
}
