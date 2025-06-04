import { pgTable, text } from "drizzle-orm/pg-core";

const users = pgTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull()
});

export {
    users
};