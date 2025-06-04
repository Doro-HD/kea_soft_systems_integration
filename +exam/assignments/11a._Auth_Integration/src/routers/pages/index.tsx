import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory';

import { type Bindings } from '@/index';
import protectedRouter from './protected';
import publicRouter from './public';

const renderer = createMiddleware(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <html lang='eng'>
        <head>
          <title>11a: Auth Integration</title>
        </head>
        <body>
          {content}
        </body>
      </html>
    )
  })
  await next();
})

const pageRouter = new Hono<{ Bindings: Bindings }>()
  .use(renderer)
  .route('/', publicRouter)
  .route('/protected', protectedRouter)

export default pageRouter
