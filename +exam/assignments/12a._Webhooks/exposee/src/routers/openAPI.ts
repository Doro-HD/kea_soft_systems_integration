import { eventsKind } from "@/db/schema";
import { z } from "@hono/zod-openapi";

const webhookSchema = z.object({
  url: z.string().url(),
  eventKind: z.enum(eventsKind),
});

export { webhookSchema };
