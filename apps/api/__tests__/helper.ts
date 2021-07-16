import { ObjectID } from 'mongodb';
import { connect, disconnect, getAllCollection } from '../src/db';

export async function initDb() {
  await connect();
}

export async function resetDb() {
  await Promise.all(
    getAllCollection().map(collection => collection.deleteMany({}))
  );
}

export function getId(nr: number) {
  return ObjectID.createFromHexString(nr.toString().padStart(24, '0'));
}

export function setupDb() {
  beforeAll(initDb);
  beforeEach(resetDb);
  afterAll(() => {
    return disconnect(true);
  });
}
