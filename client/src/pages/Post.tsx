import { Show, createResource, createSignal, onMount } from "solid-js";
import { createDeepSignal, createAggregated } from "@solid-primitives/resource";
import { trackStore, trackDeep } from "@solid-primitives/deep";
import { getPost, getPostAndComments } from "../apiCalls/CommentSectionCalls";
import { RouterOutputs, trpc } from "../utils/api";
import Comment from "../components/Comment";
import { useParams } from "@solidjs/router";

// type Post = RouterOutputs["getPost"];
type PostAndComments = RouterOutputs["getPostAndComments"];

const Post = () => {
  const params = useParams();
  const [singlePost, { mutate: setSinglePost }] = createResource<PostAndComments, string>(
    params.postId,
    getPostAndComments,
    { storage: createDeepSignal }
  );

  return (
    <div class="w-full h-full p-5">
      <Show when={singlePost() && singlePost()?.post}>
        <div class="text-xl font-medium">{singlePost()!.post.title}</div>
        <div>{singlePost()!.post.description}</div>
      </Show>
      <Show when={singlePost() && singlePost()?.comments}>
          <Comment comments={singlePost()!.comments} />
      </Show>
    </div>
  );
};

export default Post;
