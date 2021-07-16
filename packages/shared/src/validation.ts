import { S } from 'schema';

export const PASSWORD_MIN_LENGTH = 5;
export const getPasswordSchema = () => S.string().min(PASSWORD_MIN_LENGTH);
export const getUsernameSchema = () =>
  S.string()
    .trim()
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,20}$/i)
    .min(3)
    .max(20);

export const EMAIL_REGEX = /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
