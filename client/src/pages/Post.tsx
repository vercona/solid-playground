// Solid Imports
import { Show, createResource, ErrorBoundary, For, createEffect } from "solid-js";
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
      const postCopy = JSON.parse(JSON.stringify(singlePost()!.comments)) as CommentType[];
      // console.log("postCopy before", postCopy)
      let changingObj: CommentType[] | CommentType = postCopy;

      // console.log("changingObj", changingObj);
      for (let i = 0; i <= pathArr.length - 1; i++) {
        var elem = pathArr[i];
        // if(i === 0 && elem === 'comments'){
        //   const newObj = changingObj['comments'] as CommentType[];
        //   changingObj = changingObj[elem];
        // }
        if (typeof elem === "number" && Array.isArray(changingObj)) {
          changingObj = changingObj[elem];
        } else if (
          elem === "comments" &&
          "comments" in changingObj
        ) {
          changingObj = changingObj[elem];
        }
        // if (!changingObj[elem]) changingObj[elem] = {};
        // changingObj = changingObj[elem];
      }

      // console.log("pathArr[pathArr.length - 2]", pathArr[pathArr.length - 2]);
      // console.log("Array.isArray(changingObj)", Array.isArray(changingObj));
      if (Array.isArray(changingObj)) {
        changingObj.push(value);
        mutate((currentPost) => ({ ...currentPost!, comments: postCopy}));
      }
      
      // console.log("path", pathArr);
      // console.log("value", value);
      // console.log("changeObj", changingObj);
      // console.log("postCopy", postCopy);
    }
    // changingObj[pathArr[pathArr.length - 1]] = value;
  };

  createEffect(() => {
    // console.log("singlePost()", singlePost());
    // console.log("singlePost isPending", singlePost.loading);
    // console.log("singlePost latest", singlePost.latest);
  });

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
