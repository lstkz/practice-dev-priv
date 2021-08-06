import fetch from 'cross-fetch';

// IMPORTS
import { AwsUploadContentAuth } from './types';
// IMPORTS END

export class APIClient {
  constructor(private baseUrl: string, public getToken: () => string | null) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // SIGNATURES
  aws_getAwsUploadContentAuth(): Promise<AwsUploadContentAuth> {
    return this.call('aws.getAwsUploadContentAuth', {});
  }
  // SIGNATURES END
  private async call(name: string, params: any): Promise<any> {
    const token = this.getToken();
    const headers: any = {
      'content-type': 'application/json',
    };
    if (token) {
      headers['authorization'] = token;
    }

    const res = await fetch(`${this.baseUrl}/rpc/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    const body = await res.json();
    if (res.status !== 200) {
      const err: any = new Error(body.error || 'Failed to call API');
      err.res = res;
      err.body = body;
      throw err;
    }
    return body;
  }
}
