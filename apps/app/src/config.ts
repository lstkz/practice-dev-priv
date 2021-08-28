export const IS_SSR = typeof document === 'undefined';

export const API_URL = process.env.API_URL!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const CDN_BASE_URL = process.env.CDN_BASE_URL!;
export const IFRAME_ORIGIN = process.env.IFRAME_ORIGIN!;

if (!API_URL) {
  throw new Error('API_URL is not set');
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not set');
}

if (!GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!CDN_BASE_URL) {
  throw new Error('CDN_BASE_URL is not set');
}

if (!IFRAME_ORIGIN) {
  throw new Error('IFRAME_ORIGIN is not set');
}

export const IDE_MOBILE_THRESHOLD = 650;

export const CRYPTO_LINK =
  'https://app.uniswap.org/#/swap?outputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

export const DISCORD_LINK = 'https://discord.gg/76PceHgyf6';

export const GITHUB_LINK = 'https://github.com/practice-dev/practice-dev';

if (!process.env.SEGMENT_KEY) {
  throw new Error('SEGMENT_KEY is not set');
}
export const SEGMENT_KEY =
  process.env.SEGMENT_KEY === '-1' ? -1 : process.env.SEGMENT_KEY;
