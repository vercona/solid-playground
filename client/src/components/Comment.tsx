import { For, Show, createSignal, createEffect } from "solid-js";
import { destructure } from "@solid-primitives/destructure";
import { calcTimeDifference, getSentTimeMessage } from "../utils/utilFunctions";
import { deleteComment, submitComment } from "../apiCalls/CommentSectionCalls";
import type { Comment as CommentType, PathArray } from "../utils/interfaces";
import ReplyCommentField from "./ReplyCommentField";

interface CommentProps {
  comment: CommentType;
  post_id: string;
  pathArr: PathArray[];
  addComment: (path: PathArray[], value: any) => void;
  deleteCommentFromStore: (pathArr: PathArray[], index: number) => void;
  index: number;
}

const Comment = (props: CommentProps) => {
  const { comment, post_id, pathArr } =
    destructure(props);

  const [commentText, setCommentText] = createSignal('');
  const [settings, setSettings] = createSignal({
    isExpanded: false,
    displayForm: false,
  });

  const timeDifference = calcTimeDifference(
    new Date(),
    new Date(comment().created_at)
  );

  const submitReply = async (e: Event) => {
    e.preventDefault();
    try{
      const response = await submitComment("e274ca42-560c-49ef-95ab-c10511fb8412", post_id(), comment().level + 1, commentText(), comment().comment_id);
      props.addComment(pathArr(), response[0]);
      setSettings((currentSettings) => ({...currentSettings, displayForm: false }));
    }catch(err){
      console.log("submit err", err)
    }
  };

  const handleCommentInput = (textAreaValue: string) => {
    setCommentText(textAreaValue);
  }

  const handleDeleteComment = async () => {
    const index = pathArr()[pathArr().length - 2];
    try{
      if (typeof index === 'number'){
        await deleteComment(comment().comment_id);
        props.deleteCommentFromStore(pathArr(), index);
      }
    }catch(err){
      console.log("delete err", err)
    }
  };

  createEffect(() => {
    console.log("comment().is_deleted", comment().is_deleted);
  });

  console.log("this comment", comment())
  return (
    <li class="py-5">
      <div class="text-xl">
        {!comment().is_deleted ? comment().user.username : "Deleted"}
      </div>
      {!comment().is_deleted && (
        <div>Comment sent {getSentTimeMessage(timeDifference)}</div>
      )}
      <div>
        {!comment().is_deleted
          ? comment().body
          : "This comment has been deleted"}
      </div>
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
        <Show when={!comment().is_deleted}>
          <button
            onClick={handleDeleteComment}
            class="px-2 border-2 mx-2 border-rose-900"
          >
            Delete comment
          </button>
        </Show>
        {/* <button
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
        </button> */}
      </div>
      <Show when={settings().displayForm}>
        <ReplyCommentField
          handleSubmit={submitReply}
          replyText={commentText()}
          username={comment().user.username}
          handleInput={(e) =>
            handleCommentInput((e.target as HTMLInputElement).value)
          }
          handleCancel={() =>
            setSettings((currentSettings) => ({
              ...currentSettings,
              displayForm: false,
            }))
          }
        />
        {/* <form onSubmit={submitReply} class="flex flex-col">
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
        </form> */}
      </Show>
      <Show when={comment().comments.length !== 0}>
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
          <For each={comment().comments}>
            {(comment, index) => (
              <Comment
                comment={comment}
                post_id={post_id()}
                pathArr={[...pathArr(), index(), "comments"]}
                addComment={props.addComment}
                deleteCommentFromStore={props.deleteCommentFromStore}
                index={index()}
              />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
};

export default Comment;
