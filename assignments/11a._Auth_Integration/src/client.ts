import { hc } from 'hono/client';

import app from '@/index';

const client = hc<typeof app>('localhost:3000/');

export default client;