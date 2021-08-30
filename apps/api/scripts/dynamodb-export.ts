import AWS from 'aws-sdk';
import Path from 'path';
import fs from 'fs';
import { Converter } from 'aws-sdk/clients/dynamodb';
import credentials from './aws-credentials.json';

AWS.config.region = 'eu-central-1';
AWS.config.credentials = credentials;

const dynamodb = new AWS.DynamoDB();

const TABLE_NAME = 'pd-production-main29F6D6A38-HZCVW5Q9MITF';

const items: any[] = [];

async function fetch(key?: any) {
  const ret = await dynamodb
    .scan({
      TableName: TABLE_NAME,
      ExclusiveStartKey: key,
    })
    .promise();
  items.push(
    ...ret
      .Items!.map(item => Converter.unmarshall(item))
      .filter(x => x.entityType === 'User')
  );
  if (ret.LastEvaluatedKey) {
    await fetch(ret.LastEvaluatedKey);
  }
}

void fetch().then(() => {
  fs.writeFileSync(
    Path.join(__dirname, './dynamo-data.json'),
    JSON.stringify(items)
  );
});
