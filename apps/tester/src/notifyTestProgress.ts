import fetch from 'cross-fetch';
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

export async function notifyTestProgress(
  apiBaseUrl: string,
  notifyKey: string,
  data: any
) {
  try {
    const res = await fetch(`${apiBaseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation notifyTestProgress($notifyKey: String!, $data: [TestProgressData!]!) {
        notifyTestProgress(notifyKey: $notifyKey, data: $data)
      }`,
        variables: {
          notifyKey,
          data,
        },
      }),
      // @ts-expect-error
      agent,
    });
    const text = await res.text();
    console.log(text);
    if (res.status !== 200) {
      console.error('failed to notify result, status: ' + res.status, text);
    }
  } catch (e) {
    console.error('failed to notify result', e);
  }
}
