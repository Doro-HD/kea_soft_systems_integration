import { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

function connect(dbClient: D1Database) {
  return drizzle(dbClient, { schema });
}

async function execute<T>(
  dbClient: D1Database,
  fn: (db: ReturnType<typeof connect>) => T,
): Promise<T> {
  const db = connect(dbClient);

  return fn(db);
}

export default execute;
