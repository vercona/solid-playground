import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { type inferRouterOutputs } from "@trpc/server";

import type { Routes } from "../../../server/trpc/routes";

const getBaseUrl = () => {
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:8080`;
};

export const trpc = createTRPCProxyClient<Routes>({
  links: [
    loggerLink({
      enabled: () => import.meta.env.DEV,
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

export type RouterOutputs = inferRouterOutputs<Routes>;
