import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/routers/index";
import { webhooksPingRoute, webhooksPostRoute } from "./openAPI";
import { addWebhook, triggerWebhooks } from "@/services/webhookService";

const webhooksRouter = new OpenAPIHono<{ Bindings: Bindings}>()
    .openapi(webhooksPostRoute, async (c) => {
        const { url, eventKind } = c.req.valid('json');
        const [webhook] = await addWebhook(c.env.DB, url, eventKind);

        return c.json(webhook);
    })
    .openapi(webhooksPingRoute, async (c) => {
        await triggerWebhooks(c.env.DB);

        return c.json({ data: 'Webhooks triggered' });
    });

export default webhooksRouter;