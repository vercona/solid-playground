// import { FastifyInstance } from "fastify";
import { eq, isNull, sql } from "drizzle-orm";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { db } from "./db";
import { comments, createCommentInput, createPostInput, createUserInput, deleteComment, getAllCommentsInput, getPost, getPostInput, posts, users } from "./db/schemas";

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
    username: string;
    user_id: string;
  };
  body: string;
  created_at: string;
  level: number;
  comments: Comments[];
}

const CommentsSchema: z.ZodType<Comments> = z.lazy(() =>
  z.object({
    comment_id: z.string(),
    user: z.object({
      username: z.string(),
      user_id: z.string()
    }),
    body: z.string(),
    created_at: z.string(),
    level: z.number(),
    comments: z.array(CommentsSchema),
  })
);

export const routes = router({
  getComment: publicProcedure.query(async () => {
    const allComments = await db.select().from(comments);
    return allComments;
  }),
  getAllUsers: publicProcedure.query(async () => {
    const allUsers = await db.select().from(users);
    return allUsers;
  }),
  createUser: publicProcedure.input(createUserInput).mutation(async (req) => {
    const input = req.input;
    const response = await db
      .insert(users)
      .values({ ...input })
      .returning();
    return response;
  }),
  getPost: publicProcedure.input(getPostInput).query(async (req) => {
    const { post_id } = req.input;
    const allUsers = await db
      .select()
      .from(posts)
      .where(eq(posts.post_id, post_id));
    return allUsers;
  }),
  createPost: publicProcedure.input(createPostInput).mutation(async (req) => {
    const input = req.input;
    const response = await db
      .insert(posts)
      .values({ ...input })
      .returning();
    return response;
  }),
  getPostAndComments: publicProcedure
    .input(getAllCommentsInput)
    .output(
      z.object({
        post: getPost,
        comments: z.array(CommentsSchema),
      })
    )
    .query(async (req) => {
      const { post_id } = req.input;
      //     const getAllCommentsQuery = sql`create or replace function comment_tree (comment_id uuid) returns json as $$
      //   select json_build_object(
      //     'comment_id', c.comment_id,
      //     'user', json_build_object(
      //       'username', u.username,
      //       'user_id', u.user_id
      //     ),
      //     'body', c.content,
      //     'created_at', c.created_at,
      //     'comments', children
      //   )
      //   from comments c
      //     left join profiles u using(user_id),
      //     lateral (
      //       select
      //         coalesce(json_agg(
      //           comment_tree(comments.comment_id)
      //           order by created_at asc
      //         ), '[]') as children
      //       from (
      //         select * from (
      //           SELECT *, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS row_num FROM comments
      //         ) as subquery
      //         -- WHERE row_num = 3
      //         -- CASE WHEN level > 1 WHERE row_num = 3
      //         -- select
      //         --   created_at,
      //         --   user_id,
      //         --   comment_id,
      //         --   content,
      //         --   parent_id,
      //         --   row_number() OVER() AS rownum
      //         -- from comments
      //         -- WHERE rownum < 1
      //         -- LIMIT CASE WHEN 1 = 1 THEN 1 END
      //         -- where level < 2
      //         -- limit 2
      //       ) as comments
      //       where parent_id = c.comment_id
      //     ) as get_children
      //   where
      //     c.comment_id = comment_tree.comment_id
      // $$ language sql stable;`;

      // const getAllCommentsQuery = sql`WITH RECURSIVE t(chain,author_un,text,id) AS (
      //   SELECT ARRAY[comment_id], username, content, comment_id, post_id
      //   FROM comments
      //   INNER JOIN "user" USING (user_id)
      //   UNION ALL
      //     SELECT t.chain||c.comment_id, username, c.content, c.comment_id
      //     FROM t
      //     INNER JOIN comments AS c
      //       ON (t.id = c.parent_id)
      //     INNER JOIN "user"
      //       USING (user_id)
      //   )
      //   SELECT *
      //   FROM t;
      // `;

      // const getAllCommentsQuery = sql`
      //   WITH RECURSIVE t(parent_id, comment_id, content,  level)
      //   AS (
      //     SELECT parent_id, comment_id, content,  0
      //     FROM comments
      //     WHERE parent_id IS NULL
      //     UNION ALL
      //       SELECT comments.parent_id, comments.comment_id, comments.content, t.level+1
      //       FROM t
      //       JOIN comments
      //         ON (comments.parent_id = t.comment_id)
      //   )
      //   SELECT * FROM t;
      // `;

      // const getAllCommentsQuery = sql`
      //   SELECT
      //       pst.post_id
      //       , pstusr.username
      //       , pst.title
      //       , pst.created_at
      //       , cmt.comment_id
      //       , cmt.parent_id
      //       , cmtusr.username
      //       , cmt.content
      //       , cmt.created_at
      //       , cmt.level
      //   FROM
      //       comments cmt
      //       LEFT JOIN "user" as cmtusr ON cmt.user_id = cmtusr.user_id
      //       LEFT JOIN post as pst ON cmt.post_id = pst.post_id
      //       LEFT JOIN "user" as pstusr ON pst.user_id = pstusr.user_id
      //   ORDER BY
      //       cmt.created_at
      // `;

      // const getAllCommentsQuery = sql`SELECT comment_tree('e0257a7a-8f56-4b72-beb3-85093faa9f1c');`;

      // const getAllCommentsQuery = sql`select
      //     coalesce(json_agg(
      //       comment_tree(comment_id)
      //       order by c.created_at asc
      //     ), '[]') as comments
      //   from comments c
      //   WHERE c.parent_id is null AND
      //   c.post_id = ${post_id}
      // `;
    const getAllCommentsQuery = sql`
      select json_build_object(
        'posts', p,
        'comments', parentComment
      )
      from (
        select
          coalesce(json_agg(
            comment_tree(comment_id)
            order by c.created_at asc
          ), '[]') as comments
        from comments c
        WHERE c.parent_id is null AND
        c.post_id = ${post_id}
      ) as parentComment
      LEFT JOIN posts p ON p.post_id = ${post_id}
    `;

      // 'post', json_build_object(
      //   'post_id', p.post_id,
      //   'title', p.title,
      //   'description', p.description,
      //   'created_at', p.created_at
      // ),

      // try{
      const response: any = await db.execute(getAllCommentsQuery);

      if (!response[0].json_build_object.posts){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const formattedResponse = {
        post: response[0].json_build_object.posts,
        comments: response[0].json_build_object.comments.comments,
      };
      return formattedResponse;
      // }catch(err){
      //   console.log("err", err);
      //   return err;
      // }

      // const response = db
      //   .select({
      //     comments: sql`
      //     coalesce(json_agg(
      //       comment_tree(comment_id)
      //       order by comments.created_at asc
      //     ), '[]') as comments`,
      //   })
      //   .from(comment)
      //   .where(isNull(comment.parent_id))
      //   .where(eq(comment.post_id, postId));
    }),
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async (req) => {
      const input = req.input;
      const response = await db
        .insert(comments)
        .values({ ...input })
        // .leftJoin(users, eq(comments.user_id, users.user_id))
        .returning();
      const formattedComment = [{...response[0], comments: []}];
      return formattedComment;
    }),
  deleteComment: publicProcedure
    .input(deleteComment)
    .mutation(async (req) => {
      const input = req.input;
      const response = await db.delete(comments).where(eq(comments.comment_id, input.comment_id)).returning({ deleted_id: comments.comment_id });
      return response;
    })
});

// export default routes;
export type Routes = typeof routes;
