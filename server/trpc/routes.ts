// this file can also prob be auto generated/updated

import { router } from "./trpc";
import messages from "./messages";



export const routes = router({
  messages
})



export type Routes = typeof routes;

import type { createTRPCProxyClient } from "@trpc/client";
export type DemoClient = ReturnType<typeof createTRPCProxyClient<Routes>>