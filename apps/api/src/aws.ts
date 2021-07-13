import AWS from 'aws-sdk';
import { SES_REGION } from './config';

export const ses = new AWS.SES({
  region: SES_REGION,
});
