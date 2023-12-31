import { SelectQueryBuilder, QueryCreator } from "kysely";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import {
  commentsTableName,
  createCommentInput,
  createPostInput,
  createUserInput,
  deleteComment,
  getAllCommentsInput,
  getRepliedComments,
  getPost,
  getPostInput,
  postsTableName,
  usersTableName,
} from "../db/schemas";
import { kyselyDb, KyselyDatabase } from "../db/kyselyDb";
import { comments_view } from "../db/views";

interface GetComments extends KyselyDatabase {
  c: KyselyDatabase["comments"] & { row_num: number };
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
          .select((eb) => eb.fn.max("comment_num").as("max_child_comment_num"))
          .whereRef("child_comments.parent_id", "=", "c.comment_id")
          .as("get_children"),
      (jb) => jb.onTrue()
    )
    .select(({ fn, eb }) => [
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
      "c.dislikes",
      "c.num_of_children",
      fn
        .agg<number>("row_number")
        .over((e) => e.partitionBy("c.parent_id").orderBy("c.comment_num"))
        .as("row_num"),
    ]);

interface FlatComment {
  comment_id: string;
  username: string | null;
  user_id: string | null;
  body: string | null;
  created_at: Date;
  level: number;
  is_deleted: boolean;
  comment_num: number;
  max_child_comment_num: number | null;
  likes: number;
  dislikes: number;
  parent_id: string | null;
  num_of_children: number;
  row_num: number;
}

const nestComments = (
  initCommentArr: FlatComment[],
  parent_id: null | string = null
): Comments[] => {
  const comments = initCommentArr.filter(
    (eachComment) => eachComment.parent_id === parent_id
  );

  return comments.map((comment) => {
    const { user_id, username, row_num, ...formattedComment } = comment;

    let childComments =
      comment.max_child_comment_num === null
        ? []
        : nestComments(initCommentArr, comment.comment_id);

    return {
      ...formattedComment,
      user: { user_id, username },
      row_num: Number(row_num),
      comments: childComments,
    };
  });
};

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
  num_of_children: number;
  row_num: number;
  comments: Comments[];
}

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

const messageRoutes = router({
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
      .executeTakeFirstOrThrow();
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
  getRepliedComments: publicProcedure
    .input(getRepliedComments)
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
    }),
  createComment: publicProcedure
    .input(createCommentInput)
    .mutation(async (req) => {
      const { parent_id, level, user_id, post_id, body } = req.input;

      const response = await kyselyDb
        .with("comment_pagination", (withQuery) => {
          if (parent_id && level !== 0) {
            return withQuery
              .updateTable("comments")
              .set((eb) => ({
                num_of_children: eb("num_of_children", "+", 1),
              }))
              .where("comment_id", "=", parent_id)
              .returningAll();
          } else {
            return withQuery
              .updateTable("posts")
              .set((eb) => ({
                num_of_children: eb("num_of_children", "+", 1),
              }))
              .where("post_id", "=", post_id)
              .returningAll();
          }
        })
        .with("insert_comment", (withQuery) =>
          withQuery
            .insertInto("comments")
            .values(({ ref, selectFrom }) => ({
              parent_id,
              level,
              user_id,
              post_id,
              body,
              num_of_children: 0,
              comment_num: selectFrom("comment_pagination").select((eb) => [
                eb("num_of_children", "-", 1).as("comment_num"),
              ]),
            }))
            .returningAll()
        )
        .selectFrom("insert_comment")
        .leftJoin("profiles as users", (join) =>
          join.onRef("users.user_id", "=", "insert_comment.user_id")
        )
        .select([
          "comment_id",
          "body",
          "level",
          "insert_comment.created_at",
          "users.user_id",
          "users.username",
          "likes",
          "dislikes",
          "comment_num",
          "is_deleted",
          "num_of_children",
        ])
        .execute();

      console.log("response", response);
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
          num_of_children: innerResponse.num_of_children,
          row_num: -1,
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
      .execute();

    if (response.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comment not found",
      });
    }

    return response;
  }),
  removeCommentEntirely: publicProcedure
    .input(deleteComment)
    .mutation(async (req) => {
      const input = req.input;
      const response = await kyselyDb
        .deleteFrom("comments")
        .where("comments.comment_id", "=", input.comment_id)
        .returning("comment_id")
        .execute();
      return response;
    }),
});

export default messageRoutes;
