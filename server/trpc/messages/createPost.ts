import { posts, postsTableName } from "../../db/schemas";



import { createInsertSchema } from "drizzle-zod";
const createPostInput = createInsertSchema(posts)
  .omit({ post_id: true, created_at: true });



import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export default (
  publicProcedure
    .input(createPostInput)
    .mutation(async (req) => {
      const input = req.input;
      const response = await kyselyDb
        .insertInto(postsTableName)
        .values({
          user_id: input.user_id,
          title: input.title,
          description: input.description,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return response;
    })
)


import type { Routes } from "../routes";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";

!(async ()=>{
  if (require.main === module) {
    const trpc = createTRPCProxyClient<Routes>({
      links: [
        loggerLink({
          enabled: () => true
        }),
        httpBatchLink({
          url: "http://localhost:8080/trpc",
        })
      ]
    })

    const fetchQueries = async () => {
      try {
        const response = await trpc.messages.getPost.query({
          post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
        });
        console.log("response", response)
      } catch (err) {
        console.log("error", err)
      }
    };

    await fetchQueries()
  }
})()