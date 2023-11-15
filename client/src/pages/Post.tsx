// Solid Imports
import { Show, createResource, ErrorBoundary, For, createEffect, Signal, Accessor, Setter } from "solid-js";
import { Navigate, useNavigate, useParams } from "@solidjs/router";

// API Imports
import { getPostAndComments } from "../apiCalls/CommentSectionCalls";

// Local Imports
import Comment from "../components/Comment";
import { errorPageUrl } from "../utils/constants";
import { formatErrorUrl } from "../utils/utilFunctions";
import { Comment as CommentType, PostAndComments, PathArray } from "../utils/interfaces";
//import { createDeepSignal } from "@solid-primitives/resource";

import { createStore, reconcile, unwrap } from "solid-js/store";
import type { Store, SetStoreFunction } from "solid-js/store";
  
  
import type { ResourceSource, ResourceFetcher, InitializedResource, Resource } from "solid-js";
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

  let [getStore, { mutate }] = resourceStore<PostAndComments, string>(params.postId, getPostAndComments)
  
  const addComment = (pathArr: PathArray[], value: CommentType) => {
    if (getStore() && getStore()?.comments) {
      mutate(0, 'comments', ...(pathArr as []), (existing: CommentType[])=>[value, ...existing])
    }
  };

  return (
    <ErrorBoundary
      fallback={() => {
        const { errorMessage, statusCode } = formatErrorUrl(getStore.error);
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
          <Show when={getStore() && getStore()?.post}>
            <div class="text-xl font-medium">{getStore()!.post.title}</div>
            <div>{getStore()!.post.description}</div>
          </Show>

          <Show when={getStore() && getStore()?.comments}>
            <ul class="ml-5">
              <For each={getStore()!.comments}>
                {(comment, index) => <Comment comment={comment} post_id={getStore()!.post.post_id} pathArr={[index(), "comments"]} addComment={addComment}/>}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Post;
