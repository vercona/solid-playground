/*
  npm start -p=5000 -w
  `fastify help` start for more info
*/
import { migrate } from "drizzle-orm/postgres-js/migrator";
import firstRoute from "./our-first-route.js";
import { db } from "./db/index.js";

export default async function (fastify, opts) {
  console.log('Hit')

  /* 
  // i don't have .env set up
  await migrate(db, {
    migrationsFolder: "./migrations",
  }); */

  await fastify.register(firstRoute);

  fastify.get('/', async (request, reply) => {
    return { hello: 'Hello' }
  })
}
