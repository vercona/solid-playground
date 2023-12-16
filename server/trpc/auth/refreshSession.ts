import { z } from "zod";
import { supabaseClient } from "../../db"


/***   Query   ***/
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    .input(z.object({ refresh_token: z.string() }))
    .query(async (req) => {
      const { refresh_token } = req.input;
      const { data, error } = await supabaseClient.auth.refreshSession({
        refresh_token,
      });

      console.log("error", error);
      return data;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/refreshSession
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.refreshSession.query({
    refresh_token: ''
  })
}
