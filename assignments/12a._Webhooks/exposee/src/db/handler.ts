import { D1Database } from "@cloudflare/workers-types";

import execute from "./db";
import { complaintEventKindSchema, roomEventKindSchema, TEventKind, userEventKindSchema, webhooksTable } from "./schema";
import { inArray } from "drizzle-orm";
import { TResourceKind } from "@/services/webhookService";

function getWebhooks(dbClient: D1Database, resourceKind: TResourceKind | undefined) {
  return execute(dbClient, (db) => {
    let queryBuilder = db.select({ url: webhooksTable.url }).from(webhooksTable).$dynamic();

    if (resourceKind === 'users') {
      queryBuilder = queryBuilder.where(inArray(webhooksTable.eventKind, userEventKindSchema.options));
    } else if (resourceKind === 'rooms') {
      queryBuilder = queryBuilder.where(inArray(webhooksTable.eventKind, roomEventKindSchema.options));
    } else if (resourceKind === 'complaints') {
      queryBuilder = queryBuilder.where(inArray(webhooksTable.eventKind, complaintEventKindSchema.options));
    }

    return queryBuilder.execute();
  });
}

function createWebhook(
  dbClient: D1Database,
  url: string,
  eventKind: TEventKind,
) {
  return execute(dbClient, (db) => {
    const webhookId = crypto.randomUUID();

    return db.insert(webhooksTable).values({ id: webhookId, url, eventKind })
      .returning();
  });
}


export { getWebhooks, createWebhook };
