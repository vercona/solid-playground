// import { FastifyInstance } from "fastify";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { sql, SelectQueryBuilder, QueryCreator } from "kysely";
import { eq, isNull, sql as rawDrizzleSqlQuery } from "drizzle-orm";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { db } from "./db";
import { comments, commentsTableName, createCommentInput, createPostInput, createUserInput, deleteComment, getAllCommentsInput, getPost, getPostInput, posts, postsTableName, users, usersTableName } from "./db/schemas";
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

interface GetComments extends KyselyDatabase {
  c: KyselyDatabase["comments"];
  t: KyselyDatabase["comments"] & {
    user_id: string | null;
    username: string;
    max_child_comment_num: number | null;
  };
}

const reusable = (qb: SelectQueryBuilder<GetComments, "c", {}>) =>
  qb
    .leftJoin("profiles", "profiles.user_id", "c.user_id")
    .leftJoinLateral(
      (eb) =>
        eb
          .selectFrom("c as child_comments")
          .select((eb) =>
            eb.fn.max("comment_num").as("max_child_comment_num")
          )
          .whereRef("child_comments.parent_id", "=", "c.comment_id")
          .as("get_children"),
      (jb) => jb.onTrue()
    )
    .select([
      "profiles.user_id",
      "profiles.username",

      "c.comment_id",
      "c.body",
      "c.level",
      "c.parent_id",
      "c.comment_num",
      "c.created_at",
      "c.is_deleted",

      "get_children.max_child_comment_num",
      "c.likes",
      "c.dislikes"
    ]);

interface FlatComment {
  comment_id: string;
  username: string | null;
  user_id: string | null;
  max_child_comment_num: number | null;
  parent_id: string | null;
};

// lmao this typing
type Test<J extends FlatComment> = Omit<J, "user_id" | "username"> & {
  user: { user_id: J['user_id'], username: J['username'] },
  comments: Test<J>[]
}

const nestComments = <T extends FlatComment>(initCommentArr: T[], parent_id:null|string=null) : Test<T>[]  => {
  const comments = initCommentArr.filter(eachComment => eachComment.parent_id === parent_id);

  return comments.map(comment => {
    const { user_id, username, ...formattedComment } = comment;

    let childComments = comment.max_child_comment_num === null ? [] : nestComments(initCommentArr, comment.comment_id)

    return {
      ...formattedComment,
      user: { user_id, username },
      comments: childComments
    }
  })
}

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
  created_at: Date;
  level: number;
  is_deleted: boolean;
  comment_num: number;
  max_child_comment_num: number | null;
  likes: number;
  dislikes: number;
  comments: Comments[];
  // parent_id: string | null;
};

const CommentsSchema: z.ZodType<Comments> = z.lazy(() =>
  z.object({
    comment_id: z.string(),
    user: z.object({
      username: z.string().nullable(),
      user_id: z.string().nullable()
    }),
    body: z.string().nullable(),
    created_at: z.date(),
    level: z.number(),
    is_deleted: z.boolean(),
    comment_num: z.number(),
    max_child_comment_num: z.number().nullable(),
    likes: z.number(),
    dislikes: z.number(),
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
    .output(
      z.object({
        post: getPost,
        comments: z.array(CommentsSchema),
      })
    )
    .query(async (req) => {
      const { post_id } = req.input;
      const getCommentsRes = await kyselyDb
        .withRecursive(
          "t(user_id, username, comment_id, body, level, parent_id, comment_num, created_at, is_deleted, max_child_comment_num, likes, dislikes)",
          (db: QueryCreator<GetComments>) =>
            db
              .with("c", comments_view)
              .selectFrom("c")
              .$call(reusable)
              .where("parent_id", "is", null)
              .where("post_id", "=", post_id)
              // .where("comment_num", "<", 3)
              .unionAll((db) =>
                db
                  .selectFrom("t")
                  .innerJoin("c", "c.parent_id", "t.comment_id")
                  .$call(reusable)
                  .where("c.comment_num", "<", 10)
              )
        )
        .selectFrom("t")
        .selectAll()
        .orderBy("created_at")
        .execute();

      const getPostsAndUsersRes = await kyselyDb
          .selectFrom("posts")
          .innerJoin("profiles", "posts.user_id", "profiles.user_id")
          .select(["posts.created_at", "description", "profiles.user_id", "username", "title", "post_id"])
          .where("post_id", '=', post_id)
          .execute()

      console.log("getPostsAndUsersRes", getPostsAndUsersRes);
      if (getPostsAndUsersRes.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const nestedComments = nestComments(getCommentsRes) as Comments[]
      
      const {user_id, username, created_at, title, description} = getPostsAndUsersRes[0];
      return {
        post: {
          post_id: getPostsAndUsersRes[0].post_id,
          description,
          title,
          created_at,
          user: {
            user_id,
            username
          }
        },
        comments: nestedComments
      };
    }),
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async (req) => {
      const { parent_id, level, user_id, post_id, body, comment_num } = req.input;

      const response = await kyselyDb
        .with('comment_row', (withQuery) => withQuery
          .insertInto("comments")
          .values({
            level,
            parent_id,
            user_id,
            post_id,
            body,
            comment_num
          })
          .returning(['comment_id', 'body', 'level', 'created_at', 'user_id', 'likes', 'dislikes', 'comment_num', 'is_deleted'])
        ).selectFrom('comment_row')
        .leftJoin('profiles as users', (join) => join.onRef("users.user_id", '=', 'comment_row.user_id'))
        .select(['comment_id', "body", "level", "comment_row.created_at", "users.user_id", "users.username", 'likes', 'dislikes', 'comment_num', 'is_deleted'])
        .execute()

      const innerResponse = response[0];
      const formattedComment = [
        {
          comment_id: innerResponse.comment_id,
          user: {
            user_id: innerResponse.user_id,
            username: innerResponse.username,
          },
          body: innerResponse.body,
          created_at: innerResponse.created_at,
          level: innerResponse.level,
          comment_num: innerResponse.comment_num,
          likes: innerResponse.likes,
          dislikes: innerResponse.dislikes,
          max_child_comment_num: null,
          is_deleted: innerResponse.is_deleted,
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
