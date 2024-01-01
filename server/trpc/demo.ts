import type { Routes } from "./routes";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import fs from 'fs'
import { join, extname, dirname } from 'path';


let [ _, scriptPath, apiPath ] = process.argv
let trpcDir = dirname(scriptPath)


if (!apiPath) {
  console.error("Must pass api path (eg: `npm run demo:trpc messages/createPost`).")
  process.exit(1)
}


let ext = extname(apiPath)
if (ext !== '.ts') apiPath = apiPath+'.ts'


let fullPath = join(trpcDir, apiPath);

if (!fs.existsSync(fullPath)) {
  console.error(`Could not find script at: "${fullPath}".`)
  process.exit(1)
}



import url from 'url';
let test = url.pathToFileURL(fullPath).href;

!(async ()=>{
  let apiModule = await import(test) // as any

  if (!apiModule?.demo) {
    console.error(`File "${fullPath}" does not contain a "demo" query.`)
    process.exit(1)
  }

  let query = apiModule.demo
  /* NOTE: 
    we can have other exports for things like headers et al.
    if it necessary or such things to be dynamic.
    `let headers = apiModule.headers`

    Otherwise, it may be best to use `Trial/demo-composable` branch
    which may better to handle crafting unique queries. 
    (ie you can resolve trpc client at runtime which means its easier to edit/update)
  */

  const trpc = createTRPCProxyClient<Routes>({
    links: [
      loggerLink({
        enabled: () => true
      }),
      httpBatchLink({
        url: "http://localhost:8080/trpc",
        async headers() {
          return {
            authorization:
              "eyJhbGciOiJIUzI1NiIsImtpZCI6IjdhMHRLZFozWDJUS2x4OUwiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAzOTA3MDIwLCJpYXQiOjE3MDM5MDM0MjAsImlzcyI6Imh0dHBzOi8vdmNsenVjY3NkcmthdmZtdWdjaXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjQ0NzA0OTQwLTc2OTktNGY3MS1iMmZkLWM3ZWE2YWM0N2E5MyIsImVtYWlsIjoibnNwYW5uNzdAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzAzOTAzNDIwfV0sInNlc3Npb25faWQiOiI1OTg0YjM4MC0yZWU5LTQwODktODNkNi1jNWQ5YTE2Yzc1YWQifQ.b3oZQVhFMcHYR8JQB59IJFuC6EvJMABTuPp0gfmt9K4",
          };
        }
      })
    ]
  })

  const fetchQueries = async () => {
    try {
      const response = await query(trpc)
      console.log("response", response)
    } catch (err) {
      console.log("error", err)
    }
  };

  await fetchQueries()

})()