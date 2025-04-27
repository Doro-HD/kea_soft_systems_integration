# 11a - Auth Integration
See assignment [here](https://github.com/anderslatif/Kea_SOFT_System_Integration_2025_Spring/blob/main/00._Course_Material/01._Assignments/11._CORS_Media_I/11a._Auth_Integration.md)

# Web framework
This project uses [Hono](https://hono.dev) to handle web based request, in this case http(s). For an easy setup use your prefered package manager with the create command and then select your preffered environment. This project uses the [Cloudflare Workers](https://workers.cloudflare.com) environment.

If you have used Express.js then Hono should feel quite similar, it uses a lot of the same patterns for generating routes.

```bash
npm create hono <app-name>
```

```bash
yarn create hono <app-name>
```

```bash
pnpm create hono <app-name>
```

```bash
bun create hono <app-name>
```

```bash
deno init --npm hono <app-name>
```

# OAuth
This project relies solely on oauth to handle it's authentication, but it does not rely on a auth provider eg. Clerk. Rather it uses the guides created by [Lucia auth](https://lucia-auth.com) and the [Arctic](https://arcticjs.dev) library, to setup it's authentication layer and connect directly to providers like Github, Google etc.

Add the Arctic library to the project with your preffered package manager, you can also add the octokit, for easier use of the github api, and dayjs, for date manipulation,  packages to the project but they are optional.

```bash
npm install arctic octokit dayjs
```

```bash
yarn add arctic octokit dayjs
```

```bash
pnpm add arctic octokit dayjs
```

```bash
bun add arctic octokit dayjs
```

```bash
deno add npm:arctic npm:octokit npm:dayjs
```

# Project recreation guide
If you have read and followed along in the previous sections you should now have a skeleton project to work with. From here we will work to recreate the functionality of this application.

## Github OAuth
This project allows users to sign up and in using Github. To achieve this we have to create a Github OAuth app on [Github](https://github.com).

### Creating an OAuth app
- Go to "settings"
    - From there go to "developer settings", it should be at the very bottom
- In developer settings go to "OAuth Apps" and click on the "New OAuth App" button
- Fill out the form
    - Give it a name
    - Provide the root url of you app, this can be http://localhost:3000/, remember to change your port if nessesary
    - Optional - write a description
    - Provide a callback url, this one is really important, this is the url that the user will be redirected to from github after they have allowed authorization through your app
        - I have set this url as /api/oauth/github/callback

After having created your "Github OAuth App", write down the "Client ID" and generate the "Client Secret" and write it down. You are going to need these.

## App secrets
The "Client ID" and the "Client Secret" noted down from ealier should be stored securely and not hardcoded into your application. This project is running locally using [Wrangler](https://developers.cloudflare.com/workers/wrangler/) to simulate a Cloudflare Worker environment. Therefore these sensitive variables have been set in a ".dev.vars" file, which is read by Wrangler upon running the application locally.

```bash
OAUTH_CLIENT_ID=***
OAUTH_CLIENT_SECRET=***
```

By setting the "Client ID" and the "Client Secret" in a ".dev.vars" file, Hono can access these constants via the "c.env.<VAR_NAME>", which you will see later in this guide. If you are not using the Cloudflare Worker environment then you should research how to securely store and access sensitive data for you application, [DotEnv](https://www.npmjs.com/package/dotenv) could one such solution.

## App entry point
If you used a command to setup your Hono project then you should have an index file in your src folder similar to the example below. This serves as the entrypoint for your application.

```typescript
import { Hono } from 'hono'

import apiRouter from './routers/apiRouter';
import pageRouter from './routers/pages';


const app = new Hono()
  .route('/api', apiRouter)
  .route('/', pageRouter)

export default app
```

The above is a slightly more simple version of the index.ts file in this project, your file should not have the ".route()" calls on the app constant, the Hono instance, but more likely a ".get()" call, Hono uses this ".get()" call on the instance as an example for the developer. You are welcome to crate all your routes on this instance, but I prefer to split up my routes between multiple instances so that is what you will see in this guide. \
Another thing to notice is that I use chained routing on the initialization of the Hono instance, this is supposed to provide better typing for TypeScript but is not nessesary and you are welcome to define your routes by calling the methods after initialization.

I will recommend that you pay attention to the names of the routers as they will appear throughout the guide and make it easier to figure out which url points to which router function.

## Frontend
We are going to need a small frontend so the user can be easily redirected to Github's authorization page. For this purpose I have a pages router to setup the initial html.

```typescript
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory';

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
  });
  await next();
})

const pageRouter = new Hono()
  .use(renderer)
  .route('/', publicRouter)
  .route('/protected', protectedRouter);

export default pageRouter
```

And here is the router for the public index page.

```typescript
import { Hono } from 'hono'

const publicRouter = new Hono()
  .get('/', async (c) => {
    return c.render(
      <>
        <h1>Welcome to 11a - Auth integration</h1>
        <p>Please authenticate yourself via Github to continue</p>

        <div>
          <a href="/api/oauth/github">Log in using Github</a>
        </div>
      </>
    );
  });

export default publicRouter
```

Notice the url of the a tag, "/api/oauth/github", this is a call to our own app that we should define.

## API OAuth endpoints
The frontend should direct the user to this enpoint, which will generate an url to redirect the user to.

```typescript
.get('/oauth/github', async (c) => {
    const CLIENT_ID = c.env.OAUTH_CLIENT_ID;
    const CLIENT_SECRET = c.env.OAUTH_CLIENT_SECRET;
    const authorizationUrl = await getAuthUrl(CLIENT_ID, CLIENT_SECRET);

    return c.redirect(authorizationUrl);
})
```

The "authorizationUrl" that the user is being redirected to, is a Github endpoint that will ask the user if they wish to authorize themselves on our application using Github, and they will also list what permissions we are asking for.

The function that generates this url was created by following this [guide](https://arcticjs.dev/providers/github), it uses the Arctic library mentioned earlier to handle the OAuth specification for a particular provider, in our case Github.\
Here is this projects implementation.

```typescript
function createClient(clientId: string, clientSecret: string) {
    return new arctic.GitHub(clientId, clientSecret, null);
}

async function getAuthUrl(clinetId: string, clientSecret: string) {
    const github = createClient(clinetId, clientSecret);

    const state = arctic.generateState();
    const scopes = ["user:email"];

    return github.createAuthorizationURL(state, scopes);
}
```

Assuming that the user allows the app to authorize through Github, they will be redirect to the url we specified earlier when setting up the "Redirect URL". For this project the url was /api/oauth/github/callbak.

```typescript
.get('/oauth/github/callback', async (c) => {
    const code = c.req.query('code')
    if (!code) {
      return c.json({ data: 'No code parameter give' }, 400);
    }

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

    // KEA_SI is a Cloudflare KV (Key Value Store)
    await c.env.KEA_SI.put(`${authorization.accessToken}:username`, username);
    await c.env.KEA_SI.put(`${authorization.accessToken}:expiration`, authorization.expiration.toISOString());

    return c.redirect('/protected')
  });
```

When calling this endpoint, Github provides a query parameter with the name code. The above example retrieves this parameter and uses it along with the "Client ID" and "Client Secret", to generate an authorization token.\
This token is what the app will use to authenticate and authorize users. But it can also be used to retrieve addtional information that the app has been authorized for through the specified scopes. In this project the username is retrieved using the octokit package, but Github has an [API](https://docs.github.com/en/rest?apiVersion=2022-11-28), which is what octokit uses under the hood.

After having retrieved the token and what information you need from the Github API. Store the token and user info in your system, a database would be a good tool, and set the token as a cookie as well.

Below is the "getAuthToken" function. But remember that the full guide to handling OAuth with Arctic is at the link provided earlier.
```typescript
async function getAuthToken(clientId: string, clientSecret: string, code: string) {
    const github = createClient(clientId, clientSecret);

    try {
        const tokens = await github.validateAuthorizationCode(code);

        const accessToken = tokens.accessToken();
        const expiration = dayjs().add(30, 'days');

        return {
            expiration,
            accessToken
        }
    } catch (e) {
        if (e instanceof arctic.OAuth2RequestError) {
            // Invalid authorization code, credentials, or redirect URI
            const code = e.code;
            // ...
        }
        if (e instanceof arctic.ArcticFetchError) {
            // Failed to call `fetch()`
            const cause = e.cause;
            // ...
        }
        // Parse error
    }
}
```