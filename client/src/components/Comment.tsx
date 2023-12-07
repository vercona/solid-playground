import { For, Show, createSignal, createEffect } from "solid-js";
import { destructure } from "@solid-primitives/destructure";
import { calcTimeDifference, formatErrorUrl, getSentTimeMessage } from "../utils/utilFunctions";
import { deleteComment, submitComment } from "../apiCalls/CommentSectionCalls";
import type { Comment as CommentType, ErrorType, PathArray } from "../utils/interfaces";
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
    error: {
      display: false,
      errorMessage: ''
    }
  });

  const timeDifference = calcTimeDifference(
    new Date(),
    new Date(comment().created_at)
  );

  const submitReply = async (e: Event) => {
    e.preventDefault();
    try{
      const response = await submitComment(
        "e274ca42-560c-49ef-95ab-c10511fb8412",
        post_id(),
        // "",
        // "e0257a7a-8f56-4b72-beb3-85093faa9f10",
        comment().level + 1,
        commentText(),
        comment().comment_id
        // "e0257a7a-8f56-4b72-beb3-85093faa9f10"
      );
      props.addComment(pathArr(), response[0]);
      setSettings((currentSettings) => ({...currentSettings, displayForm: false }));
    }catch(err){
      // console.log("err", err.data.httpStatus);
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({
        ...settings(),
        error: { display: true, errorMessage: formattedError.errorMessage },
      });
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
        // await deleteComment("e0257a7a-8f56-4b72-beb3-85093faa9f10");
        // await deleteComment("");
        props.deleteCommentFromStore(pathArr(), index);
      }
    }catch(err){
      // console.log("delete err", err)
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({...settings(), error: {display: true, errorMessage: formattedError.errorMessage}})
      console.log("formattedError", formattedError);
    }
  };

  // createEffect(() => {
  //   console.log("comment().is_deleted", comment().is_deleted);
  // });

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
      </Show>
      <Show when={settings().error.display}>
        <div class="text-red-600">{settings().error.errorMessage}</div>
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
