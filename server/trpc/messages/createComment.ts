import { comments } from "../../db/schemas";



import { createInsertSchema } from "drizzle-zod";
const createCommentInput = createInsertSchema(comments).omit({
  comment_id: true,
  dislikes: true,
  likes: true,
  created_at: true,
  comment_num: true
});



import { kyselyDb } from "../../db/kyselyDb";
import { publicProcedure } from "../trpc";
export default publicProcedure
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
    })