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


export function CMDL_IIF(cb:any, cmdl:boolean) {
  !(async ()=>{
    if (cmdl) {
        try {
          const response = await cb()
          console.log("response", response)
        } catch (err) {
          console.log("error", err)
        }
    }
  })()
} 
