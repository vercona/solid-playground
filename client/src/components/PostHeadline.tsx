import { destructure } from "@solid-primitives/destructure";
import { A } from "@solidjs/router";

interface PostHeadlineProps {
    title: string;
    post_id: string;
    username: string;
}


const PostHeadline = (props: PostHeadlineProps) => {
    const {title, post_id, username} = destructure(props);
    return (
      <div class="flex flex-col justify-end items-end py-5 px-2">
        <A href={`/posts/${post_id()}`} class="text-xl">
          {title()}
        </A>
        <div>- posted by {username()}</div>
      </div>
    );
}

export default PostHeadline;
