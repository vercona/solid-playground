import { z } from "zod";
import { supabaseClient } from "../../db/supabase"


/***   Query   ***/
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    // .input(z.object({ token: z.string() }))
    .query(async (req,) => {
      // const { token } = req.input;
      // const { data, error } = await supabaseClient.auth.getUser(token);

      // console.log("error", error);
      // return data;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/getUser
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  console.log('HIT')
  return await trpc.auth.getUser.query()
}
