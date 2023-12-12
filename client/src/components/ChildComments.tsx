import { For, JSX, Show, createSignal } from "solid-js";
import type {
  Comment as CommentType,
  ErrorType
} from "../utils/interfaces";
import { destructure } from "@solid-primitives/destructure";
import { formatErrorUrl } from "../utils/utilFunctions";

interface ChildCommentsProps {
  comments: CommentType[];
  children: JSX.Element;
  handleCommentsPagination: () => void;
  isTopLevelComment: boolean;
  numOfChildren: number;
};

const ChildComments = (props: ChildCommentsProps) => {
    const { comments, isTopLevelComment, numOfChildren } = destructure(props);
    const [settings, setSettings] = createSignal({
        isExpanded: false,
        isLoading: false,
        error: {
            display: false,
            errorMessage: "",
        },
    });

    const handleLoadMoreComments = async () => {
        setSettings((currentSettings) => ({
          ...currentSettings,
          isLoading: true,
        }));
        try{
            await props.handleCommentsPagination();
            setSettings((currentSettings) => ({
              ...currentSettings,
              isLoading: false,
            }));
        }catch(err){
            const formattedError = formatErrorUrl(err as ErrorType);
            setSettings((currentSettings) => ({
              ...currentSettings,
              isLoading: false,
              error: {
                display: true,
                errorMessage: formattedError.errorMessage,
              },
            }));
        }
    }

    const handleExpand = async () => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        isExpanded: !currentSettings.isExpanded,
      }));
      if(comments().length === 0){
        await handleLoadMoreComments();
      }
    };

    return (
      <>
        <Show when={numOfChildren() && !isTopLevelComment()}>
          <button onClick={handleExpand}>
            {settings().isExpanded ? "-" : "+"}
          </button>
        </Show>
        <Show when={settings().isExpanded || isTopLevelComment()}>
          {props.children}
          <Show
            when={
              comments().length < numOfChildren() &&
              !settings().isLoading
            }
          >
            <div class="ml-5">
              <button onClick={handleLoadMoreComments}>
                Load more comments
              </button>
            </div>
          </Show>
          <Show when={settings().isLoading}>
            <div>Loading...</div>
          </Show>
          <Show when={settings().error.display}>
            <div class="text-red-600">{settings().error.errorMessage}</div>
          </Show>
        </Show>
      </>
    );
};

export default ChildComments;
