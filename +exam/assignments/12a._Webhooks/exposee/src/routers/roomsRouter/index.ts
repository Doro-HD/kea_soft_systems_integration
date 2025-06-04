import { OpenAPIHono } from "@hono/zod-openapi";
import { roomsGetRoute, roomWebhooksPingRoute, roomWebhooksPostRoute } from "./openAPI";
import { Bindings } from "@/index";
import { addWebhook, triggerWebhooks } from "@/services/webhookService";

const roomsRouter = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(roomsGetRoute, (c) => {
    return c.json({ rooms: [] });
  })
  .openapi(roomWebhooksPostRoute, async (c) => {
    const { url, eventKind } = c.req.valid("json");

    const [webhook] = await addWebhook(c.env.DB, url, eventKind);

    return c.json({ webhook });
  })
  .openapi(roomWebhooksPingRoute, async (c) => {
    await triggerWebhooks(c.env.DB, 'rooms');

    return c.json({ data: 'Webhooks triggered' });
  });

export default roomsRouter;
