import { relations } from "drizzle-orm";
import { foreignKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

const usersTable = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    socialSecurityNumber: text('social_security_number').notNull(),
});

const usersRelation = relations(usersTable, ({ one, many }) => {
    return {
        room: one(roomsTable),
        fromComplaints: many(complaintsTable, {
            relationName: 'from_user_relation'
        }),
        againstComplaints: many(complaintsTable, {
            relationName: 'against_user_relation'
        })
    }
})

const roomsTable = sqliteTable('rooms', {
    id: text('id').primaryKey(),
    roomNumber: text('room_number').notNull().unique(),
    userId: text('user_id')
}, (table) => [
    foreignKey({
        name: 'fk_user_id',
        columns: [table.userId],
        foreignColumns: [usersTable.id]
    })
]);

const roomsRelation = relations(roomsTable, ({ one }) => {
    return {
        user: one(usersTable, {
            fields: [roomsTable.userId],
            references: [usersTable.id]
        })
    }
});

const complaintsTable = sqliteTable('complaints', {
    id: text('id').primaryKey(),
    fromUserId: text('from_user_id').notNull(),
    againstUserId: text('against_user_id').notNull(),
    description: text('description').notNull()
}, (table) => [
    foreignKey({
        name: 'fk_from_user_id',
        columns: [table.fromUserId],
        foreignColumns: [usersTable.id]
    }),
    foreignKey({
        name: 'fk_against_user_id',
        columns: [table.againstUserId],
        foreignColumns: [usersTable.id]
    })
]);

const complaintsRelation = relations(complaintsTable, ({ one }) => {
    return {
        fromUser: one(usersTable, {
            relationName: 'from_user_relation',
            fields: [complaintsTable.fromUserId],
            references: [usersTable.id]
        }),
        againstUser: one(usersTable, {
            relationName: 'against_user_relation',
            fields: [complaintsTable.againstUserId],
            references: [usersTable.id]
        })
    }
})

export {
    usersTable,
    usersRelation,
    roomsTable,
    roomsRelation,
    complaintsTable,
    complaintsRelation
};