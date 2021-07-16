import { toApolloError } from 'apollo-server';
import * as z from 'zod';
import crypto from 'crypto';
import cryptoAsync from 'mz/crypto';

const SECURITY = {
  SALT_LENGTH: 64,
  ITERATIONS: 4096,
  PASSWORD_LENGTH: 64,
};

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
  } catch (e: any) {
    throw toApolloError(e, 'VALIDATION_ERROR');
  }
}

export function sleep(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function getDuration(n: number, type: 's' | 'm' | 'h' | 'd') {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = 24 * hours;
  switch (type) {
    case 's': {
      return n * seconds;
    }
    case 'm': {
      return n * minutes;
    }
    case 'h': {
      return n * hours;
    }
    case 'd': {
      return n * days;
    }
  }
}

export async function randomSalt() {
  const buffer = await cryptoAsync.randomBytes(SECURITY.SALT_LENGTH);
  return buffer.toString('hex');
}

export async function createPasswordHash(password: string, salt: string) {
  const hash = await cryptoAsync.pbkdf2(
    password,
    salt,
    SECURITY.ITERATIONS,
    SECURITY.PASSWORD_LENGTH,
    'sha1'
  );
  return hash.toString('hex');
}

export function getCurrentDate() {
  return new Date(Date.now());
}
