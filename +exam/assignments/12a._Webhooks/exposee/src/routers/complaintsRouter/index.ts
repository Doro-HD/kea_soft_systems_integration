import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/index";
import { complaintsGetRoute, complaintWebhooksPingRoute, complaintWebhooksPostRoute } from "./openAPI";
import { addWebhook, triggerWebhooks } from "@/services/webhookService";

const complaintsRouter = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(complaintsGetRoute, (c) => {
    return c.json({ users: [] });
  })
  .openapi(complaintWebhooksPostRoute, async (c) => {
    const { url, eventKind } = c.req.valid("json");
    const [webhook] = await addWebhook(c.env.DB, url, eventKind);

    return c.json({ webhook });
  })
  .openapi(complaintWebhooksPingRoute, async (c) => {
    await triggerWebhooks(c.env.DB, 'complaints');

    return c.json({ data: 'Webhooks triggered' });
  })

export default complaintsRouter;
