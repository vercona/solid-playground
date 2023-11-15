// Solid Imports
import { Show, createResource, ErrorBoundary, For, createEffect } from "solid-js";
import { unwrap } from "solid-js/store";
import { Navigate, useNavigate, useParams } from "@solidjs/router";

// API Imports
import { getPostAndComments } from "../apiCalls/CommentSectionCalls";

// Local Imports
import Comment from "../components/Comment";
import { errorPageUrl } from "../utils/constants";
import { formatErrorUrl } from "../utils/utilFunctions";
import { Comment as CommentType, PostAndComments, PathArray } from "../utils/interfaces";
import { createDeepSignal } from "@solid-primitives/resource";

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [
    singlePost,
    {mutate}
  ] = createResource<PostAndComments, string>(
    params.postId,
    getPostAndComments,
    {storage: createDeepSignal}
  );

  const addComment = (pathArr: PathArray[], value: CommentType) => {
    if (singlePost() && singlePost()?.comments) {
      const postCopy = JSON.parse(JSON.stringify(singlePost()!.comments))

      let changingObj: CommentType[] = pathArr.reduce((a, c) => a?.[c], postCopy as any)
      changingObj.push(value);
      
      mutate((currentPost) => ({ ...currentPost!, comments: postCopy}));
    }
  };

  createEffect(()=>{
    console.log('wtf',singlePost())
  })

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
                {(comment, index) => <Comment comment={comment} post_id={singlePost()!.post.post_id} pathArr={[index(), "comments"]} addComment={addComment}/>}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Post;
