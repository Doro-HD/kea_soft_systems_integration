import { complaintsTable, roomsTable, usersTable } from "./schema";

type TUsers = typeof usersTable.$inferSelect;
type TUsersInsert = Omit<typeof usersTable.$inferInsert, "id">;

type TRooms = typeof roomsTable.$inferSelect;
type TRoomsInsert = Omit<typeof roomsTable.$inferInsert, "id">;

type TComplaints = typeof complaintsTable.$inferSelect;
type TComplaintsInsert = Omit<typeof complaintsTable.$inferInsert, "id">;

export type {
  TComplaints,
  TComplaintsInsert,
  TRooms,
  TRoomsInsert,
  TUsers,
  TUsersInsert,
};
