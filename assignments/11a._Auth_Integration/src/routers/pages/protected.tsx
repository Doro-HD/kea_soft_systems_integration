import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import dayjs from 'dayjs';

import { type Bindings } from '@/index';

const authorizer = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
    const accessToken = getCookie(c, c.env.AUTH_COOKIE_NAME);
    if (!accessToken) {
        return c.json({ data: 'Unauthorized' }, 401);
    }

    const expiration = await c.env.KEA_SI.get(`${accessToken}:expiration`);
    const username = await c.env.KEA_SI.get(`${accessToken}:username`);
    if (!expiration || !username) {
        await c.env.KEA_SI.delete(`${accessToken}:expiration`)
        await c.env.KEA_SI.delete(`${accessToken}:username`)

        return c.json({ data: 'Unauthorized' }, 401);
    }

    if (dayjs().isAfter(expiration)) {
        await c.env.KEA_SI.delete(`${accessToken}:expiration`)
        await c.env.KEA_SI.delete(`${accessToken}:username`)

        return c.json({ data: 'Unauthorized' }, 401);
    }

    await next();
});

const protectedRouter = new Hono<{ Bindings: Bindings }>()
  .use(authorizer)
  .get('/', async (c) => {
    const accessToken = getCookie(c, c.env.AUTH_COOKIE_NAME);

    const expirationString = await c.env.KEA_SI.get(`${accessToken}:expiration`);
    if (!expirationString) {
      return c.json({ data: 'Invalid token' }, 401);
    }

    const expiration = dayjs(expirationString);
    if (dayjs().isAfter(expiration)) {
      return c.json({ data: 'Invalid token' }, 401);
    }


    const username = await c.env.KEA_SI.get(`${accessToken}:username`);

    return c.render(
        <h1>
            Hello {username}
        </h1>
    )
  });

export default protectedRouter