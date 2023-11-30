//@ts-nocheck
import { SelectQueryBuilder } from "kysely";
import { initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { commentsTableName, createCommentInput, createPostInput, createUserInput, deleteComment, getAllCommentsInput, getPostInput, postsTableName, usersTableName } from "./db/schemas";
import { kyselyDb, KyselyDatabase } from "./db/kyselyDb";
import { comments_view } from "./db/views";

export const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});


export const router = t.router;
export const publicProcedure = t.procedure;

interface Comments {
  comment_id: string;
  username: string | null;
  user_id: string | null;
  body: string | null;
  created_at: string;
  level: number;
  is_deleted: boolean;
  comment_num: number;
  maximum_child_comment_num: number | null;
  comments: Comments[];
}

const CommentsSchema: z.ZodType<Comments> = z.lazy(() =>
  z.object({
    comment_id: z.string(),
    user: z.object({
      username: z.string().nullable(),
      user_id: z.string().nullable()
    }),
    body: z.string().nullable(),
    created_at: z.string(),
    level: z.number(),
    is_deleted: z.boolean(),
    comment_num: z.number(),
    maximum_child_comment_num: z.number().nullable(),
    comments: z.array(CommentsSchema),
  }).refine((comment) => {
    if(comment.is_deleted){
      return (
        comment.body === null &&
        comment.user.user_id === null &&
        comment.user.username === null
      );
    }else {
      return (
        typeof comment.body === "string" &&
        typeof comment.user.user_id === "string" &&
        typeof comment.user.username === "string"
      );
    }
  })
);

export const routes = router({
  getComment: publicProcedure.query(async () => {
    const allComments = await kyselyDb
      .selectFrom(commentsTableName)
      .selectAll()
      .execute();
    return allComments;
  }),
  getAllUsers: publicProcedure.query(async () => {
    const allUsers = await kyselyDb
      .selectFrom(usersTableName)
      .selectAll()
      .execute();
    return allUsers;
  }),
  createUser: publicProcedure.input(createUserInput).mutation(async (req) => {
    const input = req.input;
    const response = await kyselyDb
      .insertInto(usersTableName)
      .values({ ...input })
      .returningAll()
      .executeTakeFirstOrThrow()
    return response;
  }),
  getPost: publicProcedure.input(getPostInput).query(async (req) => {
    const { post_id } = req.input;
    const postRes = await kyselyDb
      .selectFrom(postsTableName)
      .selectAll()
      .where("post_id", "=", post_id)
      .execute();
    return postRes;
  }),
  createPost: publicProcedure.input(createPostInput).mutation(async (req) => {
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
  }),
  getPostAndComments: publicProcedure
    .input(getAllCommentsInput)
    .query(async (req) => {
      const { post_id } = req.input;

      function reusable<TB extends keyof KyselyDatabase, O>(qb:SelectQueryBuilder<KyselyDatabase, TB, O>) {
        return qb
          .innerJoin("profiles", "profiles.user_id", "c.user_id")
          .leftJoinLateral(
            (db) =>
              // it may be better to increment a value on parent for each child insert
              // when you think about what this is doing behind the scenes, its a bit overkill
              // a counter val may be easier to subscribe to later as well
              db.selectFrom("c as child_comments")
                .select((eb) =>
                  eb.fn.max("comment_num").as("max_children_comment_num")
                )
                .whereRef("child_comments.parent_id", "=", "c.comment_id")
                .as("get_children"),
            (join) => join.onTrue()
          )
          .select([
            "profiles.user_id",
            "profiles.username",
            
            "c.comment_id",
            "c.content",
            "c.level",
            "c.parent_id",
            "c.comment_num",
            "c.created_at",
            "c.is_deleted",

            "get_children.max_children_comment_num",
          ])
      }

      const response = await kyselyDb
        .withRecursive(
          "t(user_id, username, comment_id, content, level, parent_id, comment_num, created_at, is_deleted, max_children_comment_num)",
          (db) => db
            .with('c', ()=>comments_view)
            .selectFrom("c")
              .$call(reusable)
              .where("parent_id", "is", null)
            .unionAll( db =>
              db.selectFrom("t")
                .innerJoin("c", "c.parent_id", "t.comment_id")
                .$call(reusable)
            )
        )
        .selectFrom("t")
        .selectAll()
        .execute()

      return response
    }),
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async (req) => {
      const { parent_id, level, user_id, post_id, content } = req.input;
      const response = await kyselyDb
        .with('comment_row', (withQuery) => withQuery
          .insertInto("comments")
          .values({
            level,
            parent_id,
            user_id,
            post_id,
            content
          })
          .returning(['comment_id', 'content', 'level', 'created_at', 'user_id'])
        ).selectFrom('comment_row')
        .leftJoin('profiles as users', (join) => join.onRef("users.user_id", '=', 'comment_row.user_id'))
        .select(['comment_id', "content", "level", "comment_row.created_at", "users.user_id", "users.username"])
        .execute()

      const innerResponse = response[0];
      const formattedComment = [
        {
          comment_id: innerResponse.comment_id,
          user: {
            user_id: innerResponse.user_id,
            username: innerResponse.username,
          },
          body: innerResponse.content,
          created_at: innerResponse.created_at,
          level: innerResponse.level,
          comments: [],
        },
      ];

      return formattedComment;
    }),
  deleteComment: publicProcedure.input(deleteComment).mutation(async (req) => {
    const input = req.input;
    const response = await kyselyDb
      .updateTable(commentsTableName)
      .set({ is_deleted: true })
      .where("comment_id", "=", input.comment_id)
      .returning("comment_id")
      .execute()
    return response;
  }),
  removeCommentEntirely: publicProcedure
    .input(deleteComment)
    .mutation(async (req) => {
      const input = req.input;

      const response = await kyselyDb
        .deleteFrom("comments")
        .where('comments.comment_id', '=', input.comment_id)
        .returning("comment_id")
        .execute()
      return response;
    }),
});

// export default routes;
export type Routes = typeof routes;
