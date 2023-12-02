import { trpc } from "../utils/api";

export const getPostAndComments = async (post_id: string) => {
    const response = await trpc.getPostAndComments.query({
      post_id,
    });

    return response;
};

export const getPost = async (post_id: string) => {
    const response = await trpc.getPost.query({
      post_id,
    });
    return response;
};

export const submitComment = async (user_id: string, post_id: string, level: number, body: string, comment_num: number, parent_id: string | null = null) => {
  return trpc.createComment.mutate({user_id, post_id, level, body, parent_id, comment_num});
};

export const deleteComment = async (comment_id: string) => {
  return trpc.deleteComment.mutate({ comment_id });
};
