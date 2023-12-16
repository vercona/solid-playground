import { z } from "zod";
import { supabaseClient } from "../../db"

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async (req) => {
      const { token } = req.input;
      const { data, error } = await supabaseClient.auth.getUser(token);

      console.log("error", error);
      return data;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/testAuth
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.testAuth.query({
    token: ''
  })
}
