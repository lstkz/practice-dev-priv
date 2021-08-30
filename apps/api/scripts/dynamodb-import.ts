/* eslint-disable no-console */
// @ts-ignore
import dynamoData from './dynamo-data.json';
import * as R from 'remeda';
import { APIClient } from 'shared';

const client = new APIClient('http://localhost:3001', () => 'admin-wOcAcBPqRt');

R.chunk(dynamoData, 100).map((data: any[]) =>
  client.migrate_importLegacyUsers(data)
);
