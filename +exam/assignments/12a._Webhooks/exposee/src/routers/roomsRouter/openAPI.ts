import { createRoute, z } from "@hono/zod-openapi";
import { webhookSchema } from "@/routers/openAPI";
import { roomEventKindSchema } from "@/db/schema";

const roomsSchema = z.object({
  roomNumber: z.string(),
}).openapi("Room");

const roomWebhooksSchema = webhookSchema.extend({
  eventKind: roomEventKindSchema.openapi({
    description: "The room based event to trigger the webhook on",
  }),
}).openapi("Room Webhook");

const roomsGetRoute = createRoute({
  description: "Retrieves all rooms",
  tags: ["Rooms"],
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: roomsSchema,
        },
      },
      description: "All rooms were succesfully retrieved",
    },
  },
});

const roomWebhooksPostRoute = createRoute({
  description: 'Creates a new webhook for a room related event',
  tags: ["Rooms", "Webhooks"],
  method: "post",
  path: "/webhooks",
  request: {
    body: {
      content: {
        "application/json": {
          schema: roomWebhooksSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: roomWebhooksSchema,
        },
      },
      description: "The webhook was succesfully created",
    },
    400: {
      description: "Bad request body, please reference the documentation",
    },
  },
});

const roomWebhooksPingRoute = createRoute({
  description: "Triggers all webhooks associated with room events",
  tags: ["Rooms", "Webhooks"],
  method: "get",
  path: "/webhooks/ping",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ data: z.string() })
        }
      },
      description: "Room related webhooks were succesfully triggered",
    }
  },
});

export { roomsGetRoute, roomWebhooksPostRoute,roomWebhooksPingRoute };
