import { createResource, createRoot, createSignal, onMount } from "solid-js";
import { Location } from "@solidjs/router";

import { getAuthTokenFromCookie, getJwtExpirationDate, getRefreshTokenFromCookie, removeAuthTokenFromCookie, storeToken, storeTokenFromUrl } from "./utilFunctions";
import { getUser, refreshSession } from "../apiCalls/AuthCalls";
import { GetUser } from "./interfaces";
import { authTokenCookieName, refreshTokenCookieName } from "./constants";

const authStore = () => {
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

    const refreshToken = async () => {
        try{
            const refreshToken = getRefreshTokenFromCookie()
            const { session }= await refreshSession(refreshToken);
            if(session){
                const authTokenDate = new Date();
                authTokenDate.setDate(authTokenDate.getDate() + 1);
                const expirationDate = session.expires_at ? getJwtExpirationDate(session.expires_at) : authTokenDate;
                storeToken(
                  authTokenCookieName,
                  session.access_token,
                  expirationDate,
                  "Strict"
                );
                setAuthToken(session.access_token);

                const refreshTokenDate = new Date();
                refreshTokenDate.setDate(refreshTokenDate.getDate() + 5);
                storeToken(
                    refreshTokenCookieName,
                    session.refresh_token,
                    refreshTokenDate,
                    "Strict"
                );
                try{
                    const user = await getUser();
                    setUser(user);
                }catch(err){
                    console.log("refreshToken getUser error", err);
                }
            }
        }catch(err){
            console.log("refresh token error", err);
        }
    }

    return { authToken, mutateToken, removeToken, user, refreshToken };
};

export default createRoot(authStore);
