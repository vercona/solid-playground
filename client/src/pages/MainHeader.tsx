import { Show } from "solid-js";
import { getAuthTokenFromCookie, removeAuthTokenFromCookie } from "../utils/utilFunctions";
import { A } from "@solidjs/router";
import authStore from "../utils/createAuthStore";
import { cookieStorage } from "@solid-primitives/storage";
import { authTokenCookieName } from "../utils/constants";

const MainHeader = () => {
  const { authToken, removeToken } = authStore;
  return (
    <div class="w-full bg-purple-900 h-12 flex items-center justify-end px-4">
      <Show when={!authToken()}>
        <A href="/signin">Sign In</A>
      </Show>
      <Show when={authToken()}>
        <button onClick={() => getAuthTokenFromCookie()} class="px-2">
          Get cookie
        </button>
        <button onClick={() => removeToken()} class="px-2">
          Sign Out
        </button>
        <A href="/account" class="px-2">
          Your Account
        </A>
      </Show>
    </div>
  );
};

export default MainHeader;