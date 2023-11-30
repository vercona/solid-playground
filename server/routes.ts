// import { FastifyInstance } from "fastify";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { sql } from "kysely";
import { eq, isNull, sql as rawDrizzleSqlQuery } from "drizzle-orm";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { db } from "./db";
import { comments, commentsTableName, createCommentInput, createPostInput, createUserInput, deleteComment, getAllCommentsInput, getPost, getPostInput, posts, postsTableName, users, usersTableName } from "./db/schemas";
import { kyselyDb } from "./db/kyselyDb";
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

// interface Comments {
//   user: string;
// }
// const insertUser = async (user: string) => {
//   return db.insert(commentsSchema).values({user});
// };

// async function routes(fastify: FastifyInstance) {
//   fastify.get("/", async () => {
//     const allUsers = await db.select().from(commentsSchema);
//     console.log("test now", allUsers);
//     return { hello: "world" };
//   });
//   fastify.post<{Body: string}>("/addUser", async (request) => {
//     // const allUsers = await db.select().from(applications);
//     // console.log("test", allUsers);
//     // const { } = request.body;
//     const formattedBody: Comments = JSON.parse(request.body);
//     console.log("typeof", typeof formattedBody);
//     console.log("formattedBody", formattedBody);
//     const user = insertUser(formattedBody.user);
//     return { add: "user", user };
//   });
// }

// export default routes;

export const router = t.router;
export const publicProcedure = t.procedure;

interface Comments {
  comment_id: string;
  user: {
    username: string | null;
    user_id: string | null;
  };
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
    // .output(
    //   z.object({
    //     post: getPost,
    //     comments: z.array(CommentsSchema),
    //   })
    // )
    .query(async (req) => {
      const { post_id } = req.input;

      const response = await kyselyDb
        .withRecursive(
          "t(user_id, username, comment_id, content, level, parent_id, comment_num, created_at, is_deleted, max_children_comment_num)",
          db => ( db
            .with('c', comments_view)
              .selectFrom("c")
              .innerJoin("profiles", "profiles.user_id", "c.user_id")
              .leftJoinLateral( db =>
                // it may be better to increment a value on parent for each child insert
                // when you think about what this is doing behind the scenes, its a bit overkill
                // a counter val may be easier to subscribe to later as well
                db.selectFrom("c as child_comments")
                  .select( eb => eb.fn.max("comment_num").as("max_children_comment_num") )
                  .whereRef("child_comments.parent_id", "=", "c.comment_id")
                  .as("get_children"),
                join => join.onTrue()
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
              .where("parent_id", "is", null)
            .unionAll( db => db
              .selectFrom("t")
              .innerJoin("c", "c.parent_id", "t.comment_id")
              .innerJoin("profiles", "profiles.user_id", "c.user_id")
              .leftJoinLateral( db =>
                  db.selectFrom("c as child_comments")
                    .select((eb) => eb.fn.max("comment_num").as("max_children_comment_num"))
                    .whereRef("child_comments.parent_id", "=", "c.comment_id")
                    .as("get_children"),
                join => join.onTrue()
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
            )
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
      // const input = req.input;
      const { parent_id, level, user_id, post_id, content } = req.input;
      // const response = await db
      //   .insert(comments)
      //   .values({ ...input })
      //   .returning()
      // .select()
      // .from(users);

      //OUTPUT Inserted.comment_id, Inserted.user_id, Inserted.post_id, Inserted.level, Inserted.content, Inserted.parent_id, Inserted.likes, Inserted.dislikes, Inserted.created_at
      // const response = await db.execute(
      //   rawDrizzleSqlQuery`
      //     INSERT INTO comments ( level, parent_id, user_id, post_id, content)
      //     OUTPUT Inserted.comment_id, Inserted.user_id, Inserted.post_id, Inserted.level, Inserted.content, Inserted.parent_id, Inserted.likes, Inserted.dislikes, Inserted.created_at
      //     VALUES(${input.level}, ${input.parent_id}, ${input.user_id}, ${input.post_id}, ${input.content});
      //   `
      // );

      // SELECT * FROM comment_row c
      //   LEFT JOIN
      //   profiles p ON p.user_id = c.user_id
      // const response = await db.execute(
      //   rawDrizzleSqlQuery`
      //   with comment_row as (
      //     INSERT INTO comments ( level, parent_id, user_id, post_id, content)
      //     VALUES(${input.level}, ${input.parent_id}, ${input.user_id}, ${input.post_id}, ${input.content})
      //     RETURNING *
      //   )
      //   SELECT json_build_object(
      //     'comment_id', c.comment_id,
      //     'user', json_build_object(
      //       'username', u.username,
      //       'user_id', u.user_id
      //     ),
      //     'body', c.content,
      //     'created_at', c.created_at,
      //     'level', c.level,
      //     'comments', array[]::varchar[]
      //   ) from comment_row c
      //       left join profiles u using(user_id)
      //   `
      // );

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
      // const formattedComment = [response[0].json_build_object];
      return formattedComment;
      // return response;
    }),
  deleteComment: publicProcedure.input(deleteComment).mutation(async (req) => {
    const input = req.input;
    // const response = await db.delete(comments).where(eq(comments.comment_id, input.comment_id)).returning({ deleted_id: comments.comment_id });
    // const response = await db
    //   .update(comments)
    //   .set({ is_deleted: true })
    //   .where(eq(comments.comment_id, input.comment_id))
    //   .returning({ deleted_id: comments.comment_id });
    
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
      // const response = await db
      //   .delete(comments)
      //   .where(eq(comments.comment_id, input.comment_id))
      //   .returning({ comment_id: comments.comment_id });
      // return response;
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
