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

export const submitComment = async (user_id: string, post_id: string, level: number, content: string, parent_id: string | null = null) => {
  return trpc.createComment.mutate({user_id, post_id, level, content, parent_id});
};

export const deleteComment = async (comment_id: string) => {
  return trpc.deleteComment.mutate({ comment_id });
};
