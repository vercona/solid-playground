// Solid Imports
import { Show, createResource, ErrorBoundary, For, createEffect, Signal } from "solid-js";
import { Navigate, useNavigate, useParams } from "@solidjs/router";

// API Imports
//import { getPostAndComments } from "../apiCalls/CommentSectionCalls";

// Local Imports
import Comment from "../components/Comment";
import { errorPageUrl } from "../utils/constants";
import { formatErrorUrl } from "../utils/utilFunctions";
import { Comment as CommentType, PostAndComments, PathArray } from "../utils/interfaces";
//import { createDeepSignal } from "@solid-primitives/resource";

import { createStore, reconcile, unwrap } from "solid-js/store";

import { trpc } from "../utils/api";

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();

  //let thing;
  
  // function createDeepSignal<T>(): Signal<T | undefined>;
  // function createDeepSignal<T>(value: T): Signal<T>;
  // function createDeepSignal<T>(v?: T): Signal<T> {
  //   const [store, setStore] = createStore([v]);
  //   //thing = setStore
  //   return [
  //     () => store[0],
  //     (update: T, path:[]=[]) => (
  //       setStore(...[0, ...path], reconcile(typeof update === "function" ? update(unwrap(store[0])) : v)), store[0]
  //     ),
  //   ] as Signal<T>;
  // }

  const [store, setStoreTmp] = createStore<PostAndComments[]>([]);
  let getStore = (...args: Array<string|number>)=>{ 
    if(!args.length) return store[0] 
    
    // @ts-ignore
    return args.reduce((a, c) => a?.[c], store[0]) as any
  }
  // @ts-ignore breaks typing... maybe just keep the 0...
  let setStore = (...args:Array<any>) => setStoreTmp(0, ...args) //typeof setStoreTmp
  const getPostAndComments = async (post_id: string) => {
    const response = await trpc.getPostAndComments.query({
      post_id,
    });
    setStore(response)
  };

  const [ status ] = createResource<void, string>(
    params.postId,
    getPostAndComments
    //()=>setStore(getPostAndComments())
  )

  const addComment = (pathArr: PathArray[], value: CommentType) => {
    if (getStore() && getStore()?.comments) {
      setStore('comments', ...pathArr, [
        value,
        ...(getStore('comments', ...pathArr) as CommentType[])
      ])
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
