import { trpc } from "../utils/api";

export const getPostAndComments = async (post_id: string) => {
  // try{
    const response = await trpc.getPostAndComments.query({
      post_id,
    });

    console.log("response??", response)

    return response;
  // }catch(err: any){
  //   console.log("error response", err);
  //   console.log("error message", err.message);

  //   return err;
  // }
};

export const getPost = async (post_id: string) => {
    const response = await trpc.getPost.query({
      post_id,
    });
    return response;
};
