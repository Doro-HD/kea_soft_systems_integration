import { OpenAPIHono } from "@hono/zod-openapi";
import type { D1Database } from "@cloudflare/workers-types";

import usersRouter from "./usersRouter";
import roomsRouter from "./roomsRouter";
import complaintsRouter from "./complaintsRouter";
import webhooksRouter from "./webhooksRouter";


type Bindings = {
  DB: D1Database;
};

const baseRouter = new OpenAPIHono()
  .route("/users", usersRouter)
  .route("/rooms", roomsRouter)
  .route("/complaints", complaintsRouter)
  .route('/webhooks', webhooksRouter)

export default baseRouter;
export {
  Bindings
};