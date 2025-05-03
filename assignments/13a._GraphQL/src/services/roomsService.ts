import { eq, getTableColumns, sql } from "drizzle-orm";

import execute from "@/db/db";
import {
  complaintsTable,
  complaintsUserAssociationTable,
  roomsTable,
  usersTable,
} from "@/db/schema";
import { TComplaints, TRooms, TRoomsInsert, TUsers } from "@/db/validation";
import { Context } from "@getcronit/pylon";
import { SQLiteSelect } from "drizzle-orm/sqlite-core";

function selectWithRoomNumber<T extends SQLiteSelect>(
  qb: T,
  roomNumber: string,
) {
  return qb.where(eq(roomsTable.roomNumber, roomNumber));
}

class RoomsService {
  constructor() {
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  async getRooms(c: Context, filtering: { roomNumber?: string }) {
    const rooms = await execute(c.env.DB, (db) => {
      let dynamicQuery = db.select({
        ...getTableColumns(roomsTable),
        isVacant: sql<boolean>`${roomsTable.userId} IS Null`.as("is_vacant"),
        user: getTableColumns(usersTable),
        complaints: {
          ...getTableColumns(complaintsTable),
          kind: complaintsUserAssociationTable.associationKind,
        },
      })
        .from(roomsTable)
        .leftJoin(usersTable, eq(roomsTable.userId, usersTable.id))
        .leftJoin(
          complaintsUserAssociationTable,
          eq(complaintsUserAssociationTable.userId, usersTable.id),
        )
        .leftJoin(
          complaintsTable,
          eq(complaintsTable.id, complaintsUserAssociationTable.complaintId),
        )
        .$dynamic();

      if (filtering.roomNumber) {
        dynamicQuery = selectWithRoomNumber(dynamicQuery, filtering.roomNumber);
      }

      return dynamicQuery.execute();
    });

    return rooms;
  }

  async createRoom(c: Context, newRoom: TRoomsInsert) {
    const [room] = await execute(c.env.DB, (db) => {
      const roomId = crypto.randomUUID();

      return db.insert(roomsTable).values({ ...newRoom, id: roomId })
        .returning();
    });

    return room;
  }

  async addTenant(c: Context, userId: string, roomId: string) {
    const [room] = await execute(c.env.DB, (db) => {
      return db.update(roomsTable).set({ userId }).where(
        eq(roomsTable.id, roomId),
      ).returning();
    });

    return room;
  }
}

const roomsService = new RoomsService();
export default roomsService;
