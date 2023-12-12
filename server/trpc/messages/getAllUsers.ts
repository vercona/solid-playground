import { usersTableName } from "../../db/schemas";



import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export const getAllUsers = (
  publicProcedure
    .query(async () => {
      const allUsers = await kyselyDb
        .selectFrom(usersTableName)
        .selectAll()
        .execute();
      return allUsers;
    })
)