import { For, Show, createSignal, type JSX } from "solid-js";
import { RouterOutputs } from "../utils/api";
import { calcTimeDifference, getSentTimeMessage } from "../utils/utilFunctions";
import { deleteComment, submitComment } from "../apiCalls/CommentSectionCalls";
import type { Comment as CommentType, PathArray } from "../utils/interfaces";

interface CommentProps {
  comment: CommentType;
  post_id: string;
  pathArr: PathArray[];
  addComment: (path: PathArray[], value: any) => void;
}

const Comment = (props: CommentProps) => {
  const { comment, post_id, pathArr, addComment } = props;

  const [commentText, setCommentText] = createSignal('');
  const [settings, setSettings] = createSignal({
    isExpanded: false,
    displayForm: false,
  });

  const timeDifference = calcTimeDifference(
    new Date(),
    new Date(comment.created_at)
  );

  const submitReply: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault();
    try{
      const response = await submitComment("e274ca42-560c-49ef-95ab-c10511fb8412", post_id, comment.level + 1, commentText(), comment.comment_id);
      console.log("respnse", response);
      // addComment(pathArr, response[0]);
      setSettings((currentSettings) => ({...currentSettings, displayForm: false }));
    }catch(err){

    }
  };

  const handleCommentInput = (textAreaValue: string) => {
    setCommentText(textAreaValue);
  }

  const handleDeleteComment = () => {
    const response = deleteComment(comment.comment_id);
    console.log("delete comment", response);
  };

  console.log("comment obj", comment)
  // console.log("pathArr", pathArr);
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
        <button
          onClick={handleDeleteComment}
          class="px-2 border-2 mx-2 border-rose-900"
        >
          Delete comment
        </button>
        <button
          onClick={() =>
            addComment(pathArr, {
              comment_id: "bad05359-daa0-4528-a858-9ce85d1015e6",
              user: {
                username: "TESTING USERNAME",
                user_id: "f47bd701-8b9c-412b-a0a7-4fdce781cdf4",
              },
              body: "TESTING COMMENT",
              created_at: "2023-11-03T23:23:02.031723",
              level: 9000,
              comments: [],
            })
          }
          class="px-2 border-2 mx-2 border-rose-900"
        >
          Test addcomment
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
            {(comment, index) => (
              <Comment
                comment={comment}
                post_id={post_id}
                pathArr={[...pathArr, index(), "comments"]}
                addComment={addComment}
              />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
};

export default Comment;
