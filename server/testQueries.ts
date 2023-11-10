//@ts-nocheck
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { Routes } from "./routes";

const trpc = createTRPCProxyClient<Routes>({
  links: [
    loggerLink({
      enabled: () => true
    }),
    httpBatchLink({
      url: "http://localhost:8080/trpc",
    }),
  ],
});

const fetchQueries = async () => {
  const BobId = "f47bd701-8b9c-412b-a0a7-4fdce781cdf4";
  const BillyId = "b607935e-07a2-4558-8c55-bc1937dcbd74";
  const SallyId = "cf5bacfd-9aa6-406d-9db0-b65bf02ad491";
  const SaitamaId = "e274ca42-560c-49ef-95ab-c10511fb8412";

  // async function fetchQueries() {
  //   const response = await fetch("http://localhost:8080/");
  // const response = await fetch("http://localhost:8080/addUser", {
  //     method: "POST",
  //     body: JSON.stringify({user: "BOB2"})
  // });
  //   const formattedResponse = await response.json();
  //   console.log(formattedResponse);
  try {
    // const response = await trpc.getComment.query();
    // const response = await trpc.createUser.mutate({ username: "Saitama" });
    // const response = await trpc.getAllUsers.query();
    // const response = await trpc.createPost.mutate({
    //   title: "Post by Billy",
    //   userId: "b607935e-07a2-4558-8c55-bc1937dcbd74",
    // });
    // const response = await trpc.getPost.query({
    //   id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    // });
    // const response = await trpc.createComment.mutate({
    //   level: 2,
    //   parent_id: "c0395394-365c-4f1b-b079-2efd01cb751c",
    //   user_id: SallyId,
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    //   content: "What are your goals?",
    // });
    const response = await trpc.getPostAndComments.query({
      post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    });
    console.log("response", response);
    // console.log("response", response.comments[0].user);
    // console.log("response2", response[0]);

  } catch (err) {
    console.log("error", err);
  }
  // console.log("test???")
};

fetchQueries();
