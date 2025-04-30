import {
  foreignKey,
  pgEnum,
  pgPolicy,
  pgTable,
  pgView,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const role = pgEnum("role", ["tenant", "superintendent"]);

export const dbUsers = pgTable("db_users", {
  id: text().primaryKey().notNull(),
  username: text().notNull(),
  userId: text("user_id"),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "fk_user_id",
  }),
]);

export const users = pgTable("users", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  socialSecurityNumber: text("social_security_number").notNull(),
  role: role().notNull(),
}, (table) => [
  pgPolicy("superintendent_safeguard_update", {
    as: "permissive",
    for: "update",
    to: ["anders"],
    withCheck: sql`(role = 'tenant'::role)`,
  }),
  pgPolicy("superintendent_safeguard_insert", {
    as: "permissive",
    for: "insert",
    to: ["anders"],
  }),
]);
export const safeUsers = pgView("safe_users", {
  id: text(),
  name: text(),
  socialSecurityNumber: text("social_security_number"),
  role: role(),
}).as(
  sql`SELECT users.id, users.name, CASE WHEN db_users.username = CURRENT_USER THEN users.social_security_number ELSE '***'::text END AS social_security_number, users.role FROM users LEFT JOIN db_users ON users.id = db_users.user_id`,
);
