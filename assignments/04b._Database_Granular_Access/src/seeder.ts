import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed, reset } from "drizzle-seed";

import * as schema from "./schema.ts";

const DB_URL = process.env.DB_URL;
const db = drizzle(DB_URL!);

await reset(db, { users: schema.usersTable, complaints: schema.complaintsTable });

await seed(db, { users: schema.usersTable, complaints: schema.complaintsTable })
  .refine((funcs) => ({
    users: {
      count: 111,
      columns: {
        id: funcs.uuid(),
        name: funcs.fullName(),
        socialSecurityNumber: funcs.string({ isUnique: true }),
        role: funcs.valuesFromArray({
          values: ["tenant"],
        }),
      },
      with: {
        complaints: 5
      }
    },
  }));
