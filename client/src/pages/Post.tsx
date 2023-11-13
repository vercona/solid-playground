// Solid Imports
import { Show, createResource, ErrorBoundary } from "solid-js";
import { Navigate, useNavigate, useParams } from "@solidjs/router";

// API Imports
import { RouterOutputs } from "../utils/api";
import { getPostAndComments } from "../apiCalls/CommentSectionCalls";
type PostAndComments = RouterOutputs["getPostAndComments"];

// Local Imports
import Comment from "../components/Comment";
import ErrorPage from "../components/ErrorPage";
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
        fallback={error => {
          const { errorMessage, statusCode, errorStack } = formatErrorUrl(error);
          const from = btoa(location.toString())
          return (
            <Navigate
              href={`/${errorPageUrl}?message=${btoa(errorMessage)}&statusCode=${statusCode}&stack=${btoa(''+errorStack)}&from=${from}`}
            />
          );
        }}
      >
        <div class="w-full h-full p-5">
            <Show when={singlePost() && singlePost()?.post}>
              <div class="text-xl font-medium">{singlePost()!.post.title}</div>
              <div>{singlePost()!.post.description}</div>
            </Show>

            <Show when={singlePost() && singlePost()?.comments}>
              <Comment comments={singlePost()!.comments} />
            </Show>
        </div>
      </ErrorBoundary>
  );
};

export default Post;
