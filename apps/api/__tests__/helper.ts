import { ObjectID } from 'mongodb';
import { UserCollection } from '../src/collections/User';
import { connect, disconnect, getAllCollection } from '../src/db';
import { AppUser } from '../src/types';

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

export function getUUID(nr: number) {
  return `00000000-0000-4000-8000-` + nr.toString().padStart(12, '0');
}

export function setupDb() {
  beforeAll(initDb);
  beforeEach(resetDb);
  afterAll(() => {
    return disconnect(true);
  });
}

export function getTokenOptions(token: string) {
  return {
    req: {
      headers: {
        authorization: token,
      },
    },
  };
}

export async function getAppUser(id: number): Promise<AppUser> {
  const dbUser = await UserCollection.findByIdOrThrow(getId(id));
  return {
    email: dbUser.email,
    id: dbUser._id,
    username: dbUser.username,
  };
}

export function serializeGraphqlInput(values: Record<string, any>) {
  Object.keys(values).forEach(key => {
    if (values[key] instanceof ObjectID) {
      values[key] = values[key].toString();
    }
  });
  return values;
}
