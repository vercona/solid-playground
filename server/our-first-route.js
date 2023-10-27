
async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    // const allUsers = await db.select().from(applications);
    // console.log("test", db)
    return { hello: "world" };
  });
}

export default routes;
