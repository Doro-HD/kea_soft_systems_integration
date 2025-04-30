import { relations } from "drizzle-orm";
import { foreignKey, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

const roomsTable = pgTable('rooms', {
  id: text("id").primaryKey(),
  roomNumber: integer('room_number').notNull(),
  tenantId: text('tenant_id').notNull()
}, (table) => [
  foreignKey({
    name: 'fk_user_id',
    columns: [roomsTable.tenant],
    foreignColumns: [usersTable.id]
  })
]);

const roomsRelation = relations(roomsTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [roomsTable.tenantId],
      references: [usersTable.id]
    })
  }
});

const userRoles = pgEnum("role", ["tenant", "superintendent", 'admin']);

const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: userRoles("role").notNull(),
});

const usersRelation = relations(usersTable, ({ one, many }) => {
    return {
        room: one(roomsTable),
        complaints: many(complaintsTable)
    }
});


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

export { complaintsTable, complaintsRelation, userRoles, usersTable, usersRelation, roomsTable, roomsRelation };
