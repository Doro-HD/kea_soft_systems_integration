import { relations } from "drizzle-orm";
import { foreignKey, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

const userRoles = pgEnum("role", ["tenant", "superintendent"]);

const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  socialSecurityNumber: text("social_security_number").notNull(),
  role: userRoles("role").notNull(),
});

const usersRelation = relations(usersTable, ({ many }) => {
    return {
        complaints: many(complaintsTable)
    }
})

const dbUsers = pgTable("db_users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  userId: text("user_id"),
}, (table) => [
  foreignKey({
    name: "fk_user_id",
    columns: [table.userId],
    foreignColumns: [usersTable.id],
  }),
]);

const complaintsTable = pgTable("complaints", {
  id: text("id").primaryKey(),
  fromUser: text("from_user").notNull(),
  againstUser: text("against_user").notNull(),
  description: text("description").notNull(),
}, (table) => [
    foreignKey({
        name: "fk_from_user",
        columns: [complaintsTable.fromUser],
        foreignColumns: [usersTable.id]
    }),
    foreignKey({
        name: "fk_from_user",
        columns: [complaintsTable.fromUser],
        foreignColumns: [usersTable.id]
    })
]);

const complaintsRelation = relations(complaintsTable, ({ one }) => {
    return {
        fromUser: one(usersTable, {
            fields: [complaintsRelation.fromUser],
            references: [usersTable.id]
        }),
        againstUser: one(usersTable, {
            fields: [complaintsRelation.fromUser],
            references: [usersTable.id]
        })
    }
})

export { complaintsTable, complaintsRelation, dbUsers, userRoles, usersTable, usersRelation };
