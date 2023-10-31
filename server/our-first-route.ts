import { FastifyInstance } from "fastify";
import { db } from "./db";
import { commentsSchema } from "./db/schemas";

interface Comments {
  user: string;
}
const insertUser = async (user: string) => {
  return db.insert(commentsSchema).values({user});
};

async function routes(fastify: FastifyInstance) {
  fastify.get("/", async () => {
    const allUsers = await db.select().from(commentsSchema);
    console.log("test now", allUsers);
    return { hello: "world" };
  });
  fastify.post<{Body: string}>("/addUser", async (request) => {
    // const allUsers = await db.select().from(applications);
    // console.log("test", allUsers);
    // const { } = request.body;
    const formattedBody: Comments = JSON.parse(request.body);
    console.log("typeof", typeof formattedBody);
    console.log("formattedBody", formattedBody);
    const user = insertUser(formattedBody.user);
    return { add: "user", user };
  });
}

export default routes;
