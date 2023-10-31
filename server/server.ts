import Fastify from "fastify";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import firstRoute from "./our-first-route";
import { db } from "./db";

const fastify = Fastify({
  logger: true,
});

// Declare a route
// fastify.get("/", function (request, reply) {
//   reply.send({ hello: "world" });
// });

const main = async () => {
  // console.log("db", db);
  // await migrate(db, { migrationsFolder: "./migrations" })
  //   .then(() => {
  //     console.log("Migrations complete!");
  //     process.exit(0);
  //   })
  //   .catch((err) => {
  //     console.error("Migrations failed!", err);
  //     process.exit(1);
  //   });
  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  await fastify.register(firstRoute);

  // Run the server!
  await fastify.listen({ port: 8080 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
  });
};
main();
