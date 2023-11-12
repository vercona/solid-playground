import { Show, catchError, createEffect, createResource, onMount } from "solid-js";
import { createDeepSignal } from "@solid-primitives/resource";
import {  getPostAndComments } from "../apiCalls/CommentSectionCalls";
import { RouterOutputs, trpc } from "../utils/api";
import Comment from "../components/Comment";
import { useParams } from "@solidjs/router";

// type Post = RouterOutputs["getPost"];
type PostAndComments = RouterOutputs["getPostAndComments"];

const Post = () => {
  const params = useParams();
  // const [testApi] = createResource(async () => {
  //   const response = await fetch(
  //     "https://testapi.devtoolsdaily.com/countries?iso3=USAD"
  //   );
  //   return response.json();
  // });
  // const [singlePost, { mutate: setSinglePost }] = createResource<PostAndComments, string>(
  //   params.postId,
  //   getPostAndComments,
  //   // async (postId) => trpc.getPostAndComments.query({post_id: postId}),
  //   // { storage: createDeepSignal },
  // );
  const [singlePost, { mutate: setSinglePost }] = createResource<
    // PostAndComments,
    any,
    string
  >(
    params.postId,
    async (postId) => {
      console.log("params", params.post_id)
      try{
        return getPostAndComments(postId);
      }catch(err: any){
        console.log("err", err.message)
        return new Error((err as any).message);
        // throw err;
        // return err;
      }
    },
    // {}
  );

  createEffect(() => {
    // console.log("testApi", testApi());
    // console.log("testApi error", testApi.error)
      console.log("inside createEffect error", singlePost.error);
      console.log("singlePost response", singlePost());
  });

  // console.log("singlePost error", singlePost.error);


  return (
    <div class="w-full h-full p-5">
      <Show when={singlePost() && singlePost()?.post}>
        <div class="text-xl font-medium">{singlePost()!.post.title}</div>
        <div>{singlePost()!.post.description}</div>
      </Show>
      <Show when={singlePost() && singlePost()?.comments}>
        <Comment comments={singlePost()!.comments} />
      </Show>
      <Show when={singlePost.error}>
        <div class="text-xl">ERROR??</div>
      </Show>
      {/* <Show when={!!singlePost().message}>
        <div class="text-xl">ERROR??</div>
      </Show> */}
      {/* <Show when={testApi.error}>
        <div class="text-xl">ERROR??</div>
      </Show> */}
    </div>
  );
};

export default Post;
