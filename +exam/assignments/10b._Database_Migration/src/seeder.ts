import { seed } from 'drizzle-seed';
import oldDB from './oldDB';
import { users as oldUsers } from './schema';

seed(oldDB, { users: oldUsers }).refine((funcs) => {
    return {
        users: {
            count: 100,
            columns: {
                id: funcs.uuid(),
                username: funcs.firstName(),
                email: funcs.email()
            }
        }
    }
})