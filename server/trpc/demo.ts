import type { Routes } from "./routes";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";

export const demoTRPC = createTRPCProxyClient<Routes>({
  links: [
    loggerLink({
      enabled: () => true
    }),
    httpBatchLink({
      url: "http://localhost:8080/trpc",
    })
  ]
})
