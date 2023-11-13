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
