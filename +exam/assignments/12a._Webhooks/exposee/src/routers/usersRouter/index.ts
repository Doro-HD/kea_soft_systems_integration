import { OpenAPIHono } from "@hono/zod-openapi";

import { Bindings } from "@/index";
import { usersGetRoute, userWebhooksPostRoute, userWebhooksPingRoute } from "./openAPI";
import { addWebhook, triggerWebhooks } from "@/services/webhookService";

const usersRouter = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(usersGetRoute, (c) => {
    return c.json({ users: [] });
  })
  .openapi(userWebhooksPostRoute, async (c) => {
    const { url, eventKind } = c.req.valid("json");
    const [webhook] = await addWebhook(c.env.DB, url, eventKind);

    return c.json({ webhook });
  })
  .openapi(userWebhooksPingRoute, async (c) => {
    await triggerWebhooks(c.env.DB, 'users');

    return c.json({ data: 'Webhooks triggered' });
  })

export default usersRouter;
