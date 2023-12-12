import { users, posts, comments } from "../../db/schemas";
import type { GetComments } from './utils/nested'



import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
const userSchema = createSelectSchema(users)
  .omit({ created_at: true });

const getPost = createSelectSchema(posts)
  .omit({user_id: true})
  .extend({ 
    created_at: z.date(), 
    user: userSchema 
  });

const getAllCommentsInput = createSelectSchema(comments)
  .pick({ post_id: true })
  .extend({ 
    limitChildRowNum: z.number(), 
    limitLevel: z.number() 
  });

const CommentsSchema: z.ZodType<Comments> = z.lazy(() =>
  z
    .object({
      comment_id: z.string(),
      user: z.object({
        username: z.string().nullable(),
        user_id: z.string().nullable(),
      }),
      body: z.string().nullable(),
      created_at: z.date(),
      level: z.number(),
      is_deleted: z.boolean(),
      comment_num: z.number(),
      max_child_comment_num: z.number().nullable(),
      likes: z.number(),
      dislikes: z.number(),
      num_of_children: z.number(),
      row_num: z.number(),
      comments: z.array(CommentsSchema),
    })
    .refine((comment) => {
      if (comment.is_deleted) {
        return (
          comment.body === null &&
          comment.user.user_id === null &&
          comment.user.username === null
        );
      } else {
        return (
          typeof comment.body === "string" &&
          typeof comment.user.user_id === "string" &&
          typeof comment.user.username === "string"
        );
      }
    })
);



import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { QueryCreator } from "kysely";
import { kyselyDb } from "../../db/kyselyDb";
import { comments_view } from "../../db/views";
import { reusable } from './utils/reusable'
import { nestComments, Comments } from './utils/nested'

export default (
  publicProcedure
    .input(getAllCommentsInput)
    .output(
      z.object({
        post: getPost,
        comments: z.array(CommentsSchema),
      })
    )
    .query(async (req) => {
      const { post_id, limitChildRowNum, limitLevel } = req.input;
      const getCommentsRes = await kyselyDb
        .withRecursive(
          "t(user_id, username, comment_id, body, level, parent_id, comment_num, created_at, is_deleted, max_child_comment_num, likes, dislikes, num_of_children, row_num)",
          (db: QueryCreator<GetComments>) =>
            db
              .with("c", comments_view)
              .selectFrom("c")
              .$call(reusable)
              .where("parent_id", "is", null)
              .where("post_id", "=", post_id)
              // .where("row_num", "<", 3)
              // .where("comment_num", "<", 2)
              .unionAll(
                (db) =>
                  db
                    .selectFrom("t")
                    .innerJoin("c", "c.parent_id", "t.comment_id")
                    .$call(reusable)
                // .where(sql`row_num::integer` as any, "<", 3)
                // .where("c.comment_num", "<", 10)
                // .where("c.comment_num", ">", 2)
              )
        )
        .selectFrom("t")
        .selectAll()
        .where((eb) =>
          eb.or([
            eb.and([
              eb("level", "=", 0),
              // eb("row_num", "<=", 2),
            ]),
            eb.and([
              eb("level", ">", 0),
              eb("level", "<=", limitLevel),
              // can add "greater than row N" for pagination start location
              eb("row_num", "<=", limitChildRowNum),
            ]),
          ])
        )
        .orderBy("created_at")
        .execute();

      const getPostsAndUsersRes = await kyselyDb
        .selectFrom("posts")
        .innerJoin("profiles", "posts.user_id", "profiles.user_id")
        .select([
          "posts.created_at",
          "description",
          "profiles.user_id",
          "username",
          "title",
          "post_id",
          "num_of_children",
        ])
        .where("post_id", "=", post_id)
        .execute();

      if (getPostsAndUsersRes.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const nestedComments = nestComments(getCommentsRes);

      const {
        user_id,
        username,
        created_at,
        title,
        description,
        num_of_children,
      } = getPostsAndUsersRes[0];

      return {
        post: {
          post_id: getPostsAndUsersRes[0].post_id,
          description,
          title,
          created_at,
          num_of_children,
          user: {
            user_id,
            username,
          },
        },
        comments: nestedComments,
      };
    })
)