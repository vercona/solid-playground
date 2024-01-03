import { createResource, createRoot, createSignal, onMount } from "solid-js";
import { Location } from "@solidjs/router";

import { getAuthTokenFromCookie, removeAuthTokenFromCookie, storeTokenFromUrl } from "./utilFunctions";
import { getUser } from "../apiCalls/AuthCalls";
import { GetUser } from "./interfaces";

const createAuthStore = () => {
    const [authToken, setAuthToken] = createSignal<string>(getAuthTokenFromCookie());
    const [user, setUser] = createSignal<GetUser>([]);

    // console.log("authstored??", authToken());

    onMount(async () => {
        const user = await getUser();
        setUser(user);
        console.log("on mount user", user)
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
    }

    return { authToken, mutateToken, removeToken, user };
};

export default createRoot(createAuthStore);

// /#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IjdhMHRLZFozWDJUS2x4OUwiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA0MjY0MDM1LCJpYXQiOjE3MDQyNjA0MzUsImlzcyI6Imh0dHBzOi8vdmNsenVjY3NkcmthdmZtdWdjaXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjQ0NzA0OTQwLTc2OTktNGY3MS1iMmZkLWM3ZWE2YWM0N2E5MyIsImVtYWlsIjoibnNwYW5uNzdAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzA0MjYwNDM1fV0sInNlc3Npb25faWQiOiI3NzJkZTg0Yy02ZmYzLTQ5NmEtOGEzZS05OTMzMmExYmVjNDcifQ.Bxi_qOOwlBSQ2hSLSL-LEZBItsQlq-9dhtLQ_3oUZ_4&expires_at=1704264035&expires_in=3600&refresh_token=0jkGZfCsd_Td_4YmCcGeaA&token_type=bearer&type=magiclink