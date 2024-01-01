import { destructure } from "@solid-primitives/destructure";
import { Navigate, Outlet, Route, useLocation, useNavigate } from "@solidjs/router";
import { Component, createEffect } from "solid-js";
import authStore from "../utils/createAuthStore";

interface ProtectedRouteProps {
    path: string;
    component: Component;
}

const RouteGuard = () => {
    // const {path, component} = destructure(props);
    const { authToken } = authStore;
    const navigate = useNavigate();

    createEffect(() => {
        if(!authToken()){
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
