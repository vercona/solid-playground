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
  const SaitamaId = 'e274ca42-560c-49ef-95ab-c10511fb8412';
  const Baam = "05aaaae2-cfb3-4c0b-9431-f0dc451c4b22";

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
    // const response = await trpc.createUser.mutate({ username: "Baam" });
    // const response = await trpc.getAllUsers.query();
    // const response = await trpc.createPost.mutate({
    //   title: "Third post with Kysley",
    //   description: "This post was created using Kysley",
    //   user_id: SaitamaId,
    // });
    // const response = await trpc.getPost.query({
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    // });
    // const response = await trpc.createComment.mutate({
    //   level: 1,
    //   // parent_id: "ff3729a3-5848-482c-a730-cde859405b03",
    //   parent_id: "e0257a7a-8f56-4b72-beb3-85093faa9f1c",
    //   // parent_id: null,
    //   user_id: Baam,
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    //   // post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b97",
    //   body: "Testing new create with Baam",
    //   // body: "First level comment with Baam",
    // });

    
    const response = await trpc.getPostAndComments.query({
      post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    });

    // const response = await trpc.deleteComment.mutate({
    //   comment_id: "9f1b96dc-fce8-4751-ac9a-ab06c966a820",
    // });

    // const response = await trpc.getRepliedComments.query({
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    //   // parent_id: "c0395394-365c-4f1b-b079-2efd01cb751c",
    //   parent_id: "1259e113-6412-4b95-84b0-b13e6453eaaa",
    //   beginCommentNum: 0,
    //   endCommentNum: 3
    //   // levelLimit: 1
    // });

    console.log("response", response);
    // console.log("response deep", response.comments);
  } catch (err) {
    // console.log("error data", err.data);
    // console.log("error data deep", err.data.zodError.fieldErrors);
    console.log("error", err);
  }
  // console.log("test???")
};

const deleteQuery = async (id: string) => {
  const response = await trpc.removeCommentEntirely.mutate({
    comment_id: id,
  });
  console.log("response", response);
}

fetchQueries();
// deleteQuery("72526561-a3f2-4990-84b1-363ed2e60aab");