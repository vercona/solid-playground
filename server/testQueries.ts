//@ts-nocheck
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { Routes } from "./trpc/routes";

const trpc = createTRPCProxyClient<Routes>({
  links: [
    loggerLink({
      enabled: () => true
    }),
    httpBatchLink({
      url: "http://localhost:8080/trpc",
      async headers(){
        return {
          authorization:
            "eyJhbGciOiJIUzI1NiIsImtpZCI6IjdhMHRLZFozWDJUS2x4OUwiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAyNjk1NzkwLCJpYXQiOjE3MDI2OTIxOTAsImlzcyI6Imh0dHBzOi8vdmNsenVjY3NkcmthdmZtdWdjaXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjQ0NzA0OTQwLTc2OTktNGY3MS1iMmZkLWM3ZWE2YWM0N2E5MyIsImVtYWlsIjoibnNwYW5uNzdAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzAyNjkyMTkwfV0sInNlc3Npb25faWQiOiIzNmQwY2Y5Zi0yNjc3LTQ0MzYtODU1MS0xNDIxNmZhNDNmZTgifQ.CeFV_zZh3HNWKZd6QWfS4uieTIEQnIZP_pxmPJQV1T8"
        };
      }
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

    // const response = await trpc.messages.getPostAndComments.query({
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    //   limitChildRowNum: 10,
    //   limitLevel: 10
    // });

    // const response = await trpc.deleteComment.mutate({
    //   comment_id: "9f1b96dc-fce8-4751-ac9a-ab06c966a820",
    // });

    // const response = await trpc.messages.getRepliedComments.query({
    //   post_id: "318fe5eb-b6cc-4519-9410-a28b4a603b98",
    //   // parent_id: "c0395394-365c-4f1b-b079-2efd01cb751c",
    //   // parent_id: "1259e113-6412-4b95-84b0-b13e6453eaaa",
    //   parent_id: null,
    //   // startUuidKey: "c54263c7-b977-4be4-be5c-0f0b5324c3fb",
    //   begin_comment_num: 0,
    //   query_num_limit: 3,
    //   start_level: 0,
    //   query_depth: null
    // });

    const response = await trpc.auth.passwordlessLogin.query({
      email: "nspann77@gmail.com",
    });
    // const response = await trpc.auth.verifyLogin.query({
    //   email: "nspann77@gmail.com",
    //   token: "edca7dcaaea78d84802d0bf05430ab37a33bdb54d2eaf29fd2aba42b",
    // });
    //https://vclzuccsdrkavfmugcip.supabase.co/auth/v1/verify?token=edca7dcaaea78d84802d0bf05430ab37a33bdb54d2eaf29fd2aba42b&type=magiclink&redirect_to=http://localhost:3000
    // const response = await trpc.auth.refreshSession.query({
    //   refresh_token: "kQZ8IUhjwH_Q740u_XRoLQ",
    // });
    // const response = await trpc.auth.getUser.query({
    //   token:
    //     "eyJhbGciOiJIUzI1NiIsImtpZCI6IjdhMHRLZFozWDJUS2x4OUwiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAyNTI2NTUwLCJpYXQiOjE3MDI1MjI5NTAsImlzcyI6Imh0dHBzOi8vdmNsenVjY3NkcmthdmZtdWdjaXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImFiY2JkZjk1LWQ2MzUtNDQ5My1iYjNmLTYyNDdkMDE4OWQ5MSIsImVtYWlsIjoibmFiaWxzcGFubkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3MDI1MjI5NTB9XSwic2Vzc2lvbl9pZCI6ImU2NDM5MjBiLTUzNDEtNGRlOC05NzY3LTZhMzQ0ZGIzNGFiZCJ9.YhRehrEQgIw4ObROPUVYXn99Kgxz7gJjfbsihLa95jc",
    // });
    console.log("response", response);
    // console.log("response identities", response.user.identities);
    // console.log("response deep", response.comments[2].comments);
    // console.log("response deep", response[1].comments);
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