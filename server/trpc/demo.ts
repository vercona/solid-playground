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


  const trpc = createTRPCProxyClient<Routes>({
    links: [
      loggerLink({
        enabled: () => true
      }),
      httpBatchLink({
        url: "http://localhost:8080/trpc",
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