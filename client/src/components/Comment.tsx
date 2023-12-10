import { For, Show, createSignal, createEffect } from "solid-js";
import { destructure } from "@solid-primitives/destructure";
import { calcTimeDifference, formatErrorUrl, getSentTimeMessage } from "../utils/utilFunctions";
import { deleteComment, submitComment } from "../apiCalls/CommentSectionCalls";
import type { Comment as CommentType, ErrorType, PathArray } from "../utils/interfaces";
import ReplyCommentField from "./ReplyCommentField";
import ChildComments from "./ChildComments";

interface CommentProps {
  comment: CommentType;
  post_id: string;
  pathArr: PathArray[];
  addCommentToStore: (
    path: PathArray[],
    value: any,
    type: "submission" | "pagination"
  ) => void;
  deleteCommentFromStore: (pathArr: PathArray[], index: number) => void;
  index: number;
  handleCommentsPagination: (
    commentId: string,
    latestCommentNum: number,
    queryNumLimit: number,
    queryDepth: number,
    pathArr: PathArray[]
  ) => void;
}

const Comment = (props: CommentProps) => {
  const { comment, post_id, pathArr } =
    destructure(props);

  const [commentText, setCommentText] = createSignal('');
  const [settings, setSettings] = createSignal({
    isExpanded: false,
    displayForm: false,
    isLoading: false,
    error: {
      type: '',
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
      props.addCommentToStore(pathArr(), response, "submission");
      setSettings((currentSettings) => ({...currentSettings, displayForm: false }));
    }catch(err){
      // console.log("err", err.data.httpStatus);
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({
        ...settings(),
        error: { display: true, errorMessage: formattedError.errorMessage, type: 'submission' },
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
        props.deleteCommentFromStore(pathArr(), index);
      }
    }catch(err){
      // console.log("delete err", err)
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({...settings(), error: {display: true, errorMessage: formattedError.errorMessage, type: 'deletion'}})
      console.log("formattedError", formattedError);
    }
  };

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
      <Show
        when={
          settings().error.display &&
          (settings().error.type === "submission" ||
            settings().error.type === "deletion")
        }
      >
        <div class="text-red-600">{settings().error.errorMessage}</div>
      </Show>
      <ChildComments
        comments={comment().comments}
        isTopLevelComment={false}
        numOfChildren={comment().num_of_children}
        handleCommentsPagination={() => {
            let latestCommentNum;
            if (comment().comments.length !== 0) {
              latestCommentNum =
                comment().comments[comment().comments.length - 1].row_num;
            } else {
              latestCommentNum = 0;
            }
            return props.handleCommentsPagination(
              comment().comment_id,
              latestCommentNum,
              4,
              comment().level + 1,
              pathArr()
            );
          }
        }
      >
        <ul class="ml-5">
          <For each={comment().comments}>
            {(comment, index) => (
              <Comment
                comment={comment}
                post_id={post_id()}
                pathArr={[...pathArr(), index(), "comments"]}
                addCommentToStore={props.addCommentToStore}
                deleteCommentFromStore={props.deleteCommentFromStore}
                index={index()}
                handleCommentsPagination={props.handleCommentsPagination}
              />
            )}
          </For>
        </ul>
      </ChildComments>
    </li>
  );
};

export default Comment;
