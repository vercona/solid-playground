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
    //   content: "Testing deletion",
    // });
    const response = await trpc.getPostAndComments.query({
      post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    });
    // const response = await trpc.deleteComment.mutate({
    //   comment_id: "59004931-dd9e-49b8-882c-2af43d9d19b3",
    // });
    console.log("response", response);
    console.log("response 0", response.comments[0].comments);
  //   sponse 0 [
  // {
  //   comment_id: '9d410560-3c7b-468c-a126-096e8eaeddff',
  //   user: {
  //     username: 'Sally',
  //     user_id: 'cf5bacfd-9aa6-406d-9db0-b65bf02ad491'
  //   },
  //   body: 'Second level by Sally',
  //   created_at: '2023-11-03T22:59:16.740412',
  //   level: 1,
  //   is_deleted: false,
  //   comments: []
  // },
  // {
  //   comment_id: '1e6da183-8058-432e-b065-e6d0b9e0a46b',
  //   user: {
  //     username: 'Billy',
  //     user_id: 'b607935e-07a2-4558-8c55-bc1937dcbd74'
  //   },
  //   body: 'Second level by Billy',
  //   created_at: '2023-11-03T23:22:05.879602',
  //   level: 1,
  //   is_deleted: false,
  //   comments: []
  // },
  // {
  //   comment_id: '9f1b96dc-fce8-4751-ac9a-ab06c966a826',
  //   user: {
  //     username: 'Saitama',
  //     user_id: 'e274ca42-560c-49ef-95ab-c10511fb8412'
  //   },
  //   body: 'Testing this comment',
  //   created_at: '2023-11-18T00:04:50.405305',
  //   level: 1,
  //   is_deleted: true,
  //   comments: []
  // }
// {
//     comment_id: '9d410560-3c7b-468c-a126-096e8eaeddff',
//     user: {
//       username: 'Sally',
//       user_id: 'cf5bacfd-9aa6-406d-9db0-b65bf02ad491'
//     },
//     body: 'Second level by Sally',
//     created_at: '2023-11-03T22:59:16.740412',
//     level: 1,
//     is_deleted: false,
//     comments: []
//   },
//   {
//     comment_id: '1e6da183-8058-432e-b065-e6d0b9e0a46b',
//     user: {
//       username: 'Billy',
//       user_id: 'b607935e-07a2-4558-8c55-bc1937dcbd74'
//     },
//     body: 'Second level by Billy',
//     created_at: '2023-11-03T23:22:05.879602',
//     level: 1,
//     is_deleted: false,
//     comments: []
//   },
//   {
//     comment_id: '9f1b96dc-fce8-4751-ac9a-ab06c966a826',
//     user: { username: null, user_id: null },
//     body: null,
//     created_at: '2023-11-18T00:04:50.405305',
//     level: 1,
//     is_deleted: true,
//     comments: []
//   }
  //   comment_id,
  // level,
  // parent_id,
  // CASE
  //   WHEN is_deleted = true THEN null
  //   ELSE user_id
  // END AS sanitized_user,
  // post_id,
  // created_at,
  // CASE
  //   WHEN is_deleted = true THEN null
  //   ELSE content
  // END AS sanitized_content,
  // likes,
  // dislikes,
  // is_deleted
    // console.log("response", response[0].json_build_object.comments);
    // console.log("response2", response[0]);

  } catch (err) {
    console.log("error data", err.data);
    console.log("error message", err.message);
  }
  // console.log("test???")
};

const deleteQuery = async (id: string) => {
  const response = await trpc.deleteComment.mutate({
    comment_id: id,
  });
  console.log("response", response);
}

fetchQueries();
// deleteQuery("16df33cb-46a9-48bd-8562-8a3aafdcf7a4");