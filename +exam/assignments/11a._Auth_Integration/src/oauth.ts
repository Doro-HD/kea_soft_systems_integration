import * as arctic from "arctic";
import dayjs from "dayjs";


function createClient(clientId: string, clientSecret: string) {
    return new arctic.GitHub(clientId, clientSecret, null);
}

async function getAuthUrl(clinetId: string, clientSecret: string) {
    const github = createClient(clinetId, clientSecret);

    const state = arctic.generateState();
    const scopes = ["user:email"];

    return github.createAuthorizationURL(state, scopes);
}

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

export {
    getAuthUrl,
    getAuthToken
};