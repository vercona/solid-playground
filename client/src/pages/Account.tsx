import { ErrorBoundary, Show, createResource, createSignal } from "solid-js";
import { getUser, updateUser } from "../apiCalls/AuthCalls";
import { Navigate } from "@solidjs/router";
import { formatErrorUrl } from "../utils/utilFunctions";
import { errorPageUrl } from "../utils/constants";
import type { ErrorType } from "../utils/interfaces";
import CurrentlySending from "../components/CurrentlySending";

const userNameFallBack = () => {
    return(
        <div>Username not found!</div>
    )
};

const usernameLoading = () => {
    return <div>Username loading...</div>;
}

const Account = () => {
    const [user, {mutate}] = createResource(getUser);
    const [usernameInput, setUsernameInput] = createSignal("");
    const [settings, setSettings] = createSignal({
      errorMessage: "",
      successMessage: "",
      isSending: false,
    });

    const submit = async (e: Event) => {
        e.preventDefault();

        setSettings((currentSettings) => ({
          ...currentSettings,
          isSending: true,
        }));
        try{
            const response = await updateUser(usernameInput());

            console.log("response", response);
            const prevUser = user()?.[0] || { user_id: "", created_at: ""};
            mutate([{
                ...prevUser,
                username: response.username
            }]);
            setSettings((currentSettings) => ({
                ...currentSettings,
                errorMessage: "",
                successMessage: "Username changed!",
                isSending: false,
            }));
            setUsernameInput("");
        }catch(err){
            const formattedError = formatErrorUrl(err as ErrorType);
            setSettings((currentSettings) => ({
                ...currentSettings,
                errorMessage: formattedError.errorMessage,
                successMessage: "",
                isSending: false,
            }));
        }
    };

    return (
      <div class="flex flex-col justify-center items-center overflow-hidden h-fullScreen">
        <Show when={!user.loading} fallback={usernameLoading()}>
          <ErrorBoundary
            fallback={() => {
              const { errorMessage, statusCode } = formatErrorUrl(user.error);
              if (statusCode === 401) {
                return <Navigate href="/signin" />;
              }
              return (
                <div class="flex flex-col justify-center items-center">
                  <div class="text-2xl">{statusCode}</div>
                  <div>{errorMessage}</div>
                </div>
              );
            }}
          >
            <Show
              when={user() && user()?.[0].username}
              fallback={userNameFallBack()}
            >
              <div>Username: {user()![0].username}</div>
            </Show>
          </ErrorBoundary>
        </Show>
        <form
          class="flex flex-col justify-center items-center my-10"
          onSubmit={submit}
        >
          <label>Change username</label>
          <input
            type="text"
            class="text-black"
            value={usernameInput()}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <Show when={!settings().isSending} fallback={CurrentlySending()}>
            <input
              type="submit"
              class="btn btn-primary me-2 mt-2"
              value="Submit"
            />
          </Show>
        </form>
        <Show when={settings().errorMessage}>
          <div class="text-red-600">{settings().errorMessage}</div>
        </Show>
        <Show when={settings().successMessage}>
          <div class="text-emerald-400">{settings().successMessage}</div>
        </Show>
      </div>
    );
};

export default Account;
