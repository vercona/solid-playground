import { KyselyDatabase } from "../../../db/kyselyDb";

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

export interface Comments {
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

export interface GetComments extends KyselyDatabase {
  c: KyselyDatabase["comments"] & { row_num: number };
  t: KyselyDatabase["comments"] & {
    user_id: string | null;
    username: string;
    max_child_comment_num: number | null;
  };
}

export const nestComments = (
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