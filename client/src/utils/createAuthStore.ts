import { createResource, createRoot, createSignal, onMount } from "solid-js";
import { Location } from "@solidjs/router";

import { getAuthTokenFromCookie, removeAuthTokenFromCookie, storeTokenFromUrl } from "./utilFunctions";
import { getUser } from "../apiCalls/AuthCalls";
import { GetUser } from "./interfaces";

const createAuthStore = () => {
    const [authToken, setAuthToken] = createSignal<string>(getAuthTokenFromCookie());
    const [user, setUser] = createSignal<GetUser>([]);

    onMount(async () => {
        if (getAuthTokenFromCookie()){
            const user = await getUser();
            setUser(user);
        }
    });

    const mutateToken = async (location: Location<unknown>) => {
        const authToken = storeTokenFromUrl(location);
        setAuthToken(authToken);
        const user = await getUser();
        setUser(user);
    };

    const removeToken = () => {
        removeAuthTokenFromCookie();
        setAuthToken("");
        setUser([]);
    }

    return { authToken, mutateToken, removeToken, user };
};

export default createRoot(createAuthStore);
