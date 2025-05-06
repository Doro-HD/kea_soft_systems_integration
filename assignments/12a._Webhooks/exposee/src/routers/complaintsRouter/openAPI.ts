import { createRoute, z } from "@hono/zod-openapi";
import { webhookSchema } from "@/routers/openAPI";
import { complaintEventKindSchema } from "@/db/schema";

const complaintsSchema = z.object({
  roomNumber: z.string(),
}).openapi("Complaint");

const complaintWebhooksSchema = webhookSchema.extend({
  eventKind: complaintEventKindSchema.openapi({
    description: "The complaint based event to trigger the webhook on",
  }),
}).openapi("Complaint Webhook");

const complaintsGetRoute = createRoute({
  description: "Retrieves all rooms",
  tags: ["Complaints"],
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: complaintsSchema,
        },
      },
      description: "Complaints were succesfully retrieved",
    },
  },
});

const complaintWebhooksPostRoute = createRoute({
  description: 'Creates a new webhook for a complaint related event',
  tags: ["Complaints", "Webhooks"],
  method: "post",
  path: "/webhooks",
  request: {
    body: {
      content: {
        "application/json": {
          schema: complaintWebhooksSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: complaintWebhooksSchema,
        },
      },
      description: "Webhook was succesfully created",
    },
    400: {
      description: "Bad request body, please reference the documentation",
    },
  },
});

const complaintWebhooksPingRoute = createRoute({
  description: "Triggers all webhooks associated with complaint events",
  tags: ["Complaints", "Webhooks"],
  method: "get",
  path: "/webhooks/ping",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ data: z.string() })
        }
      },
      description: "Complaint related webhooks were succesfully triggered",
    }
  },
});

export { complaintsGetRoute, complaintWebhooksPostRoute, complaintWebhooksPingRoute };
