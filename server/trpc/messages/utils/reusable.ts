import { GetComments } from './nested'
import { SelectQueryBuilder } from "kysely";



export const reusable = (qb: SelectQueryBuilder<GetComments, "c", {}>) =>
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
