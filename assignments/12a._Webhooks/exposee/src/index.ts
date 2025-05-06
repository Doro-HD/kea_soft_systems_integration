import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import baseRouter from "./routers";

const app = new OpenAPIHono()
  .route('/', baseRouter)
  .doc("/doc", {
    openapi: "3.0.0",
    tags: [
      { name: "Users" },
      { name: "Rooms" },
      { name: "Complaints" },
      { name: "Webhooks" },
    ],
    info: {
      version: "1.0.0",
      title: "Herlev Kollegie (Heko) API",
    },
  })
  .get("/doc/ui", swaggerUI({ url: "/doc" }))
  .get('/', (c) => {
    return c.redirect('/doc/ui');
  });

export default app;
