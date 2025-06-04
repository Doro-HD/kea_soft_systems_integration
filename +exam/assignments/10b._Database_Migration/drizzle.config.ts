import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.OLD_DB_URL || 'NO DB URL';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/oldSchema.ts',
    out: './drizzle',
    dbCredentials: {
        url: DB_URL
    }
});