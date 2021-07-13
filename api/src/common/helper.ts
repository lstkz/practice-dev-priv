import { toApolloError } from 'apollo-server';
import * as z from 'zod';
import crypto from 'crypto';
import { EMAIL_SENDER } from '../config';
import { ses } from '../aws';

export function safeExtend<T, U>(obj: T, values: U): T & U {
  return Object.assign(obj, values);
}

export function safeKeys<T>(obj: T): Array<keyof T> {
  return Object.keys(obj) as any;
}

export function safeAssign<T>(obj: T, values: Partial<T>) {
  return Object.assign(obj, values);
}

export function randomUniqString() {
  return randomString(15);
}

export function randomString(len: number) {
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = randomInt() % charSet.length;
    randomString += charSet[randomPoz];
  }
  return randomString;
}

export function randomInt() {
  return crypto.randomBytes(4).readUInt32BE(0);
}

export function validate<T>(schema: z.ZodObject<any, any, T>, input: T) {
  try {
    schema.parse(input);
  } catch (e) {
    throw toApolloError(e, 'VALIDATION_ERROR');
  }
}

export function sendEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  return ses
    .sendEmail({
      Source: EMAIL_SENDER,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: message,
          },
        },
      },
    })
    .promise();
}
