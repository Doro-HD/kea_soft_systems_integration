import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import logger from './logger.js'
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono()
  .post('/', zValidator('json', z.object({
    id: z.string(),
    eventKind: z.string(),
    url: z.string()
  })), (c) => {
    const webhook = c.req.valid('json');

    if (webhook.eventKind === 'user-has-late-paymnets') {
      logger.warn(webhook);
    } else {
      logger.info(webhook);
    }

    return c.json({ data: 'Data recieved' });
  });

const PORT = Number(process.env.PORT) || 8080;
serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
