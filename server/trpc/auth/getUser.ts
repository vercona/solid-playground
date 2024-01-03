import { supabaseClient } from "../../db/supabase";

/***   Query   ***/
import { protectedProcedure } from "../trpc";
export default (
  protectedProcedure
    .query(async ({ctx}) => {

      const getUserRes = await kyselyDb
        .selectFrom("profiles")
        .selectAll()
        .where("user_id", '=', ctx.user.id)
        .execute()

      return getUserRes;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/getUser
import type { DemoClient } from "../routes";
import { kyselyDb } from "../../db/kyselyDb";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.getUser.query()
}
