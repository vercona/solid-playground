import { KyselyDatabase } from "../db/kyselyDb";
import { router} from "./trpc";
import messageRoutes from "./messageRoutes";

export const routes = router({
  messages: messageRoutes
})

export type Routes = typeof routes;
