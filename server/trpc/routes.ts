// this file can also prob be auto generated/updated

import { router } from "./trpc";
import messages from "./messages";
import auth from "./auth";


export const routes = router({
  messages,
  auth
})



export type Routes = typeof routes;

import type { createTRPCProxyClient } from "@trpc/client";
export type DemoClient = ReturnType<typeof createTRPCProxyClient<Routes>>
