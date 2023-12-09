// Solid Imports
import { Show, createResource, ErrorBoundary, For, createEffect, Signal, createSignal } from "solid-js";
import type {
  ResourceSource,
  ResourceFetcher,
  InitializedResource,
  Resource,
} from "solid-js";
import { Navigate, useNavigate, useParams } from "@solidjs/router";
import { createDeepSignal } from "@solid-primitives/resource";
import { createStore, reconcile, unwrap } from "solid-js/store";
import type { Store, SetStoreFunction } from "solid-js/store";

// API Imports
import { getPostAndComments, submitComment } from "../apiCalls/CommentSectionCalls";

// Local Imports
import Comment from "../components/Comment";
import { errorPageUrl } from "../utils/constants";
import { formatErrorUrl } from "../utils/utilFunctions";
import { Comment as CommentType, PostAndComments, PathArray, ErrorType } from "../utils/interfaces";
import ReplyCommentField from "../components/ReplyCommentField";

function resourceStore<T, S>(watcher:ResourceSource<S>, fetcher:ResourceFetcher<S, T, unknown>, options={}) {
  const [store, setStore] = createStore<PostAndComments[]>([]);

  function toSignal<T>(v?: T) { 
    return ([
      () => store[0],
      (update: T) => (
        setStore(0, reconcile(typeof update === "function" ? update(unwrap(store[0])) : v))
      )
    ] as Signal<T | undefined>)
  }

  const [ status, { refetch } ] = createResource<T, S>(
    watcher,
    fetcher,
    { ...options, storage: toSignal }
  )

  return [status, { mutate: setStore, refetch }] as [Resource<T>, {mutate:  SetStoreFunction<T[]>, refetch: typeof refetch}]
}

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = createSignal("");
  const [settings, setSettings] = createSignal({
    displayForm: false,
    error: {
      display: false,
      errorMessage: "",
    },
  });

  const [singlePost, { mutate }] = resourceStore<PostAndComments, string>(
    params.postId,
    getPostAndComments
  );

  const addComment = (pathArr: PathArray[], value: CommentType[]) => {
    if (singlePost() && singlePost()?.comments) {
      mutate(0, "comments", ...(pathArr as []), (existing: CommentType[]) => [
        ...existing,
        ...value,
      ]);
    }
  };

  // Soft Delete
  const deleteCommentFromStore = (pathArr: PathArray[], index: number) => {
    const pathToComment = pathArr.slice(0, -1);
    if (singlePost() && singlePost()?.comments) {
      mutate(0, "comments", ...(pathToComment as []), (existing) => ({
        ...existing,
        body: null,
        user: { user_id: null, username: null },
        is_deleted: true,
      }));
    }
  };

  const submitReply = async (e: Event) => {
    e.preventDefault();
    try {
      if(singlePost() && singlePost()?.post){
        const response = await submitComment(
          "e274ca42-560c-49ef-95ab-c10511fb8412",
          singlePost()!.post.post_id,
          0,
          commentText()
        );

        addComment([], response);
        setSettings((currentSettings) => ({
          ...currentSettings,
          displayForm: false,
        }));
      }
    } catch (err) {
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({
        ...settings(),
        error: { display: true, errorMessage: formattedError.errorMessage },
      });
    }
  };

  const handleCommentInput = (textAreaValue: string) => {
    setCommentText(textAreaValue);
  };

  // createEffect(() => {
  //   console.log("singlePost()", singlePost());
  //   console.log("singlePost() error", singlePost.error);

  //   // console.log("singlePost isPending", singlePost.loading);
  //   // console.log("singlePost latest", singlePost.latest);
  // });

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
            <button
              class="py-2"
              onClick={() =>
                setSettings((currentSettings) => ({
                  ...currentSettings,
                  displayForm: !currentSettings.displayForm,
                }))
              }
            >
              Reply
            </button>
            <Show when={settings().displayForm}>
              <ReplyCommentField
                replyText={commentText()}
                username={singlePost()!.post.user.username}
                handleSubmit={submitReply}
                handleCancel={() =>
                  setSettings((currentSettings) => ({
                    ...currentSettings,
                    displayForm: false,
                  }))
                }
                handleInput={(e) =>
                  handleCommentInput((e.target as HTMLInputElement).value)
                }
              />
            </Show>
          </Show>
          <Show when={settings().error.display}>
            <div class="text-red-600">{settings().error.errorMessage}</div>
          </Show>

          <Show when={singlePost() && singlePost()?.comments}>
            <ul class="ml-5">
              <For each={singlePost()!.comments}>
                {(comment, index) => (
                  <Comment
                    comment={comment}
                    post_id={singlePost()!.post.post_id}
                    pathArr={[index(), "comments"]}
                    addComment={addComment}
                    deleteCommentFromStore={deleteCommentFromStore}
                    index={index()}
                  />
                )}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Post;
