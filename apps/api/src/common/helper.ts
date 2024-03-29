import crypto from 'crypto';
import cryptoAsync from 'mz/crypto';
import { Response } from 'node-fetch';
import { WorkspaceNodeModel } from '../collections/WorkspaceNode';
import { ObjectID } from 'mongodb2';
import { config } from 'config';
import { SubmissionNodeModel } from '../collections/Submission';
import { countryList } from 'shared';

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

export function safeValues<T>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as any;
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

export function sleep(timeout: number) {
  return new Promise<void>(resolve => setTimeout(resolve, timeout));
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

export async function getResponseBody<T = any>(opName: string, res: Response) {
  if (res.status < 200 || res.status >= 300) {
    const msg = `${opName} failed with code: ${res.status}`;
    console.error(msg, {
      responseText: await res.text(),
    });
    throw new Error(msg);
  }
  const body = await res.json();
  if (body.error) {
    const msg = `${opName} failed with code: ${
      body.error_description || body.error
    }`;
    console.error(msg, {
      body,
    });
    throw new Error(msg);
  }
  return body as T;
}

export function getUserAvatarUploadKey(userId: string) {
  return `avatar-upload/${userId}`;
}

export function doFn<T>(fn: () => T) {
  return fn();
}

export function getChallengeId(values: {
  moduleId: number;
  challengeModuleId: number;
}) {
  return `${values.moduleId}_${values.challengeModuleId}`;
}

export function renameId<T extends { _id: any }>(
  obj: T
): Omit<T, '_id'> & { id: string } {
  const ret: any = { ...obj };
  ret.id = ret._id.toString();
  delete ret._id;
  return ret;
}

export function revertRenameId<T extends { id: any }>(
  obj: T
): Omit<T, 'id'> & { _id: string } {
  const ret: any = { ...obj };
  ret._id = ret.id.toString();
  delete ret.id;
  return ret;
}

export function getWorkspaceNodeS3Key(item: WorkspaceNodeModel) {
  return `${getWorkspaceS3Prefix(item.workspaceId)}${item._id}`;
}

export function getWorkspaceS3Prefix(workspaceId: ObjectID) {
  return `cdn/workspace/${workspaceId}/`;
}
export function getSubmissionS3Prefix(submissionId: ObjectID) {
  return `cdn/submission/${submissionId}/`;
}

export function getSubmissionNodeS3Key(
  submissionId: ObjectID,
  item: SubmissionNodeModel
) {
  return `${getSubmissionS3Prefix(submissionId)}${item._id}`;
}

export function getCDNUrl(s3Key: string) {
  return config.cdnBaseUrl + s3Key.replace(/^cdn/, '');
}

export function getNotifyTestPubKey(options: {
  userId: string;
  challengeId: string;
}) {
  const { challengeId, userId } = options;
  return `NOTIFY_TEST:${challengeId}:${userId}`;
}

export function countryNameToCode(name: string | undefined | null) {
  if (!name) {
    return undefined;
  }
  return countryList.find(x => x.name.toLowerCase() === name.toLowerCase())
    ?.code;
}
