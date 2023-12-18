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
          emailRedirectTo: "https://example.com/welcome",
        },
      });

      return data;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/paswordlessLogin
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.passwordlessLogin.query({
    email: ''
  })
}
