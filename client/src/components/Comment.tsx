import { For, Show, createSignal } from "solid-js";
import { RouterOutputs } from "../utils/api";

type Comments = RouterOutputs["getPostAndComments"]["comments"];

interface CommentProps {
    comments: Comments
}

const Comment = (props: CommentProps) => {
    const { comments } = props;
    let isLevelZero = false;
    if(comments.length !== 0 && comments[0].level === 0){
        isLevelZero = true;
    }
    const [isExpanded, setIsExpanded] = createSignal(isLevelZero ? true : false);

    return (
      <>
        <Show when={!isLevelZero && comments.length !== 0}>
          <button onClick={() => setIsExpanded(!isExpanded())}>
            {isExpanded() ? "-" : "+"}
          </button>
        </Show>
        <Show when={isExpanded() && comments.length !== 0}>
          <ul class="ml-5">
            <For each={comments}>
              {(comment, index) => (
                <li class={`${index() !== 0 ? "mt-7" : ""}`}>
                  <div class="text-xl">{comment.user.username}</div>
                  <div>{comment.body}</div>
                  <Show when={comment.comments}>
                      <Comment comments={comment.comments} />
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </>
    );
};

export default Comment;
