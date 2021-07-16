import { ContractMeta, initialize } from 'contract';
import { ObjectSchema, StringSchema } from 'schema';
import AWS from 'aws-sdk';
import { AppEvent, AppEventType, AppTask, AppTaskType, AppUser } from './types';
import { config } from 'config';
import { Ampq } from './ampq/Ampq';
import { ObjectID } from 'mongodb';
import { addShownDownAction } from './shutdown';

export interface CreateRpcBindingOptions {
  verified?: true;
  injectUser?: boolean;
  pro?: boolean;
  public?: true;
  admin?: true;
  wrapAsValues?: true;
  signature: string;
  handler: ((...args: any[]) => any) & ContractMeta<any>;
}

export interface BaseBinding<T, U> {
  isBinding: boolean;
  type: T;
  options: U;
}

export interface RpcBinding
  extends BaseBinding<'rpc', CreateRpcBindingOptions> {}

export function createRpcBinding(options: CreateRpcBindingOptions): RpcBinding {
  return {
    isBinding: true,
    type: 'rpc',
    options,
  };
}

type ExtractPayload<T> = T extends { payload: infer S } ? S : never;

type ExtractEvent<T> = AppEvent extends { type: infer K }
  ? K extends T
    ? ExtractPayload<Pick<AppEvent, 'payload'>>
    : never
  : never;

type ExtractTask<T> = AppTask extends { type: infer K }
  ? K extends T
    ? ExtractPayload<Pick<AppTask, 'payload'>>
    : never
  : never;

export interface CreateEventBindingOptions<T extends AppEventType> {
  type: T;
  handler: (messageId: string, event: ExtractEvent<T>) => Promise<void>;
}

export interface CreateTaskBindingOptions<T extends AppTaskType> {
  type: T;
  handler: (messageId: string, task: ExtractTask<T>) => Promise<void>;
}

export interface EventBinding<T extends AppEventType>
  extends BaseBinding<'event', CreateEventBindingOptions<T>> {}

export interface TaskBinding<T extends AppTaskType>
  extends BaseBinding<'task', CreateTaskBindingOptions<T>> {}

export function createEventBinding<T extends AppEventType>(
  options: CreateEventBindingOptions<T>
): EventBinding<T> {
  return {
    isBinding: true,
    type: 'event',
    options,
  };
}

export function createTaskBinding<T extends AppTaskType>(
  options: CreateTaskBindingOptions<T>
): TaskBinding<T> {
  return {
    isBinding: true,
    type: 'task',
    options,
  };
}

AWS.config.update({ region: config.aws.region });

export const ses = new AWS.SES({
  region: config.aws.sesRegion,
});

export const s3 = new AWS.S3();

export const ec2 = new AWS.EC2();

export const route53 = new AWS.Route53();

export const { createContract } = initialize({
  debug: process.env.NODE_ENV === 'development',
});

declare module 'schema/src/StringSchema' {
  interface StringSchema<TReq, TNull, TOutput> {
    objectId(): StringSchema<TReq, TNull, ObjectID>;
  }
}

declare module 'schema/src/ObjectSchema' {
  interface ObjectSchema<TReq, TNull, TKeys> {
    appUser(): ObjectSchema<TReq, TNull, AppUser>;
  }
}

StringSchema.prototype.objectId = function objectId(this: StringSchema) {
  return this.regex(/^[a-f0-9]{24}$/)
    .input(value => (value?.toHexString ? value.toHexString() : value))
    .output<ObjectID>(value => ObjectID.createFromHexString(value));
};

ObjectSchema.prototype.appUser = function appUser(this: ObjectSchema) {
  return this.as<AppUser>().unknown();
};

export const ampq = new Ampq({
  ...config.rabbit,
  eventQueueSuffix: config.api.eventQueueSuffix,
});

addShownDownAction(50, () => ampq.shutdown());
