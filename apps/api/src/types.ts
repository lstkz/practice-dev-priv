import { Resolvers as BaseResolvers } from './generated';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from './collections/User';

export type Handler = (req: Request, res: Response, next: NextFunction) => void;

export type AppContext = {
  ensureAdmin: () => void;
  getUser: () => AppUser;
  getUserOrAnonymous: () => AppUser | null;
  getToken: () => string;
};

export interface AppUser extends UserModel {}

declare module 'express' {
  interface Request {
    user: AppUser;
  }
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

export interface TestSubmissionTask {
  type: 'TestSubmission';
  payload: {
    submissionId: string;
  };
}

export interface CloneWorkspaceFilesTask {
  type: 'CloneWorkspaceFiles';
  payload: {
    submissionId: string;
  };
}

export interface ButtonActionTemplateProps {
  unsubscribeLink?: string;
  header: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export type AppTask =
  | SendEmailTask
  | TestSubmissionTask
  | CloneWorkspaceFilesTask;

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

export type MapProps<T, K> = Omit<T, keyof K> & K;
