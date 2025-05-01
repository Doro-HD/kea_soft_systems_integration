var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { app } from "@getcronit/pylon";

// src/resolvers/usersResolver.ts
import { getContext } from "@getcronit/pylon";

// src/db/db.ts
import { drizzle } from "drizzle-orm/d1";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  complaintsRelation: () => complaintsRelation,
  complaintsTable: () => complaintsTable,
  roomsRelation: () => roomsRelation,
  roomsTable: () => roomsTable,
  usersRelation: () => usersRelation,
  usersTable: () => usersTable
});
import { relations } from "drizzle-orm";
import { foreignKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
var usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  socialSecurityNumber: text("social_security_number").notNull()
});
var usersRelation = relations(usersTable, ({ one, many }) => {
  return {
    room: one(roomsTable),
    fromComplaints: many(complaintsTable, {
      relationName: "from_user_relation"
    }),
    againstComplaints: many(complaintsTable, {
      relationName: "against_user_relation"
    })
  };
});
var roomsTable = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  roomNumber: text("room_number").notNull().unique(),
  userId: text("user_id")
}, (table) => [
  foreignKey({
    name: "fk_user_id",
    columns: [table.userId],
    foreignColumns: [usersTable.id]
  })
]);
var roomsRelation = relations(roomsTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [roomsTable.userId],
      references: [usersTable.id]
    })
  };
});
var complaintsTable = sqliteTable("complaints", {
  id: text("id").primaryKey(),
  fromUserId: text("from_user_id").notNull(),
  againstUserId: text("against_user_id").notNull(),
  description: text("description").notNull()
}, (table) => [
  foreignKey({
    name: "fk_from_user_id",
    columns: [table.fromUserId],
    foreignColumns: [usersTable.id]
  }),
  foreignKey({
    name: "fk_against_user_id",
    columns: [table.againstUserId],
    foreignColumns: [usersTable.id]
  })
]);
var complaintsRelation = relations(complaintsTable, ({ one }) => {
  return {
    fromUser: one(usersTable, {
      relationName: "from_user_relation",
      fields: [complaintsTable.fromUserId],
      references: [usersTable.id]
    }),
    againstUser: one(usersTable, {
      relationName: "against_user_relation",
      fields: [complaintsTable.againstUserId],
      references: [usersTable.id]
    })
  };
});

// src/db/db.ts
function connect(dbClient) {
  return drizzle(dbClient, { schema: schema_exports });
}
async function execute(dbClient, fn) {
  const db = connect(dbClient);
  return fn(db);
}
var db_default = execute;

