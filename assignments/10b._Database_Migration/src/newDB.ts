import 'dotenv/config';
import { MongoClient } from 'mongodb';

const DB_URL = process.env.NEW_DB_URL || 'No DB URL';
const client = new MongoClient(DB_URL);

const dbName = 'si-10b';

await client.connect();
const db = client.db(dbName);


export default db;