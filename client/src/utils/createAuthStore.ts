import { createRoot, createSignal } from "solid-js";
import { Location } from "@solidjs/router";

import { getAuthTokenFromCookie, removeAuthTokenFromCookie, storeTokenFromUrl } from "./utilFunctions";

const createAuthStore = () => {
    const [authToken, setAuthToken] = createSignal<string>(getAuthTokenFromCookie());

    const mutateToken = (location: Location<unknown>) => {
        storeTokenFromUrl(location);
        setAuthToken(getAuthTokenFromCookie());
    };

    const removeToken = () => {
        removeAuthTokenFromCookie();
        setAuthToken("");
    }

    return { authToken, mutateToken, removeToken };
};

export default createRoot(createAuthStore);
