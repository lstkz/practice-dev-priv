function getString(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Configuration ${name} is not set`);
  }
  return value;
}

export const MONGODB_URI = getString('MONGODB_URI');
export const MONGODB_DB_NAME = getString('MONGODB_DB_NAME');
export const EMAIL_SENDER = getString('EMAIL_SENDER');
export const BASE_APP_URL = getString('BASE_APP_URL');
export const SES_REGION = getString('SES_REGION');
