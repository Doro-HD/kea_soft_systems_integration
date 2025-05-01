import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { roomsTable, usersTable } from "./schema";

type TUsers = InferSelectModel<typeof usersTable>;
type TUsersInsert = Omit<InferInsertModel<typeof usersTable>, 'id'>;

type TRoomsInsert = Omit<InferInsertModel<typeof roomsTable>, 'id'>;

export type {
    TUsers,
    TUsersInsert,
    TRoomsInsert
};