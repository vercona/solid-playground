import { kyselyDb } from "./kyselyDb";

export const comments_view = kyselyDb
  .selectFrom("comments")
  .select((eb) => [
    "comment_id",
    "level",
    "parent_id",
    eb
      .case()
      .when("is_deleted", "=", true)
      .then("null")
      .else("user_id")
      .end()
      .as("user_id"),
    "post_id",
    "created_at",
    eb
      .case()
      .when("is_deleted", "=", true)
      .then("null")
      .else("content")
      .end()
      .as("content"),
    "likes",
    "dislikes",
    "is_deleted",
    "comment_num",
  ]);

export const commentsViewGetter = async () => {
    return await comments_view.selectAll().execute();
}
