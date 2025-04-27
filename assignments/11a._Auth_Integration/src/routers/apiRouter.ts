import { Hono } from 'hono'
import { validator } from 'hono/validator';
import { setCookie } from 'hono/cookie';
import { Octokit } from 'octokit';

import { type Bindings } from '@/index';
import { getAuthUrl, getAuthToken } from '@/oauth';

const apiRouter = new Hono<{ Bindings: Bindings }>()
  .get('/oauth/github', async (c) => {
    const authorizationUrl = await getAuthUrl(c.env.OAUTH_CLIENT_ID, c.env.OAUTH_CLIENT_SECRET)

    return c.redirect(authorizationUrl);
  })
  .get('/oauth/github/callback', validator('query', (value, c) => {
    const code = value['code'];

    if (!code) {
      return c.json({ data: 'Invalid query' }, 400);
    }

    return {
      code,
    }
  }), async (c) => {
    const { code } = c.req.valid('query');

    const authorization = await getAuthToken(c.env.OAUTH_CLIENT_ID, c.env.OAUTH_CLIENT_SECRET, code)
    if (!authorization) {
      return c.json({ data: 'Could not authorize through github' }, 400);
    }

    const octokit = new Octokit({ auth: authorization.accessToken });
    const response = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const username = response.data.login;

    setCookie(c, c.env.AUTH_COOKIE_NAME, authorization.accessToken, {
      path: '/',
      httpOnly: true,
      expires: authorization.expiration.toDate()
    });

    await c.env.KEA_SI.put(`${authorization.accessToken}:username`, username);
    await c.env.KEA_SI.put(`${authorization.accessToken}:expiration`, authorization.expiration.toISOString());

    return c.redirect('/protected')
  });

export default apiRouter
