import { comments } from "../../db/schemas";


/***   INPUT   ***/
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
const input = createSelectSchema(comments)
  .pick({ post_id: true, parent_id: true })
  .extend({
    begin_comment_num: z.number(),
    query_num_limit: z.number(),
    query_depth: z.number().nullable(),
    start_level: z.number(),
  });


/***   Query   ***/
import { SelectQueryBuilder, QueryCreator } from "kysely";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
import { comments_view } from "../../db/views";
import { nestComments, GetComments } from './utils/nested'
import { reusable } from './utils/reusable'

export default (
  publicProcedure
    .input(input)
    .query(async (req) => {
      const {
        post_id,
        parent_id,
        begin_comment_num,
        query_num_limit,
        start_level,
        query_depth,
      } = req.input;

      const paginationQueries =
        (addParentIdCondition: boolean) =>
        (qb: SelectQueryBuilder<GetComments, "c", {}>) => {
          let baseQuery = qb.$call(reusable);
          if (query_depth || query_depth === 0) {
            baseQuery = baseQuery.where(
              "c.level",
              "<=",
              start_level + query_depth
            );
          }
          if (addParentIdCondition) {
            if (parent_id) {
              baseQuery = baseQuery.where("parent_id", "=", parent_id);
            } else {
              baseQuery = baseQuery.where("parent_id", "is", parent_id);
            }
          }
          return baseQuery;
        };

      const getCommentsRes = await kyselyDb
        .withRecursive(
          "t(user_id, username, comment_id, body, level, parent_id, comment_num, created_at, is_deleted, max_child_comment_num, likes, dislikes, num_of_children, row_num)",
          (db: QueryCreator<GetComments>) =>
            db
              .with("c", comments_view)
              .selectFrom("c")
              .$call(paginationQueries(true))
              .where("post_id", "=", post_id)
              .unionAll((db) =>
                db
                  .selectFrom("t")
                  .innerJoin("c", "c.parent_id", "t.comment_id")
                  .$call(paginationQueries(false))
              )
        )
        .selectFrom("t")
        .selectAll()
        .where((eb) =>
          eb.or([
            eb.and([
              eb("row_num", ">", begin_comment_num),
              eb("row_num", "<=", begin_comment_num + query_num_limit),
            ]),
            eb.and([
              eb("level", ">", start_level),
              eb("row_num", "<=", begin_comment_num + query_num_limit),
            ]),
          ])
        )
        .orderBy("created_at")
        .execute();

      console.log("getCommentsRes", getCommentsRes);
      if (getCommentsRes.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comments not found",
        });
      }

      return nestComments(getCommentsRes, parent_id);
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/getRepliedComments
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return JSON.stringify(
    await trpc.messages.getRepliedComments.query({
      post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
      // parent_id: "c0395394-365c-4f1b-b079-2efd01cb751c",
      // parent_id: "1259e113-6412-4b95-84b0-b13e6453eaaa",
      parent_id: null,
      begin_comment_num: 0,
      query_num_limit: 3,
      start_level: 0,
      query_depth: null
    }),
    null,
    2
  )
}
