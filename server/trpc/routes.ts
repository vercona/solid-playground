import { KyselyDatabase } from "../db/kyselyDb";
import { router} from "./trpc";
import messageRoutes from "./messageRoutes";
import authRoutes from "./authRoutes";

export const routes = router({
  messages: messageRoutes,
  auth: authRoutes
});

export type Routes = typeof routes;
