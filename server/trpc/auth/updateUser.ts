import { supabaseClient } from "../../db/supabase";
import { users } from "../../db/schemas";

/***   INPUT   ***/
import { createInsertSchema } from "drizzle-zod";
export const updateUserInput = createInsertSchema(users)
  .pick({ username: true });

/***   Query   ***/
import { protectedProcedure } from "../trpc";
export default protectedProcedure
  .input(updateUserInput)
  .mutation(async (req) => {
    const { username } = req.input;
    const authToken = req.ctx.authToken;
    const { data } = await supabaseClient.auth.getUser(authToken);

    const getUserRes = await kyselyDb
      .updateTable("profiles")
      .set({
        username,
      })
      .where("user_id", "=", data.user!.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return getUserRes;
  });

/***   Demo   ***/
// npm run demo:trpc auth/updateUser
import type { DemoClient } from "../routes";
import { kyselyDb } from "../../db/kyselyDb";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.updateUser.mutate({ username: "Genos" });
}
