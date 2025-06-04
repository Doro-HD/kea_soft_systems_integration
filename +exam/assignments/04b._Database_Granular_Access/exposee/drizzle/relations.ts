import { relations } from "drizzle-orm/relations";
import { dbUsers, users } from "./schema";

export const dbUsersRelations = relations(dbUsers, ({ one }) => ({
  user: one(users, {
    fields: [dbUsers.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  dbUsers: many(dbUsers),
}));
