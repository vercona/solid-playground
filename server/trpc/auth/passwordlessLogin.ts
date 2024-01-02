import { z } from "zod";
import { supabaseClient } from "../../db/supabase"

/***   INPUT   ***/
export const emailSchema = z.object({ email: z.string().email() });

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    .input(emailSchema)
    .query(async (req) => {
      const { email } = req.input;
      const { data } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "http://localhost:3000",
        },
      });

      return data;
    })
);

/***   Demo   ***/
// npm run demo:trpc auth/passwordlessLogin
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.passwordlessLogin.query({
    email: ''
  })
}
