import { ObjectID } from 'mongodb';
import { Resolvers as BaseResolvers } from './generated';

export type AppContext = {
  getUser: () => AppUser;
  getUserOrAnonymous: () => AppUser | null;
  getToken: () => string;
};

export interface AppUser {
  id: ObjectID;
  email: string;
  username: string;
}

export type Resolvers = BaseResolvers<AppContext>;

export type EmailTemplate = {
  type: 'actionButton';
  variables: {
    subject: string;
    title: string;
    content: string;
    link_text: string;
    link_url: string;
  };
};

export interface SendEmailTask {
  type: 'SendEmail';
  payload: {
    to: string;
    template: EmailTemplate;
  };
}

export interface ButtonActionTemplateProps {
  unsubscribeLink?: string;
  header: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export type AppTask = SendEmailTask;

export interface UserRegisteredEvent {
  type: 'UserRegistered';
  payload: { userId: string };
}

export interface UserEmailVerifiedEvent {
  type: 'UserEmailVerified';
  payload: { userId: string };
}

export interface UserEmailUpdatedEvent {
  type: 'UserEmailUpdated';
  payload: { userId: string };
}

export type AppEvent =
  | UserRegisteredEvent
  | UserEmailVerifiedEvent
  | UserEmailUpdatedEvent;

type ExtractType<T> = T extends { type: infer S } ? S : never;

export type AppEventType = ExtractType<Pick<AppEvent, 'type'>>;
export type AppTaskType = ExtractType<Pick<AppTask, 'type'>>;
