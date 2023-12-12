import Fastify from "fastify";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import { routes } from "./trpc/routes";
import { db } from "./db";
import { createContext } from "./context";

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
  await fastify.register(cors, {
    origin: "*"
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  await fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: routes, createContext },
  });

  // Run the server!
  await fastify.listen({ port: 8080 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
  });
  // (async () => {
  //   try {
  //     await fastify.listen({ port: 8080 });
  //   } catch (err) {
  //     fastify.log.error(err);
  //     process.exit(1);
  //   }
  // })();
};
main();

// fastify.register(fastifyTRPCPlugin, {
//   prefix: "/",
//   trpcOptions: { router: routes, createContext },
// });

// (async () => {
//   try {
//     await fastify.listen({ port: 8080 });
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// })();