// src/services/userService.ts
import { eq } from "drizzle-orm";
var UsersService = class {
  constructor() {
    this.getUsers = this.getUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  async getUsers(c) {
    const users = await db_default(c.env.DB, (db) => {
      return db.query.usersTable.findMany({
        with: {
          room: true,
          fromComplaints: {
            with: {
              againstUser: true
            }
          },
          againstComplaints: {
            with: {
              fromUser: true
            }
          }
        }
      });
    });
    return users;
  }
  async createUser(c, newUser) {
    const userId = crypto.randomUUID();
    const [user] = await db_default(c.env.DB, (db) => {
      return db.insert(usersTable).values({ ...newUser, id: userId }).returning();
    });
    return user;
  }
  async deleteUser(c, userId) {
    const [user] = await db_default(c.env.DB, (db) => {
      return db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
    });
    return user;
  }
};
var usersService = new UsersService();
var userService_default = usersService;

// src/resolvers/usersResolver.ts
var queryResolvers = {
  users: () => {
    const c = getContext();
    return userService_default.getUsers(c);
  }
};
var mutationResolvers = {
  createUser: (name, socialSecurityNumber) => {
    const c = getContext();
    return userService_default.createUser(c, { name, socialSecurityNumber });
  },
  deleteUser: (userId) => {
    const c = getContext();
    return userService_default.deleteUser(c, userId);
  }
};

// src/resolvers/roomsResolver.ts
import { getContext as getContext2 } from "@getcronit/pylon";

// src/services/roomsService.ts
import { sql, eq as eq2 } from "drizzle-orm";
var RoomsService = class {
  constructor() {
    this.getRoom = this.getRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }
  async getRoom(c) {
    const rooms = await db_default(c.env.DB, (db) => {
      return db.query.roomsTable.findMany({
        extras: {
          isVacant: sql`user_id IS Null`.as("is_vacant")
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
  async createRoom(c, newRoom) {
    const [room] = await db_default(c.env.DB, (db) => {
      const roomId = crypto.randomUUID();
      return db.insert(roomsTable).values({ ...newRoom, id: roomId }).returning();
    });
    return room;
  }
  async addTenant(c, userId, roomId) {
    const [room] = await db_default(c.env.DB, (db) => {
      return db.update(roomsTable).set({ userId }).where(eq2(roomsTable.id, roomId)).returning();
    });
    return room;
  }
};
var roomsService = new RoomsService();
var roomsService_default = roomsService;

// src/resolvers/roomsResolver.ts
var queryResolvers2 = {
  rooms: () => {
    const c = getContext2();
    return roomsService_default.getRoom(c);
  }
};
var mutationResolvers2 = {
  createRoom: (roomNumber) => {
    const c = getContext2();
    return roomsService_default.createRoom(c, { roomNumber });
  },
  addTenant(userId, roomId) {
    const c = getContext2();
    return roomsService_default.addTenant(c, userId, roomId);
  }
};

// src/index.ts
import { handler as __internalPylonHandler } from "@getcronit/pylon";
var graphql = {
  Query: {
    ...queryResolvers,
    ...queryResolvers2
  },
  Mutation: {
    ...mutationResolvers,
    ...mutationResolvers2
  }
};
var src_default = app;
var __internalPylonConfig = void 0;
try {
  __internalPylonConfig = config;
} catch {
}
app.use(__internalPylonHandler({
  typeDefs: "type Query {\nrooms: [Rooms!]!\nusers: [Users!]!\n}\ntype Rooms {\nid: String!\nroomNumber: String!\nuserId: String\nisVacant: Any!\nuser: User\n}\ntype User {\nid: String!\nname: String!\nsocialSecurityNumber: String!\nfromComplaints: [FromComplaints!]!\nagainstComplaints: [AgainstComplaints!]!\n}\ntype FromComplaints {\nid: String!\ndescription: String!\nfromUserId: String!\nagainstUserId: String!\nagainstUser: AgainstUser!\n}\ntype AgainstUser {\nid: String!\nname: String!\nsocialSecurityNumber: String!\nroom: Room\n}\ntype Room {\nid: String!\nroomNumber: String!\nuserId: String\n}\ntype AgainstComplaints {\nid: String!\ndescription: String!\nfromUserId: String!\nagainstUserId: String!\nfromUser: FromUser!\n}\ntype FromUser {\nid: String!\nname: String!\nsocialSecurityNumber: String!\nroom: Room\n}\ntype Users {\nid: String!\nname: String!\nsocialSecurityNumber: String!\nroom: Room\nfromComplaints: [FromComplaints_1!]!\nagainstComplaints: [AgainstComplaints_1!]!\n}\ntype FromComplaints_1 {\nid: String!\ndescription: String!\nfromUserId: String!\nagainstUserId: String!\nagainstUser: AgainstUser_1!\n}\ntype AgainstUser_1 {\nid: String!\nname: String!\nsocialSecurityNumber: String!\n}\ntype AgainstComplaints_1 {\nid: String!\ndescription: String!\nfromUserId: String!\nagainstUserId: String!\nfromUser: AgainstUser_1!\n}\ntype Mutation {\ncreateRoom(roomNumber: String!): CreateRoom!\naddTenant(userId: String!, roomId: String!): CreateRoom!\ncreateUser(name: String!, socialSecurityNumber: String!): CreateUser!\ndeleteUser(userId: String!): CreateUser!\n}\ntype CreateRoom {\nid: String!\nroomNumber: String!\nuserId: String\n}\ntype CreateUser {\nid: String!\nname: String!\nsocialSecurityNumber: String!\n}\nscalar ID\nscalar Int\nscalar Float\nscalar Number\nscalar Any\nscalar Void\nscalar Object\nscalar File\nscalar Date\nscalar JSON\nscalar String\nscalar Boolean\n",
  graphql,
  resolvers: {},
  config: __internalPylonConfig
}));
export {
  src_default as default,
  graphql
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2luZGV4LnRzIiwgIi4uL3NyYy9yZXNvbHZlcnMvdXNlcnNSZXNvbHZlci50cyIsICIuLi9zcmMvZGIvZGIudHMiLCAiLi4vc3JjL2RiL3NjaGVtYS50cyIsICIuLi9zcmMvc2VydmljZXMvdXNlclNlcnZpY2UudHMiLCAiLi4vc3JjL3Jlc29sdmVycy9yb29tc1Jlc29sdmVyLnRzIiwgIi4uL3NyYy9zZXJ2aWNlcy9yb29tc1NlcnZpY2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCB9IGZyb20gJ0BnZXRjcm9uaXQvcHlsb24nO1xuXG5pbXBvcnQgKiBhcyB1c2Vyc1Jlc29sdmVyIGZyb20gJ0AvcmVzb2x2ZXJzL3VzZXJzUmVzb2x2ZXInO1xuaW1wb3J0ICogYXMgcm9vbXNSZXNvbHZlciBmcm9tICdAL3Jlc29sdmVycy9yb29tc1Jlc29sdmVyJztcblxuZXhwb3J0IGNvbnN0IGdyYXBocWwgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgLi4udXNlcnNSZXNvbHZlci5xdWVyeVJlc29sdmVycyxcbiAgICAuLi5yb29tc1Jlc29sdmVyLnF1ZXJ5UmVzb2x2ZXJzIFxuICB9LFxuICBNdXRhdGlvbjoge1xuICAgIC4uLnVzZXJzUmVzb2x2ZXIubXV0YXRpb25SZXNvbHZlcnMsXG4gICAgLi4ucm9vbXNSZXNvbHZlci5tdXRhdGlvblJlc29sdmVyc1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcFxuXG4gICAgICBpbXBvcnQge2hhbmRsZXIgYXMgX19pbnRlcm5hbFB5bG9uSGFuZGxlcn0gZnJvbSBcIkBnZXRjcm9uaXQvcHlsb25cIlxuXG4gICAgICBsZXQgX19pbnRlcm5hbFB5bG9uQ29uZmlnID0gdW5kZWZpbmVkXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIF9faW50ZXJuYWxQeWxvbkNvbmZpZyA9IGNvbmZpZ1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGNvbmZpZyBpcyBub3QgZGVjbGFyZWQsIHB5bG9uQ29uZmlnIHJlbWFpbnMgdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGFwcC51c2UoX19pbnRlcm5hbFB5bG9uSGFuZGxlcih7XG4gICAgICAgIHR5cGVEZWZzOiBcInR5cGUgUXVlcnkge1xcbnJvb21zOiBbUm9vbXMhXSFcXG51c2VyczogW1VzZXJzIV0hXFxufVxcbnR5cGUgUm9vbXMge1xcbmlkOiBTdHJpbmchXFxucm9vbU51bWJlcjogU3RyaW5nIVxcbnVzZXJJZDogU3RyaW5nXFxuaXNWYWNhbnQ6IEFueSFcXG51c2VyOiBVc2VyXFxufVxcbnR5cGUgVXNlciB7XFxuaWQ6IFN0cmluZyFcXG5uYW1lOiBTdHJpbmchXFxuc29jaWFsU2VjdXJpdHlOdW1iZXI6IFN0cmluZyFcXG5mcm9tQ29tcGxhaW50czogW0Zyb21Db21wbGFpbnRzIV0hXFxuYWdhaW5zdENvbXBsYWludHM6IFtBZ2FpbnN0Q29tcGxhaW50cyFdIVxcbn1cXG50eXBlIEZyb21Db21wbGFpbnRzIHtcXG5pZDogU3RyaW5nIVxcbmRlc2NyaXB0aW9uOiBTdHJpbmchXFxuZnJvbVVzZXJJZDogU3RyaW5nIVxcbmFnYWluc3RVc2VySWQ6IFN0cmluZyFcXG5hZ2FpbnN0VXNlcjogQWdhaW5zdFVzZXIhXFxufVxcbnR5cGUgQWdhaW5zdFVzZXIge1xcbmlkOiBTdHJpbmchXFxubmFtZTogU3RyaW5nIVxcbnNvY2lhbFNlY3VyaXR5TnVtYmVyOiBTdHJpbmchXFxucm9vbTogUm9vbVxcbn1cXG50eXBlIFJvb20ge1xcbmlkOiBTdHJpbmchXFxucm9vbU51bWJlcjogU3RyaW5nIVxcbnVzZXJJZDogU3RyaW5nXFxufVxcbnR5cGUgQWdhaW5zdENvbXBsYWludHMge1xcbmlkOiBTdHJpbmchXFxuZGVzY3JpcHRpb246IFN0cmluZyFcXG5mcm9tVXNlcklkOiBTdHJpbmchXFxuYWdhaW5zdFVzZXJJZDogU3RyaW5nIVxcbmZyb21Vc2VyOiBGcm9tVXNlciFcXG59XFxudHlwZSBGcm9tVXNlciB7XFxuaWQ6IFN0cmluZyFcXG5uYW1lOiBTdHJpbmchXFxuc29jaWFsU2VjdXJpdHlOdW1iZXI6IFN0cmluZyFcXG5yb29tOiBSb29tXFxufVxcbnR5cGUgVXNlcnMge1xcbmlkOiBTdHJpbmchXFxubmFtZTogU3RyaW5nIVxcbnNvY2lhbFNlY3VyaXR5TnVtYmVyOiBTdHJpbmchXFxucm9vbTogUm9vbVxcbmZyb21Db21wbGFpbnRzOiBbRnJvbUNvbXBsYWludHNfMSFdIVxcbmFnYWluc3RDb21wbGFpbnRzOiBbQWdhaW5zdENvbXBsYWludHNfMSFdIVxcbn1cXG50eXBlIEZyb21Db21wbGFpbnRzXzEge1xcbmlkOiBTdHJpbmchXFxuZGVzY3JpcHRpb246IFN0cmluZyFcXG5mcm9tVXNlcklkOiBTdHJpbmchXFxuYWdhaW5zdFVzZXJJZDogU3RyaW5nIVxcbmFnYWluc3RVc2VyOiBBZ2FpbnN0VXNlcl8xIVxcbn1cXG50eXBlIEFnYWluc3RVc2VyXzEge1xcbmlkOiBTdHJpbmchXFxubmFtZTogU3RyaW5nIVxcbnNvY2lhbFNlY3VyaXR5TnVtYmVyOiBTdHJpbmchXFxufVxcbnR5cGUgQWdhaW5zdENvbXBsYWludHNfMSB7XFxuaWQ6IFN0cmluZyFcXG5kZXNjcmlwdGlvbjogU3RyaW5nIVxcbmZyb21Vc2VySWQ6IFN0cmluZyFcXG5hZ2FpbnN0VXNlcklkOiBTdHJpbmchXFxuZnJvbVVzZXI6IEFnYWluc3RVc2VyXzEhXFxufVxcbnR5cGUgTXV0YXRpb24ge1xcbmNyZWF0ZVJvb20ocm9vbU51bWJlcjogU3RyaW5nISk6IENyZWF0ZVJvb20hXFxuYWRkVGVuYW50KHVzZXJJZDogU3RyaW5nISwgcm9vbUlkOiBTdHJpbmchKTogQ3JlYXRlUm9vbSFcXG5jcmVhdGVVc2VyKG5hbWU6IFN0cmluZyEsIHNvY2lhbFNlY3VyaXR5TnVtYmVyOiBTdHJpbmchKTogQ3JlYXRlVXNlciFcXG5kZWxldGVVc2VyKHVzZXJJZDogU3RyaW5nISk6IENyZWF0ZVVzZXIhXFxufVxcbnR5cGUgQ3JlYXRlUm9vbSB7XFxuaWQ6IFN0cmluZyFcXG5yb29tTnVtYmVyOiBTdHJpbmchXFxudXNlcklkOiBTdHJpbmdcXG59XFxudHlwZSBDcmVhdGVVc2VyIHtcXG5pZDogU3RyaW5nIVxcbm5hbWU6IFN0cmluZyFcXG5zb2NpYWxTZWN1cml0eU51bWJlcjogU3RyaW5nIVxcbn1cXG5zY2FsYXIgSURcXG5zY2FsYXIgSW50XFxuc2NhbGFyIEZsb2F0XFxuc2NhbGFyIE51bWJlclxcbnNjYWxhciBBbnlcXG5zY2FsYXIgVm9pZFxcbnNjYWxhciBPYmplY3RcXG5zY2FsYXIgRmlsZVxcbnNjYWxhciBEYXRlXFxuc2NhbGFyIEpTT05cXG5zY2FsYXIgU3RyaW5nXFxuc2NhbGFyIEJvb2xlYW5cXG5cIixcbiAgICAgICAgZ3JhcGhxbCxcbiAgICAgICAgcmVzb2x2ZXJzOiB7fSxcbiAgICAgICAgY29uZmlnOiBfX2ludGVybmFsUHlsb25Db25maWdcbiAgICAgIH0pKVxuICAgICAgIiwgImltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tIFwiQGdldGNyb25pdC9weWxvblwiO1xuaW1wb3J0IHVzZXJzU2VydmljZSBmcm9tIFwiQC9zZXJ2aWNlcy91c2VyU2VydmljZVwiO1xuXG5jb25zdCBxdWVyeVJlc29sdmVycyA9IHtcbiAgICB1c2VyczogKCkgPT4ge1xuICAgICAgY29uc3QgYyA9IGdldENvbnRleHQoKTtcblxuICAgICAgcmV0dXJuIHVzZXJzU2VydmljZS5nZXRVc2VycyhjKTtcbiAgICB9XG59O1xuXG5jb25zdCBtdXRhdGlvblJlc29sdmVycyA9IHtcbiAgICBjcmVhdGVVc2VyOiAobmFtZTogc3RyaW5nLCBzb2NpYWxTZWN1cml0eU51bWJlcjogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBjID0gZ2V0Q29udGV4dCgpO1xuXG4gICAgICByZXR1cm4gdXNlcnNTZXJ2aWNlLmNyZWF0ZVVzZXIoYywgeyBuYW1lLCBzb2NpYWxTZWN1cml0eU51bWJlciB9KTtcbiAgICB9LFxuICAgIGRlbGV0ZVVzZXI6ICh1c2VySWQ6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgYyA9IGdldENvbnRleHQoKTtcblxuICAgICAgcmV0dXJuIHVzZXJzU2VydmljZS5kZWxldGVVc2VyKGMsIHVzZXJJZCk7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIHF1ZXJ5UmVzb2x2ZXJzLFxuICAgIG11dGF0aW9uUmVzb2x2ZXJzXG59OyIsICJpbXBvcnQgeyBkcml6emxlIH0gZnJvbSAnZHJpenpsZS1vcm0vZDEnO1xuaW1wb3J0ICogYXMgc2NoZW1hIGZyb20gJy4vc2NoZW1hJztcblxuZnVuY3Rpb24gY29ubmVjdChkYkNsaWVudDogRDFEYXRhYmFzZSkge1xuICAgIHJldHVybiBkcml6emxlKGRiQ2xpZW50LCB7IHNjaGVtYSB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZTxUPihkYkNsaWVudDogRDFEYXRhYmFzZSwgZm46IChkYjogUmV0dXJuVHlwZTx0eXBlb2YgY29ubmVjdD4pID0+IFQpOiBQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBkYiA9IGNvbm5lY3QoZGJDbGllbnQpO1xuXG4gICAgcmV0dXJuIGZuKGRiKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4ZWN1dGU7IiwgImltcG9ydCB7IHJlbGF0aW9ucyB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgZm9yZWlnbktleSwgc3FsaXRlVGFibGUsIHRleHQgfSBmcm9tIFwiZHJpenpsZS1vcm0vc3FsaXRlLWNvcmVcIjtcblxuY29uc3QgdXNlcnNUYWJsZSA9IHNxbGl0ZVRhYmxlKCd1c2VycycsIHtcbiAgICBpZDogdGV4dCgnaWQnKS5wcmltYXJ5S2V5KCksXG4gICAgbmFtZTogdGV4dCgnbmFtZScpLm5vdE51bGwoKSxcbiAgICBzb2NpYWxTZWN1cml0eU51bWJlcjogdGV4dCgnc29jaWFsX3NlY3VyaXR5X251bWJlcicpLm5vdE51bGwoKSxcbn0pO1xuXG5jb25zdCB1c2Vyc1JlbGF0aW9uID0gcmVsYXRpb25zKHVzZXJzVGFibGUsICh7IG9uZSwgbWFueSB9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcm9vbTogb25lKHJvb21zVGFibGUpLFxuICAgICAgICBmcm9tQ29tcGxhaW50czogbWFueShjb21wbGFpbnRzVGFibGUsIHtcbiAgICAgICAgICAgIHJlbGF0aW9uTmFtZTogJ2Zyb21fdXNlcl9yZWxhdGlvbidcbiAgICAgICAgfSksXG4gICAgICAgIGFnYWluc3RDb21wbGFpbnRzOiBtYW55KGNvbXBsYWludHNUYWJsZSwge1xuICAgICAgICAgICAgcmVsYXRpb25OYW1lOiAnYWdhaW5zdF91c2VyX3JlbGF0aW9uJ1xuICAgICAgICB9KVxuICAgIH1cbn0pXG5cbmNvbnN0IHJvb21zVGFibGUgPSBzcWxpdGVUYWJsZSgncm9vbXMnLCB7XG4gICAgaWQ6IHRleHQoJ2lkJykucHJpbWFyeUtleSgpLFxuICAgIHJvb21OdW1iZXI6IHRleHQoJ3Jvb21fbnVtYmVyJykubm90TnVsbCgpLnVuaXF1ZSgpLFxuICAgIHVzZXJJZDogdGV4dCgndXNlcl9pZCcpXG59LCAodGFibGUpID0+IFtcbiAgICBmb3JlaWduS2V5KHtcbiAgICAgICAgbmFtZTogJ2ZrX3VzZXJfaWQnLFxuICAgICAgICBjb2x1bW5zOiBbdGFibGUudXNlcklkXSxcbiAgICAgICAgZm9yZWlnbkNvbHVtbnM6IFt1c2Vyc1RhYmxlLmlkXVxuICAgIH0pXG5dKTtcblxuY29uc3Qgcm9vbXNSZWxhdGlvbiA9IHJlbGF0aW9ucyhyb29tc1RhYmxlLCAoeyBvbmUgfSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIHVzZXI6IG9uZSh1c2Vyc1RhYmxlLCB7XG4gICAgICAgICAgICBmaWVsZHM6IFtyb29tc1RhYmxlLnVzZXJJZF0sXG4gICAgICAgICAgICByZWZlcmVuY2VzOiBbdXNlcnNUYWJsZS5pZF1cbiAgICAgICAgfSlcbiAgICB9XG59KTtcblxuY29uc3QgY29tcGxhaW50c1RhYmxlID0gc3FsaXRlVGFibGUoJ2NvbXBsYWludHMnLCB7XG4gICAgaWQ6IHRleHQoJ2lkJykucHJpbWFyeUtleSgpLFxuICAgIGZyb21Vc2VySWQ6IHRleHQoJ2Zyb21fdXNlcl9pZCcpLm5vdE51bGwoKSxcbiAgICBhZ2FpbnN0VXNlcklkOiB0ZXh0KCdhZ2FpbnN0X3VzZXJfaWQnKS5ub3ROdWxsKCksXG4gICAgZGVzY3JpcHRpb246IHRleHQoJ2Rlc2NyaXB0aW9uJykubm90TnVsbCgpXG59LCAodGFibGUpID0+IFtcbiAgICBmb3JlaWduS2V5KHtcbiAgICAgICAgbmFtZTogJ2ZrX2Zyb21fdXNlcl9pZCcsXG4gICAgICAgIGNvbHVtbnM6IFt0YWJsZS5mcm9tVXNlcklkXSxcbiAgICAgICAgZm9yZWlnbkNvbHVtbnM6IFt1c2Vyc1RhYmxlLmlkXVxuICAgIH0pLFxuICAgIGZvcmVpZ25LZXkoe1xuICAgICAgICBuYW1lOiAnZmtfYWdhaW5zdF91c2VyX2lkJyxcbiAgICAgICAgY29sdW1uczogW3RhYmxlLmFnYWluc3RVc2VySWRdLFxuICAgICAgICBmb3JlaWduQ29sdW1uczogW3VzZXJzVGFibGUuaWRdXG4gICAgfSlcbl0pO1xuXG5jb25zdCBjb21wbGFpbnRzUmVsYXRpb24gPSByZWxhdGlvbnMoY29tcGxhaW50c1RhYmxlLCAoeyBvbmUgfSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZyb21Vc2VyOiBvbmUodXNlcnNUYWJsZSwge1xuICAgICAgICAgICAgcmVsYXRpb25OYW1lOiAnZnJvbV91c2VyX3JlbGF0aW9uJyxcbiAgICAgICAgICAgIGZpZWxkczogW2NvbXBsYWludHNUYWJsZS5mcm9tVXNlcklkXSxcbiAgICAgICAgICAgIHJlZmVyZW5jZXM6IFt1c2Vyc1RhYmxlLmlkXVxuICAgICAgICB9KSxcbiAgICAgICAgYWdhaW5zdFVzZXI6IG9uZSh1c2Vyc1RhYmxlLCB7XG4gICAgICAgICAgICByZWxhdGlvbk5hbWU6ICdhZ2FpbnN0X3VzZXJfcmVsYXRpb24nLFxuICAgICAgICAgICAgZmllbGRzOiBbY29tcGxhaW50c1RhYmxlLmFnYWluc3RVc2VySWRdLFxuICAgICAgICAgICAgcmVmZXJlbmNlczogW3VzZXJzVGFibGUuaWRdXG4gICAgICAgIH0pXG4gICAgfVxufSlcblxuZXhwb3J0IHtcbiAgICB1c2Vyc1RhYmxlLFxuICAgIHVzZXJzUmVsYXRpb24sXG4gICAgcm9vbXNUYWJsZSxcbiAgICByb29tc1JlbGF0aW9uLFxuICAgIGNvbXBsYWludHNUYWJsZSxcbiAgICBjb21wbGFpbnRzUmVsYXRpb25cbn07IiwgImltcG9ydCB7IENvbnRleHQgfSBmcm9tICdAZ2V0Y3Jvbml0L3B5bG9uJztcbmltcG9ydCBleGVjdXRlIGZyb20gJ0AvZGIvZGInO1xuaW1wb3J0IHsgVFVzZXJzLCBUVXNlcnNJbnNlcnQgfSBmcm9tICdAL2RiL3ZhbGlkYXRpb24nO1xuaW1wb3J0IHsgdXNlcnNUYWJsZSB9IGZyb20gJ0AvZGIvc2NoZW1hJztcbmltcG9ydCB7IGVxIH0gZnJvbSAnZHJpenpsZS1vcm0nO1xuXG5cbmNsYXNzIFVzZXJzU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2V0VXNlcnMgPSB0aGlzLmdldFVzZXJzLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY3JlYXRlVXNlciA9IHRoaXMuY3JlYXRlVXNlci5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRlbGV0ZVVzZXIgPSB0aGlzLmRlbGV0ZVVzZXIuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRVc2VycyhjOiBDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgZXhlY3V0ZShjLmVudi5EQiwgKGRiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIucXVlcnkudXNlcnNUYWJsZS5maW5kTWFueSh7XG4gICAgICAgICAgICAgICAgd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICByb29tOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBmcm9tQ29tcGxhaW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFnYWluc3RVc2VyOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFnYWluc3RDb21wbGFpbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aXRoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbVVzZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdXNlcnM7XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlVXNlcihjOiBDb250ZXh0LCBuZXdVc2VyOiBUVXNlcnNJbnNlcnQpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gY3J5cHRvLnJhbmRvbVVVSUQoKTtcbiAgICAgICAgY29uc3QgW3VzZXJdID0gYXdhaXQgZXhlY3V0ZShjLmVudi5EQiwgKGRiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuaW5zZXJ0KHVzZXJzVGFibGUpLnZhbHVlcyh7IC4uLm5ld1VzZXIsIGlkOiB1c2VySWQgfSkucmV0dXJuaW5nKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZVVzZXIoYzogQ29udGV4dCwgdXNlcklkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW3VzZXJdID0gYXdhaXQgZXhlY3V0ZShjLmVudi5EQiwgKGRiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuZGVsZXRlKHVzZXJzVGFibGUpLndoZXJlKGVxKHVzZXJzVGFibGUuaWQsIHVzZXJJZCkpLnJldHVybmluZygpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG59XG5cbmNvbnN0IHVzZXJzU2VydmljZSA9IG5ldyBVc2Vyc1NlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IHVzZXJzU2VydmljZTsiLCAiaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ0BnZXRjcm9uaXQvcHlsb24nO1xuXG5pbXBvcnQgcm9vbXNTZXJ2aWNlIGZyb20gJ0Avc2VydmljZXMvcm9vbXNTZXJ2aWNlJztcblxuY29uc3QgcXVlcnlSZXNvbHZlcnMgPSB7XG4gICAgcm9vbXM6ICgpID0+IHtcbiAgICAgIGNvbnN0IGMgPSBnZXRDb250ZXh0KCk7XG5cbiAgICAgIHJldHVybiByb29tc1NlcnZpY2UuZ2V0Um9vbShjKTtcbiAgICB9XG59O1xuXG5jb25zdCBtdXRhdGlvblJlc29sdmVycyA9IHtcbiAgICBjcmVhdGVSb29tOiAocm9vbU51bWJlcjogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBjID0gZ2V0Q29udGV4dCgpO1xuXG4gICAgICByZXR1cm4gcm9vbXNTZXJ2aWNlLmNyZWF0ZVJvb20oYywgeyByb29tTnVtYmVyIH0pO1xuICAgIH0sXG4gICAgYWRkVGVuYW50KHVzZXJJZDogc3RyaW5nLCByb29tSWQ6IHN0cmluZykge1xuICAgICAgY29uc3QgYyA9IGdldENvbnRleHQoKTtcblxuICAgICAgcmV0dXJuIHJvb21zU2VydmljZS5hZGRUZW5hbnQoYywgdXNlcklkLCByb29tSWQpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7XG4gICAgcXVlcnlSZXNvbHZlcnMsXG4gICAgbXV0YXRpb25SZXNvbHZlcnNcbn07IiwgImltcG9ydCB7IHNxbCwgZXEgfSBmcm9tIFwiZHJpenpsZS1vcm1cIjtcblxuaW1wb3J0IGV4ZWN1dGUgZnJvbSBcIkAvZGIvZGJcIjtcbmltcG9ydCB7IHJvb21zVGFibGUgfSBmcm9tIFwiQC9kYi9zY2hlbWFcIjtcbmltcG9ydCB7IFRSb29tc0luc2VydCB9IGZyb20gXCJAL2RiL3ZhbGlkYXRpb25cIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiQGdldGNyb25pdC9weWxvblwiO1xuXG5jbGFzcyBSb29tc1NlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdldFJvb20gPSB0aGlzLmdldFJvb20uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jcmVhdGVSb29tID0gdGhpcy5jcmVhdGVSb29tLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Um9vbShjOiBDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHJvb21zID0gYXdhaXQgZXhlY3V0ZShjLmVudi5EQiwgKGRiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIucXVlcnkucm9vbXNUYWJsZS5maW5kTWFueSh7XG4gICAgICAgICAgICAgICAgZXh0cmFzOiB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFjYW50OiBzcWxgdXNlcl9pZCBJUyBOdWxsYC5hcygnaXNfdmFjYW50JylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHdpdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Db21wbGFpbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFnYWluc3RVc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb29tOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ2FpbnN0Q29tcGxhaW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tVXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm9vbXM7XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlUm9vbShjOiBDb250ZXh0LCBuZXdSb29tOiBUUm9vbXNJbnNlcnQpIHtcbiAgICAgICAgY29uc3QgW3Jvb21dID0gYXdhaXQgZXhlY3V0ZShjLmVudi5EQiwgKGRiKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb29tSWQgPSBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGIuaW5zZXJ0KHJvb21zVGFibGUpLnZhbHVlcyh7IC4uLm5ld1Jvb20sIGlkOiByb29tSWQgfSkucmV0dXJuaW5nKCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJvb207XG4gICAgfVxuXG4gICAgYXN5bmMgYWRkVGVuYW50KGM6IENvbnRleHQsIHVzZXJJZDogc3RyaW5nLCByb29tSWQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBbcm9vbV0gPSBhd2FpdCBleGVjdXRlKGMuZW52LkRCLCAoZGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi51cGRhdGUocm9vbXNUYWJsZSkuc2V0KHsgdXNlcklkIH0pLndoZXJlKGVxKHJvb21zVGFibGUuaWQsIHJvb21JZCkpLnJldHVybmluZygpO1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByb29tO1xuICAgIH1cbn1cblxuY29uc3Qgcm9vbXNTZXJ2aWNlID0gbmV3IFJvb21zU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgcm9vbXNTZXJ2aWNlOyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7QUFBQSxTQUFTLFdBQVc7OztBQ0FwQixTQUFTLGtCQUFrQjs7O0FDQTNCLFNBQVMsZUFBZTs7O0FDQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQVMsaUJBQWlCO0FBQzFCLFNBQVMsWUFBWSxhQUFhLFlBQVk7QUFFOUMsSUFBTSxhQUFhLFlBQVksU0FBUztBQUFBLEVBQ3BDLElBQUksS0FBSyxJQUFJLEVBQUUsV0FBVztBQUFBLEVBQzFCLE1BQU0sS0FBSyxNQUFNLEVBQUUsUUFBUTtBQUFBLEVBQzNCLHNCQUFzQixLQUFLLHdCQUF3QixFQUFFLFFBQVE7QUFDakUsQ0FBQztBQUVELElBQU0sZ0JBQWdCLFVBQVUsWUFBWSxDQUFDLEVBQUUsS0FBSyxLQUFLLE1BQU07QUFDM0QsU0FBTztBQUFBLElBQ0gsTUFBTSxJQUFJLFVBQVU7QUFBQSxJQUNwQixnQkFBZ0IsS0FBSyxpQkFBaUI7QUFBQSxNQUNsQyxjQUFjO0FBQUEsSUFDbEIsQ0FBQztBQUFBLElBQ0QsbUJBQW1CLEtBQUssaUJBQWlCO0FBQUEsTUFDckMsY0FBYztBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNMO0FBQ0osQ0FBQztBQUVELElBQU0sYUFBYSxZQUFZLFNBQVM7QUFBQSxFQUNwQyxJQUFJLEtBQUssSUFBSSxFQUFFLFdBQVc7QUFBQSxFQUMxQixZQUFZLEtBQUssYUFBYSxFQUFFLFFBQVEsRUFBRSxPQUFPO0FBQUEsRUFDakQsUUFBUSxLQUFLLFNBQVM7QUFDMUIsR0FBRyxDQUFDLFVBQVU7QUFBQSxFQUNWLFdBQVc7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxNQUFNLE1BQU07QUFBQSxJQUN0QixnQkFBZ0IsQ0FBQyxXQUFXLEVBQUU7QUFBQSxFQUNsQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQU0sZ0JBQWdCLFVBQVUsWUFBWSxDQUFDLEVBQUUsSUFBSSxNQUFNO0FBQ3JELFNBQU87QUFBQSxJQUNILE1BQU0sSUFBSSxZQUFZO0FBQUEsTUFDbEIsUUFBUSxDQUFDLFdBQVcsTUFBTTtBQUFBLE1BQzFCLFlBQVksQ0FBQyxXQUFXLEVBQUU7QUFBQSxJQUM5QixDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7QUFFRCxJQUFNLGtCQUFrQixZQUFZLGNBQWM7QUFBQSxFQUM5QyxJQUFJLEtBQUssSUFBSSxFQUFFLFdBQVc7QUFBQSxFQUMxQixZQUFZLEtBQUssY0FBYyxFQUFFLFFBQVE7QUFBQSxFQUN6QyxlQUFlLEtBQUssaUJBQWlCLEVBQUUsUUFBUTtBQUFBLEVBQy9DLGFBQWEsS0FBSyxhQUFhLEVBQUUsUUFBUTtBQUM3QyxHQUFHLENBQUMsVUFBVTtBQUFBLEVBQ1YsV0FBVztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sVUFBVTtBQUFBLElBQzFCLGdCQUFnQixDQUFDLFdBQVcsRUFBRTtBQUFBLEVBQ2xDLENBQUM7QUFBQSxFQUNELFdBQVc7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxNQUFNLGFBQWE7QUFBQSxJQUM3QixnQkFBZ0IsQ0FBQyxXQUFXLEVBQUU7QUFBQSxFQUNsQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQU0scUJBQXFCLFVBQVUsaUJBQWlCLENBQUMsRUFBRSxJQUFJLE1BQU07QUFDL0QsU0FBTztBQUFBLElBQ0gsVUFBVSxJQUFJLFlBQVk7QUFBQSxNQUN0QixjQUFjO0FBQUEsTUFDZCxRQUFRLENBQUMsZ0JBQWdCLFVBQVU7QUFBQSxNQUNuQyxZQUFZLENBQUMsV0FBVyxFQUFFO0FBQUEsSUFDOUIsQ0FBQztBQUFBLElBQ0QsYUFBYSxJQUFJLFlBQVk7QUFBQSxNQUN6QixjQUFjO0FBQUEsTUFDZCxRQUFRLENBQUMsZ0JBQWdCLGFBQWE7QUFBQSxNQUN0QyxZQUFZLENBQUMsV0FBVyxFQUFFO0FBQUEsSUFDOUIsQ0FBQztBQUFBLEVBQ0w7QUFDSixDQUFDOzs7QUR0RUQsU0FBUyxRQUFRLFVBQXNCO0FBQ25DLFNBQU8sUUFBUSxVQUFVLEVBQUUsdUJBQU8sQ0FBQztBQUN2QztBQUVBLGVBQWUsUUFBVyxVQUFzQixJQUF1RDtBQUNuRyxRQUFNLEtBQUssUUFBUSxRQUFRO0FBRTNCLFNBQU8sR0FBRyxFQUFFO0FBQ2hCO0FBRUEsSUFBTyxhQUFROzs7QUVUZixTQUFTLFVBQVU7QUFHbkIsSUFBTSxlQUFOLE1BQW1CO0FBQUEsRUFDZixjQUFjO0FBQ1YsU0FBSyxXQUFXLEtBQUssU0FBUyxLQUFLLElBQUk7QUFDdkMsU0FBSyxhQUFhLEtBQUssV0FBVyxLQUFLLElBQUk7QUFDM0MsU0FBSyxhQUFhLEtBQUssV0FBVyxLQUFLLElBQUk7QUFBQSxFQUMvQztBQUFBLEVBRUEsTUFBTSxTQUFTLEdBQVk7QUFDdkIsVUFBTSxRQUFRLE1BQU0sV0FBUSxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU87QUFDMUMsYUFBTyxHQUFHLE1BQU0sV0FBVyxTQUFTO0FBQUEsUUFDaEMsTUFBTTtBQUFBLFVBQ0YsTUFBTTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsWUFDWixNQUFNO0FBQUEsY0FDRixhQUFhO0FBQUEsWUFDakI7QUFBQSxVQUNKO0FBQUEsVUFDQSxtQkFBbUI7QUFBQSxZQUNmLE1BQU07QUFBQSxjQUNGLFVBQVU7QUFBQSxZQUNkO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMLENBQUM7QUFFRCxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRUEsTUFBTSxXQUFXLEdBQVksU0FBdUI7QUFDaEQsVUFBTSxTQUFTLE9BQU8sV0FBVztBQUNqQyxVQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sV0FBUSxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU87QUFDM0MsYUFBTyxHQUFHLE9BQU8sVUFBVSxFQUFFLE9BQU8sRUFBRSxHQUFHLFNBQVMsSUFBSSxPQUFPLENBQUMsRUFBRSxVQUFVO0FBQUEsSUFDOUUsQ0FBQztBQUVELFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFQSxNQUFNLFdBQVcsR0FBWSxRQUFnQjtBQUN6QyxVQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sV0FBUSxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU87QUFDM0MsYUFBTyxHQUFHLE9BQU8sVUFBVSxFQUFFLE1BQU0sR0FBRyxXQUFXLElBQUksTUFBTSxDQUFDLEVBQUUsVUFBVTtBQUFBLElBQzVFLENBQUM7QUFFRCxXQUFPO0FBQUEsRUFDWDtBQUNKO0FBRUEsSUFBTSxlQUFlLElBQUksYUFBYTtBQUN0QyxJQUFPLHNCQUFROzs7QUhwRGYsSUFBTSxpQkFBaUI7QUFBQSxFQUNuQixPQUFPLE1BQU07QUFDWCxVQUFNLElBQUksV0FBVztBQUVyQixXQUFPLG9CQUFhLFNBQVMsQ0FBQztBQUFBLEVBQ2hDO0FBQ0o7QUFFQSxJQUFNLG9CQUFvQjtBQUFBLEVBQ3RCLFlBQVksQ0FBQyxNQUFjLHlCQUFpQztBQUMxRCxVQUFNLElBQUksV0FBVztBQUVyQixXQUFPLG9CQUFhLFdBQVcsR0FBRyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFBQSxFQUNsRTtBQUFBLEVBQ0EsWUFBWSxDQUFDLFdBQW1CO0FBQzlCLFVBQU0sSUFBSSxXQUFXO0FBRXJCLFdBQU8sb0JBQWEsV0FBVyxHQUFHLE1BQU07QUFBQSxFQUMxQztBQUNKOzs7QUl0QkEsU0FBUyxjQUFBQSxtQkFBa0I7OztBQ0EzQixTQUFTLEtBQUssTUFBQUMsV0FBVTtBQU94QixJQUFNLGVBQU4sTUFBbUI7QUFBQSxFQUNmLGNBQWM7QUFDVixTQUFLLFVBQVUsS0FBSyxRQUFRLEtBQUssSUFBSTtBQUNyQyxTQUFLLGFBQWEsS0FBSyxXQUFXLEtBQUssSUFBSTtBQUFBLEVBQy9DO0FBQUEsRUFFQSxNQUFNLFFBQVEsR0FBWTtBQUN0QixVQUFNLFFBQVEsTUFBTSxXQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTztBQUMxQyxhQUFPLEdBQUcsTUFBTSxXQUFXLFNBQVM7QUFBQSxRQUNoQyxRQUFRO0FBQUEsVUFDSixVQUFVLHFCQUFxQixHQUFHLFdBQVc7QUFBQSxRQUNqRDtBQUFBLFFBQ0EsTUFBTTtBQUFBLFVBQ0YsTUFBTTtBQUFBLFlBQ0YsTUFBTTtBQUFBLGNBQ0YsZ0JBQWdCO0FBQUEsZ0JBQ1osTUFBTTtBQUFBLGtCQUNGLGFBQWE7QUFBQSxvQkFDVCxNQUFNO0FBQUEsc0JBQ0YsTUFBTTtBQUFBLG9CQUNWO0FBQUEsa0JBQ0o7QUFBQSxnQkFDSjtBQUFBLGNBQ0o7QUFBQSxjQUNBLG1CQUFtQjtBQUFBLGdCQUNmLE1BQU07QUFBQSxrQkFDRixVQUFVO0FBQUEsb0JBQ04sTUFBTTtBQUFBLHNCQUNGLE1BQU07QUFBQSxvQkFDVjtBQUFBLGtCQUNKO0FBQUEsZ0JBQ0o7QUFBQSxjQUNKO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTCxDQUFDO0FBRUQsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVBLE1BQU0sV0FBVyxHQUFZLFNBQXVCO0FBQ2hELFVBQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxXQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTztBQUMzQyxZQUFNLFNBQVMsT0FBTyxXQUFXO0FBRWpDLGFBQU8sR0FBRyxPQUFPLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDLEVBQUUsVUFBVTtBQUFBLElBQzlFLENBQUM7QUFFRCxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRUEsTUFBTSxVQUFVLEdBQVksUUFBZ0IsUUFBZ0I7QUFDeEQsVUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLFdBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPO0FBQzNDLGFBQU8sR0FBRyxPQUFPLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsTUFBTUMsSUFBRyxXQUFXLElBQUksTUFBTSxDQUFDLEVBQUUsVUFBVTtBQUFBLElBQzVGLENBQUM7QUFFRCxXQUFPO0FBQUEsRUFDWDtBQUNKO0FBRUEsSUFBTSxlQUFlLElBQUksYUFBYTtBQUN0QyxJQUFPLHVCQUFROzs7QURqRWYsSUFBTUMsa0JBQWlCO0FBQUEsRUFDbkIsT0FBTyxNQUFNO0FBQ1gsVUFBTSxJQUFJQyxZQUFXO0FBRXJCLFdBQU8scUJBQWEsUUFBUSxDQUFDO0FBQUEsRUFDL0I7QUFDSjtBQUVBLElBQU1DLHFCQUFvQjtBQUFBLEVBQ3RCLFlBQVksQ0FBQyxlQUF1QjtBQUNsQyxVQUFNLElBQUlELFlBQVc7QUFFckIsV0FBTyxxQkFBYSxXQUFXLEdBQUcsRUFBRSxXQUFXLENBQUM7QUFBQSxFQUNsRDtBQUFBLEVBQ0EsVUFBVSxRQUFnQixRQUFnQjtBQUN4QyxVQUFNLElBQUlBLFlBQVc7QUFFckIsV0FBTyxxQkFBYSxVQUFVLEdBQUcsUUFBUSxNQUFNO0FBQUEsRUFDakQ7QUFDSjs7O0FMTE0sU0FBUSxXQUFXLDhCQUE2QjtBQWIvQyxJQUFNLFVBQVU7QUFBQSxFQUNyQixPQUFPO0FBQUEsSUFDTCxHQUFpQjtBQUFBLElBQ2pCLEdBQWlCRTtBQUFBLEVBQ25CO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUixHQUFpQjtBQUFBLElBQ2pCLEdBQWlCQztBQUFBLEVBQ25CO0FBQ0Y7QUFFQSxJQUFPLGNBQVE7QUFJVCxJQUFJLHdCQUF3QjtBQUU1QixJQUFJO0FBQ0YsMEJBQXdCO0FBQzFCLFFBQVE7QUFFUjtBQUVBLElBQUksSUFBSSx1QkFBdUI7QUFBQSxFQUM3QixVQUFVO0FBQUEsRUFDVjtBQUFBLEVBQ0EsV0FBVyxDQUFDO0FBQUEsRUFDWixRQUFRO0FBQ1YsQ0FBQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJnZXRDb250ZXh0IiwgImVxIiwgImVxIiwgInF1ZXJ5UmVzb2x2ZXJzIiwgImdldENvbnRleHQiLCAibXV0YXRpb25SZXNvbHZlcnMiLCAicXVlcnlSZXNvbHZlcnMiLCAibXV0YXRpb25SZXNvbHZlcnMiXQp9Cg==
