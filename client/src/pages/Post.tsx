// Solid Imports
import { Show, createResource, ErrorBoundary, For, createEffect, Signal } from "solid-js";
import { Navigate, useNavigate, useParams } from "@solidjs/router";

// API Imports
import { getPostAndComments } from "../apiCalls/CommentSectionCalls";

// Local Imports
import Comment from "../components/Comment";
import { errorPageUrl } from "../utils/constants";
import { formatErrorUrl } from "../utils/utilFunctions";
import { Comment as CommentType, PostAndComments, PathArray } from "../utils/interfaces";
//import { createDeepSignal } from "@solid-primitives/resource";

import { createStore } from "solid-js/store";

import type { ResourceSource, ResourceFetcher, Resource } from "solid-js";
function resourceStore<T, S>(watcher:ResourceSource<S>, fetcher:ResourceFetcher<S, T|void, unknown>) {
  const [store, setStoreTmp] = createStore<PostAndComments[]>([]);
  let getStore = (...args: Array<string|number>)=>{ 
    if(!args.length) return store[0] 
    
    // @ts-ignore
    return args.reduce((a, c) => a?.[c], store[0]) as any
  }
  // @ts-ignore breaks typing... maybe just keep the 0...
  let setStore = (...args:Array<any>) => setStoreTmp(0, ...args) //typeof setStoreTmp

  const [ status ] = createResource<void, S>(
    watcher,
    async (v, r)=>{setStore(await fetcher(v, r))}
  )

  return [getStore, setStore, status] as [
    (...args: Array<string|number>)=>any,
    (...args: Array<any>)=>any,
    Resource<void>
  ]
}

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();

  let [getStore, setStore, status] = resourceStore<PostAndComments, string>(params.postId, getPostAndComments)
  
  const addComment = (pathArr: PathArray[], value: CommentType) => {
    if (getStore() && getStore()?.comments) {
      setStore('comments', ...pathArr, (existing: CommentType[])=>[value, ...existing])
    }
  };

  return (
    <ErrorBoundary
      fallback={() => {
        const { errorMessage, statusCode } = formatErrorUrl(status.error);
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
