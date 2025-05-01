import { sql, eq } from "drizzle-orm";

import execute from "@/db/db";
import { roomsTable } from "@/db/schema";
import { TRoomsInsert } from "@/db/validation";
import { Context } from "@getcronit/pylon";

class RoomsService {
    constructor() {
        this.getRoom = this.getRoom.bind(this);
        this.createRoom = this.createRoom.bind(this);
    }

    async getRoom(c: Context) {
        const rooms = await execute(c.env.DB, (db) => {
            return db.query.roomsTable.findMany({
                extras: {
                    isVacant: sql`user_id IS Null`.as('is_vacant')
                },
                with: {
                    user: {
                        with: {
                            fromComplaints: {
                                with: {
                                    againstUser: {
                                        with: {
                                            room: true
                                        }
                                    }
                                }
                            },
                            againstComplaints: {
                                with: {
                                    fromUser: {
                                        with: {
                                            room: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });

        return rooms;
    }

    async createRoom(c: Context, newRoom: TRoomsInsert) {
        const [room] = await execute(c.env.DB, (db) => {
            const roomId = crypto.randomUUID();

            return db.insert(roomsTable).values({ ...newRoom, id: roomId }).returning();
        })

        return room;
    }

    async addTenant(c: Context, userId: string, roomId: string) {
        const [room] = await execute(c.env.DB, (db) => {
            return db.update(roomsTable).set({ userId }).where(eq(roomsTable.id, roomId)).returning();
        })

        return room;
    }
}

const roomsService = new RoomsService();
export default roomsService;