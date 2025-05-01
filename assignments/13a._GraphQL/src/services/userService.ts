import { Context } from '@getcronit/pylon';
import execute from '@/db/db';
import { TUsers, TUsersInsert } from '@/db/validation';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';


class UsersService {
    constructor() {
        this.getUsers = this.getUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async getUsers(c: Context) {
        const users = await execute(c.env.DB, (db) => {
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

    async createUser(c: Context, newUser: TUsersInsert) {
        const userId = crypto.randomUUID();
        const [user] = await execute(c.env.DB, (db) => {
            return db.insert(usersTable).values({ ...newUser, id: userId }).returning();
        });

        return user;
    }

    async deleteUser(c: Context, userId: string) {
        const [user] = await execute(c.env.DB, (db) => {
            return db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
        });

        return user;
    }
}

const usersService = new UsersService();
export default usersService;