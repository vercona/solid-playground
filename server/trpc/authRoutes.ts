import { z } from "zod";
import { supabaseClient } from "../db"
import { router, publicProcedure } from "./trpc";

const authRoutes = router({
  passwordlessLogin: publicProcedure
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
    }),
  refreshSession: publicProcedure
    .input(z.object({ refresh_token: z.string() }))
    .query(async (req) => {
      const { refresh_token } = req.input;
      const { data, error } = await supabaseClient.auth.refreshSession({
        refresh_token,
      });

      console.log("error", error);
      return data;
    }),
  getUser: publicProcedure
    // .input(z.object({ token: z.string() }))
    .query(async (req,) => {
      // const { token } = req.input;
      // const { data, error } = await supabaseClient.auth.getUser(token);

      // console.log("error", error);
      // return data;
    }),
  testAuth: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async (req) => {
      const { token } = req.input;
      const { data, error } = await supabaseClient.auth.getUser(token);

      console.log("error", error);
      return data;
    }),
});

export default authRoutes;
