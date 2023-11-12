// Solid Imports
import { Show, createResource, ErrorBoundary } from "solid-js";
import { useParams } from "@solidjs/router";

// API Imports
import { RouterOutputs } from "../utils/api";
import { getPostAndComments } from "../apiCalls/CommentSectionCalls";
type PostAndComments = RouterOutputs["getPostAndComments"];

// Local Imports
import Comment from "../components/Comment";


const Post = () => {
  const params = useParams();

  const [
    singlePost, 
    { mutate: setSinglePost }
  ] = createResource<PostAndComments, string>(
    params.postId,
    async (postId) => {
      return getPostAndComments(postId);
    }
  );

  return (
    <div class="w-full h-full p-5">
      <p>Error: {''+!!singlePost.error}</p>

      <ErrorBoundary fallback={<div>ERROR: {singlePost.error.message} </div>}>

        <Show when={singlePost() && singlePost()?.post}>
          <div class="text-xl font-medium">{singlePost()!.post.title}</div>
          <div>{singlePost()!.post.description}</div>
        </Show>
        
        <Show when={singlePost() && singlePost()?.comments}>
          <Comment comments={singlePost()!.comments} />
        </Show>

      </ErrorBoundary>
    </div>
  );
};

export default Post;
