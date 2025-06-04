import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.DB_URL;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DB_URL,
  },
});
