import { relations } from "drizzle-orm";
import { foreignKey, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

const roomsTable = pgTable('rooms', {
  id: text("id").primaryKey(),
  roomNumber: integer('room_number').notNull(),
  tenantId: text('tenant_id').notNull()
}, (table) => [
  foreignKey({
    name: 'fk_user_id',
    columns: [table.tenantId],
    foreignColumns: [usersTable.id]
  })
]);

const userRoles = pgEnum("role", ["tenant", "superintendent", 'admin']);

const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: userRoles("role").notNull(),
});


const complaintsTable = pgTable("complaints", {
  id: text("id").primaryKey(),
  fromUser: text("from_user").notNull(),
  againstUser: text("against_user").notNull(),
  description: text("description").notNull(),
}, (table) => [
    foreignKey({
        name: "fk_from_user",
        columns: [table.fromUser],
        foreignColumns: [usersTable.id],
    }),
    foreignKey({
        name: "fk_against_user",
        columns: [table.againstUser],
        foreignColumns: [usersTable.id]
    })
]);

export { complaintsTable, userRoles, usersTable, roomsTable };
