import { comments } from "../../db/schemas";


/***   INPUT   ***/
import { createInsertSchema } from "drizzle-zod";
const createCommentInput = createInsertSchema(comments).pick({
  parent_id: true,
  level: true,
  post_id: true,
  body: true,
});


/***   Query   ***/
import { kyselyDb } from "../../db/kyselyDb";
import { protectedProcedure } from "../trpc";
export default protectedProcedure
    .input(createCommentInput)
    .mutation(async (req) => {
      const { parent_id, level, post_id, body } = req.input;
      const user_id = req.ctx.user.id;

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


/***   Demo   ***/
// npm run demo:trpc messages/createComment
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  const Baam = "05aaaae2-cfb3-4c0b-9431-f0dc451c4b22";
  return Promise.all([ 
    // Root comment
    trpc.messages.createComment.mutate({
      level: 0,
      parent_id: null,
      post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
      body: "Protected procedure comment with Baam",
    }),

    // Child comment
    // trpc.messages.createComment.mutate({
    //   level: 1,
    //   parent_id: "e0257a7a-8f56-4b72-beb3-85093faa9f1c",
    //   user_id: Baam,
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    //   body: "Testing new create with Baam",
    // })
  ])
}
