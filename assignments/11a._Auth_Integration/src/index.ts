import { Hono } from 'hono'
import { KVNamespace } from '@cloudflare/workers-types';

import apiRouter from './routers/apiRouter';
import pageRouter from './routers/pages';

type Bindings = {
  KEA_SI: KVNamespace;
  AUTH_COOKIE_NAME: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
};


const app = new Hono<{ Bindings: Bindings }>()
  .route('/api', apiRouter)
  .route('/', pageRouter)

export default app
export {
  type Bindings
};
