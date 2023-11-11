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
              {(comment, index) => {
                const calcDate = (date1: Date, date2: Date) => {
                  const diff = Math.floor(date1.getTime() - date2.getTime());

                  const minutes = Math.floor(diff / (1000 * 60));
                  const hours = Math.floor((minutes / 60));
                  const days = Math.floor(hours / 24);
                  const weeks = Math.floor(days/7);
                  const months = Math.floor(days / 30.4167);
                  const years = Math.floor(months / 12);

                  return {
                    minutes,
                    hours,
                    days,
                    weeks,
                    months,
                    years
                  };
                }

                const { minutes, hours, days, weeks, months, years } = calcDate(
                  new Date(),
                  new Date(comment.created_at)
                );

                const singularOrPluralMessage = (
                  message: string,
                  num: number
                ) => {
                  return num === 1 ? message : `${message}s`;
                };

                const getSentTimeMessage = () => {
                  if (minutes < 1) {
                    return `just now`;
                  } else if (hours <= 0) {
                    return `${minutes} ${singularOrPluralMessage(
                      "minute",
                      minutes
                    )} ago`;
                  } else if (days <= 0) {
                    return `${hours} ${singularOrPluralMessage(
                      "hour",
                      hours
                    )} ago`;
                  } else if (weeks <= 0) {
                    return `${days} ${singularOrPluralMessage(
                      "day",
                      days
                    )} ago`;
                  } else if (months <= 0) {
                    return `${weeks} ${singularOrPluralMessage(
                      "week",
                      weeks
                    )} ago`;
                  } else if (years <= 0) {
                    return `${months} ${singularOrPluralMessage(
                      "month",
                      months
                    )} ago`;
                  } else {
                    return `${years} ${singularOrPluralMessage(
                      "year",
                      years
                    )} ago`;
                  }
                }

                return (
                  <li class={`${index() !== 0 ? "mt-7" : ""}`}>
                    <div class="text-xl">{comment.user.username}</div>
                    <div>Comment sent {getSentTimeMessage()}</div>
                    <div>{comment.body}</div>
                    <Show when={comment.comments}>
                      <Comment comments={comment.comments} />
                    </Show>
                  </li>
                );
              }}
            </For>
          </ul>
        </Show>
      </>
    );
};

export default Comment;
