import { createRoute, z } from "@hono/zod-openapi";
import { webhookSchema } from "@/routers/openAPI";
import { userEventKindSchema } from "@/db/schema";

const usersSchema = z.object({
  name: z.array(z.string()).openapi({ example: ["David"] }),
}).openapi("User");

const usersWebhookSchema = webhookSchema.extend({
  eventKind: userEventKindSchema.openapi({
    description: "The user based event to trigger the webhook on",
  }),
}).openapi("User Webhook");

const usersGetRoute = createRoute({
  description: "Retrieves all users",
  tags: ["Users"],
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: usersSchema,
        },
      },
      description: "All users was successfully retrieved",
    },
  },
});

const userWebhooksPostRoute = createRoute({
  description: 'Creates a new webhook for a user related event',
  tags: ["Users", "Webhooks"],
  method: "post",
  path: "/webhooks",
  request: {
    body: {
      content: {
        "application/json": {
          schema: usersWebhookSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: usersWebhookSchema,
        },
      },
      description: "Webhook was successfully created",
    },
    400: {
      description: "Bad request body, please reference the documentation",
    },
  },
});

const userWebhooksPingRoute = createRoute({
      description: "Trigger all webhooks associated with user events",
  tags: ["Users", "Webhooks"],
  method: "get",
  path: "/webhooks/ping",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ data: z.string() })
        }
      },
      description: "User related webhooks were succesfully triggered",
    }
  },
});

export { usersGetRoute, userWebhooksPostRoute, userWebhooksPingRoute };
