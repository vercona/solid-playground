// Solid Imports
import { Show, createResource, ErrorBoundary, For } from "solid-js";
import { Navigate, useNavigate, useParams } from "@solidjs/router";

// API Imports
import { RouterOutputs } from "../utils/api";
import { getPostAndComments } from "../apiCalls/CommentSectionCalls";
type PostAndComments = RouterOutputs["getPostAndComments"];

// Local Imports
import Comment from "../components/Comment";
import { errorPageUrl } from "../utils/constants";
import { formatErrorUrl } from "../utils/utilFunctions";

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [
    singlePost
  ] = createResource<PostAndComments, string>(
    params.postId,
    getPostAndComments,
  );

  return (
    <ErrorBoundary
      fallback={() => {
        const { errorMessage, statusCode } = formatErrorUrl(singlePost.error);
        return (
          <Navigate
            href={`/${errorPageUrl}?message=${btoa(
              errorMessage
            )}&statusCode=${statusCode}`}
          />
        );
      }}
    >
      <div class="flex flex-col items-center justify-center">
        <div class="max-w-3xl w-full">
          <Show when={singlePost() && singlePost()?.post}>
            <div class="text-xl font-medium">{singlePost()!.post.title}</div>
            <div>{singlePost()!.post.description}</div>
          </Show>

          <Show when={singlePost() && singlePost()?.comments}>
            <ul class="ml-5">
              <For each={singlePost()!.comments}>
                {(comment) => <Comment comment={comment} post_id={singlePost()!.post.post_id}/>}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Post;
