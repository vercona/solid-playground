import { Show, createResource, createSignal, onMount } from "solid-js";
import { createDeepSignal, createAggregated } from "@solid-primitives/resource";
import { trackStore, trackDeep } from "@solid-primitives/deep";
import { getPost, getPostAndComments } from "../apiCalls/CommentSectionCalls";
import { RouterOutputs, trpc } from "../utils/api";

type Post = RouterOutputs["getPost"];

const Post = () => {
    // const [post, setPost] = createSignal<Post>([{ user_id: '', created_at: '', post_id: '', description: '', title: '' }]);

    // const [postData, {mutate: setItemPost}] = createResource("318fe5eb-b6cc-4519-9410-a28b4a603b98", getPostAndComments);
    const [postData, { mutate: setItemPost }] = createResource<Post, string>(
      "318fe5eb-b6cc-4519-9410-a28b4a603b98",
      getPost,
      { storage: createDeepSignal }
    );

    // const aggregated = deepTrack
    
    
    // onMount(async () => {
    //     const postData = await getPost("318fe5eb-b6cc-4519-9410-a28b4a603b98");
    //     console.log("postData", postData)
    //     setPost(postData);
    // });
    
    const testMutate = () => {
      console.log("postData", postData())
      const newValue = {
        post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
        user_id: "f47bd701-8b9c-412b-a0a7-4fdce781cdf4",
        title: "Changed title",
        description: "Different description",
        created_at: "2023-11-03T21:59:05.000Z",
      };

      setItemPost(() => ([newValue]));
    }

    console.log("postData", postData())
    return (
      <div>
        {/* <div class="text-xl font-medium">{post()[0].title}</div>
        <div>{post()[0].description}</div> */}
        <button onClick={testMutate}>Test mutate</button>
        <Show when={postData()}>
              <div class="text-xl font-medium">{postData()![0].title}</div>
              <div>{postData()![0].description}</div>
        </Show>
      </div>
    );
};

export default Post;
