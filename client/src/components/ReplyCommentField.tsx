interface ReplyCommentFieldProps {
  handleSubmit: (e: Event) => void;
  username: string;
  replyText: string;
  handleInput: (e: InputEvent) => void;
  handleCancel: () => void;
}

const ReplyCommentField = (props: ReplyCommentFieldProps) => {
  return (
    <form onSubmit={props.handleSubmit} class="flex flex-col">
      <label>Replying to {props.username}</label>
      <textarea
        rows={"4"}
        cols={"50"}
        class="bg-black border-2 border-white w-3/4"
        value={props.replyText}
        onInput={props.handleInput}
      />
      <div>
        <button
          class="px-2"
          onClick={props.handleCancel}
        >
          Cancel
        </button>
        <input class="py-2" type="submit" value={"Submit"} />
      </div>
    </form>
  );
};

export default ReplyCommentField;
