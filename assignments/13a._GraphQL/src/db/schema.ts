import { relations } from "drizzle-orm";
import { foreignKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  socialSecurityNumber: text("social_security_number").notNull(),
});

const usersRelation = relations(usersTable, ({ one, many }) => {
  return {
    room: one(roomsTable),
    complaintAssociations: many(complaintsUserAssociationTable),
  };
});

const roomsTable = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  roomNumber: text("room_number").notNull().unique(),
  userId: text("user_id"),
}, (table) => [
  foreignKey({
    name: "fk_user_id",
    columns: [table.userId],
    foreignColumns: [usersTable.id],
  }),
]);

const roomsRelation = relations(roomsTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [roomsTable.userId],
      references: [usersTable.id],
    }),
  };
});

const complaintsTable = sqliteTable("complaints", {
  id: text("id").primaryKey(),
  description: text("description").notNull(),
});

const complainantsRelation = relations(complaintsTable, ({ many }) => {
  return {
    userAssociations: many(complaintsUserAssociationTable)
  };
});

const complaintsUserAssociationTable = sqliteTable(
  "complaints_user_association",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    complaintId: text("complaint_id").notNull(),
    associationKind: text("association_kind", {
      enum: ["complainant", "complainee"],
    }).notNull(),
  },
  (table) => [
    foreignKey({
      name: "fk_user_id",
      columns: [table.userId],
      foreignColumns: [usersTable.id],
    }),
    foreignKey({
      name: "fk_complaint_id",
      columns: [table.complaintId],
      foreignColumns: [complaintsTable.id],
    }),
  ],
);

const complaintsUserAssociationRelation = relations(complaintsUserAssociationTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [complaintsUserAssociationTable.userId],
      references: [usersTable.id]
    }),
    complaint: one(complaintsTable, {
      fields: [complaintsUserAssociationTable.complaintId],
      references: [complaintsTable.id]
    })
  }
})

export {
  complaintsTable,
  complainantsRelation,
  complaintsUserAssociationTable,
  complaintsUserAssociationRelation,
  roomsRelation,
  roomsTable,
  usersRelation,
  usersTable,
};
