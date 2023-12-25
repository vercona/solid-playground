import { Config, Context } from "@netlify/functions";
import {
  names,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import "dotenv/config";
import { supabase } from "../api";

if (!process.env.AUTHORIZATION_KEY) {
  throw new Error("AUTHORIZATION_KEY is missing");
}

interface ErrorObj extends Error {
  code?: number;
}

export default async (req: Request, context: Context) => {
  const authorizationKey = req.headers.get("authorization");

  if (!(process.env.AUTHORIZATION_KEY === authorizationKey)) {
    const authorizationError: ErrorObj = new Error("NOT AUTHORIZED");
    authorizationError.code = 401;
    throw authorizationError;
  }

  const reqBody = await req.json();
  if (reqBody) {
      const user_id = reqBody.record.id;
      console.log("user_id", user_id);

      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 999,
      });

      const username: string = uniqueNamesGenerator({
        dictionaries: [names, numberDictionary],
      });

      const { data, error } = await supabase
        .from("profiles")
        .insert({ user_id, username })
        .select()

      return new Response(JSON.stringify({
        data,
        error
      }));
  }

  return new Response(JSON.stringify("No body"));
};

export const config: Config = {
  path: "/add-user",
};
