import assert from 'assert';
import { MongoConnection, MongoStore } from 'liwi-mongo';

const connection = new MongoConnection(
  new Map([['database', 'liwi-mongo-example']]),
);

interface User {
  _id: string;
  created: Date;
  updated: Date;
  firstname: string;
  lastname: string;
}

const users: MongoStore<User> = new MongoStore(connection, 'users');

(async function main() {
  await users.deleteMany({});
  const allUsers = await users.findAll();

  assert(allUsers.length === 0, 'Database is not empty');

  const user = {
    firstname: 'John',
    lastname: 'Doe',
  };
  const insertedUser = await users.insertOne(user);

  assert(insertedUser === user);

  assert(insertedUser.created);
  assert(insertedUser.updated);

  connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});