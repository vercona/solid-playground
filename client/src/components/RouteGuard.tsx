import { Outlet, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import authStore from "../utils/createAuthStore";
import { getRefreshTokenFromCookie } from "../utils/utilFunctions";

const RouteGuard = () => {
    const { authToken, refreshToken } = authStore;
    const navigate = useNavigate();

    createEffect(() => {
        if (!authToken() && getRefreshTokenFromCookie()) {
            refreshToken();
        }else if (!authToken() && !getRefreshTokenFromCookie()) {
          navigate("/signin", { replace: true });
        }
    });

    return (
        <>
            <Outlet />
        </>
    );
};

export default RouteGuard;
