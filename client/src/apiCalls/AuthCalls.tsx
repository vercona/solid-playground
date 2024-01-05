import { trpc } from "../utils/api";

export const magicEmailLinkLogin = async (email: string) => {
    return await trpc.auth.passwordlessLogin.query({ email });
};

export const getUser = async () => {
    return await trpc.auth.getUser.query();
};

export const updateUser = async (username: string) => {
    return await trpc.auth.updateUser.mutate({ username });
};

export const refreshSession = async (refresh_token: string) => {
    return await trpc.auth.refreshSession.query({ refresh_token });
};
