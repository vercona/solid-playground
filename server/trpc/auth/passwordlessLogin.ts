import { z } from "zod";
import { supabaseClient } from "../../db/supabase"


/***   Query   ***/
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async (req) => {
      const { email } = req.input;
      const { data, error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "http://localhost:3000",
        },
      });

      return data;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/passwordlessLogin
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.passwordlessLogin.query({
    email: 'nspann77@gmail.com'
  })
}
