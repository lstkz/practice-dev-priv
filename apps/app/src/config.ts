export const IS_SSR = typeof document === 'undefined';

export const API_URL = process.env.API_URL!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;

if (!API_URL) {
  throw new Error('API_URL is not set');
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not set');
}

if (!GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}
