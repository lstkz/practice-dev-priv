import { GetServerSideProps } from 'next';
import { CDN_BASE_URL } from 'src/config';
import { createCookie, readCookie, removeCookie } from './cookie';

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(
      `Unreachable case: ${typeof val === 'string' ? val : JSON.stringify(val)}`
    );
  }
}

export const createGetServerSideProps: <T>(
  fn: GetServerSideProps<T>
) => GetServerSideProps<T> = fn => async context => {
  try {
    return await fn(context);
  } catch (e: any) {
    const code = e?.graphQLErrors?.[0]?.extensions?.code;
    if (code === 'UNAUTHENTICATED') {
      context.res.setHeader(
        'Set-Cookie',
        'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    throw e;
  }
};

export const getAccessToken = () => {
  return readCookie('token');
};

export const setAccessToken = (token: string) => {
  createCookie('token', token);
};

export const clearAccessToken = () => {
  removeCookie('token');
};

export function doFn<T>(fn: () => T): T {
  return fn();
}

export function safeAssign<T>(obj: T, values: Partial<T>) {
  return Object.assign(obj, values);
}

export function safeExtend<T, U>(obj: T, values: U): T & U {
  return Object.assign(obj, values);
}

export function safeKeys<T>(obj: T): Array<keyof T> {
  return Object.keys(obj) as any;
}

export function getErrorMessage(e: any) {
  if (e?.status === 0) {
    return 'Cannot connect to API';
  }
  const message = e?.response?.error || e.message;
  return message.replace('ContractError: ', '');
}

export function getAvatarUrl(avatarId: string, size: 80 | 280) {
  return CDN_BASE_URL + `/avatars/${avatarId}-${size}x${size}.png`;
}

export function getCDNUrl(s3Key: string) {
  return CDN_BASE_URL + s3Key.replace(/^cdn/, '');
}
