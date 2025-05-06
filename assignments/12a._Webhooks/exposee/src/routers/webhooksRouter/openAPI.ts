import { createRoute, z } from "@hono/zod-openapi";
import { webhookSchema } from "@/routers/openAPI";


const webhooksPostRoute = createRoute({
  description: 'creates a new webhook, can be used with any event kind',
  tags: ["Webhooks"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: webhookSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: webhookSchema,
        },
      },
      description: "The webhook was succesfully created",
    },
    400: {
      description: "Bad request body, please reference the documentation",
    },
  },
});

const webhooksPingRoute = createRoute({
  description: 'Triggers all webhooks',
  tags: ["Webhooks"],
  method: "get",
  path: "/ping",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ data: z.string() })
        }
      },
      description: "All webhooks were succesfully triggered",
    }
  },
});

export { webhooksPostRoute, webhooksPingRoute };
