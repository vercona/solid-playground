import { For, Show, createSignal, type JSX } from "solid-js";
import { RouterOutputs } from "../utils/api";
import { calcTimeDifference, getSentTimeMessage } from "../utils/utilFunctions";
import { submitComment } from "../apiCalls/CommentSectionCalls";

type Comment = RouterOutputs["getPostAndComments"]["comments"][0];

interface CommentProps {
    comment: Comment;
    post_id: string;
}

const Comment = (props: CommentProps) => {
  const { comment, post_id } = props;

  const [commentText, setCommentText] = createSignal('');
  const [settings, setSettings] = createSignal({
    isExpanded: false,
    displayForm: false,
  });

  const timeDifference = calcTimeDifference(
    new Date(),
    new Date(comment.created_at)
  );

  const submitReply: JSX.EventHandler<HTMLFormElement, Event> = (e) => {
    e.preventDefault();
    const response = submitComment("e274ca42-560c-49ef-95ab-c10511fb8412", post_id, comment.level + 1, commentText(), comment.comment_id);
    console.log("comment submission", response);
  };

  const handleCommentInput = (textAreaValue: string) => {
    setCommentText(textAreaValue);
  }

  console.log("comment obj", comment)
  return (
    <li class="py-5">
      <div class="text-xl">{comment.user.username}</div>
      <div>Comment sent {getSentTimeMessage(timeDifference)}</div>
      <div>{comment.body}</div>
      <div>
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
      </div>
      <Show when={settings().displayForm}>
        <form onSubmit={submitReply} class="flex flex-col">
          <label>Replying to {comment.user.username}</label>
          <textarea
            rows={"4"}
            cols={"50"}
            class="bg-black border-2 border-white w-3/4"
            value={commentText()}
            onInput={(e) => handleCommentInput(e.target.value)}
          />
          <div>
            <button
              class="px-2"
              onClick={() =>
                setSettings((currentSettings) => ({
                  ...currentSettings,
                  displayForm: false,
                }))
              }
            >
              Cancel
            </button>
            <input class="py-2" type="submit" value={"Submit"} />
          </div>
        </form>
      </Show>
      <Show when={comment.comments.length !== 0}>
        <button
          onClick={() =>
            setSettings((currentSettings) => ({
              ...currentSettings,
              isExpanded: !currentSettings.isExpanded,
            }))
          }
        >
          {settings().isExpanded ? "-" : "+"}
        </button>
      </Show>
      <Show when={settings().isExpanded}>
        <ul class="ml-5">
          <For each={comment.comments}>
            {(comment) => <Comment comment={comment} post_id={post_id} />}
          </For>
        </ul>
      </Show>
    </li>
  );
};

export default Comment;
