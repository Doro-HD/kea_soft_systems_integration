import { createWebhook, getWebhooks } from "@/db/handler";
import { TEventKind } from "@/db/schema";
import { D1Database } from "@cloudflare/workers-types";

type TResourceKind = 'users' | 'rooms' | 'complaints';

async function triggerWebhooks(dbClient: D1Database, resourceKind?: TResourceKind | undefined) {
    const urls = await getWebhooks(dbClient, resourceKind);
    urls.forEach(url => {
        fetch(url);
    });
}

function addWebhook(dbClient: D1Database, url: string, eventKind: TEventKind) {
    return createWebhook(dbClient, url, eventKind);
}

export {
    triggerWebhooks,
    addWebhook,
    type TResourceKind
};