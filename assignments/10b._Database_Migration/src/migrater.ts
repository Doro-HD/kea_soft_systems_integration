import oldDB from './oldDB';
import { users as oldUsers } from './schema';

import newDB from './newDB';

function getUsersFromOldDB() {
    console.log('Fetching users from old db');
    return oldDB.select().from(oldUsers);
}

function addUsersToNewDB(users: typeof oldUsers.$inferSelect[]) {
    console.log('Inserting users in new db');
    newDB.collection('users').insertMany(users);
    console.log('Finished inserting users in new db');
}

const users = await getUsersFromOldDB();
console.log('Users were fetched from old db');
addUsersToNewDB(users);