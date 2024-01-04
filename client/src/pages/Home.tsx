import { For, createResource } from "solid-js";
import { getAllPosts } from "../apiCalls/CommentSectionCalls";
import PostHeadline from "../components/PostHeadline";

const Home = () => {
  const [posts] = createResource(getAllPosts);

  return (
    <div class="flex flex-col justify-center items-center">
      <For each={posts()}>
        {(post) => (
          <PostHeadline title={post.title} post_id={post.post_id} username={post.username}/>
        )}
      </For>
    </div>
  );
};

export default Home;
