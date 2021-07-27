import { MongoClient, MongoClientOptions, TransactionOptions } from 'mongodb';
import * as R from 'remeda';
import { initCreateCollection } from './createCollection';
import { dbSessionStorage } from './dbSessionStorage';
import { DbCollection } from './types';

export interface InitOptions {
  uri: string;
  dbName?: string;
  options?: MongoClientOptions | undefined;
  // baseDirectory: string;
  collections: () => any[];
}

let client: MongoClient | null = null;
let isCreated = false;

export function initDb(options: InitOptions) {
  const createCollections = async () => {
    if (isCreated) {
      return;
    }
    await Promise.all(
      getAllCollection().map(async (collection: any) => {
        await collection.createCollection();
        await collection.initIndex();
      })
    );
    isCreated = true;
  };

  const connect = async () => {
    if (!client || !client.isConnected()) {
      client = new MongoClient(options.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...(options.options ?? {}),
      });
      await client.connect();
      await createCollections();
    }
    return client;
  };

  const disconnect = async (force?: boolean) => {
    await client?.close(force);
  };

  const startSession = async () => {
    if (!client) {
      throw new Error('Not connected');
    }
    return client.startSession();
  };

  const getClient = () => {
    if (!client) {
      throw new Error('client is not set');
    }
    return client;
  };

  const getDb = () => {
    const client = getClient();
    return client.db(
      process.env.JEST_WORKER_ID
        ? `jest-${options.dbName}-${process.env.JEST_WORKER_ID}`
        : options.dbName
    );
  };

  const withTransaction = async <T extends () => Promise<void>>(
    fn: T,
    options?: TransactionOptions
  ) => {
    const session = await startSession();
    try {
      return await dbSessionStorage.run(session, async () => {
        return session.withTransaction(fn, options);
      });
    } finally {
      session.endSession();
    }
  };

  const getAllCollection = (): Array<DbCollection<any>> => {
    return R.pipe(
      options.collections(),
      R.map(item => Object.values(item)),
      R.flatten,
      R.filter((x: any) => x.createCollection)
    ) as any;
  };

  return {
    connect,
    disconnect,
    startSession,
    getClient,
    getDb,
    createCollection: initCreateCollection(getDb),
    withTransaction,
    getAllCollection,
  };
}
