import { db } from "./db/index.js";

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    const allUsers = await db.query.applications.findMany();
    console.log("test", allUsers);
    return { hello: "world" };
  });
}

export default routes;
