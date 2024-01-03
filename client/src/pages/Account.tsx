import { ErrorBoundary, Show, createResource, createSignal } from "solid-js";
import { getUser, updateUser } from "../apiCalls/AuthCalls";
import { Navigate, useSearchParams } from "@solidjs/router";
import { formatErrorUrl } from "../utils/utilFunctions";
import type { GetUser, ErrorType } from "../utils/interfaces";
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
    const [user, {mutate}] = createResource<GetUser>(getUser);
    const [params] = useSearchParams();
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
        <Show when={params.type && params.type === "signup"}>
          <div class="text-cyan-400 max-w-xl text-center py-4">
            Welcome to Vercona! We have automatically generated an username for
            you. If you would like to change your username now, you can do so.
            You can always change it later as well.
          </div>
        </Show>
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
