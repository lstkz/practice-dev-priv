import { initDb } from '../../../packages/mongodb2';
import { MONGODB_DB_NAME, MONGODB_URI } from './config';

export const { createCollection, connect, withTransaction } = initDb({
  collections: () => [
    require('./collections/AccessToken'),
    require('./collections/User'),
    require('./collections/ResetPasswordCode'),
    // APPEND
  ],
  uri: MONGODB_URI,
  dbName: MONGODB_DB_NAME,
});
