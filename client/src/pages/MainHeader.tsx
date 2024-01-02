import { Show } from "solid-js";
import { A } from "@solidjs/router";
import authStore from "../utils/createAuthStore";

const MainHeader = () => {
  const { authToken, removeToken } = authStore;
  return (
    <div class="w-full flex flex-row bg-purple-900 h-12">
      <div class="w-1/2 flex items-center justify-start px-4">
        <A href="/">Home</A>
      </div>
      <div class="w-1/2 flex items-center justify-end px-4">
        <Show when={!authToken()}>
          <A href="/signin">Sign In</A>
        </Show>
        <Show when={authToken()}>
          <button onClick={() => removeToken()} class="px-2">
            Sign Out
          </button>
          <A href="/account" class="px-2">
            Your Account
          </A>
        </Show>
      </div>
    </div>
  );
};

export default MainHeader;