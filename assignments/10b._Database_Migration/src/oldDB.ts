import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";

const DB_URL = process.env.OLD_DB_URL;
const db = drizzle(DB_URL);

export default db;