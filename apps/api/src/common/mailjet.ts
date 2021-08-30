import { config } from 'config';
import https from 'https';
import fetch from 'cross-fetch';
import { EmailTemplate } from '../types';

const agent = new https.Agent({
  keepAlive: true,
});
const DOMAIN = 'https://api.mailjet.com';

const auth = Buffer.from(
  `${config.mailjet.publicKey}:${config.mailjet.privateKey}`
).toString('base64');

export interface MailjetList<T> {
  Count: number;
  Total: number;
  Data: T[];
}

export interface MailjetContact {
  CreatedAt: string;
  DeliveredCount: number;
  Email: string;
  ExclusionFromCampaignsUpdatedAt: string;
  ID: number;
  IsExcludedFromCampaigns: boolean;
  IsOptInPending: boolean;
  IsSpamComplaining: boolean;
  LastActivityAt: string;
  LastUpdateAt: string;
  Name: string;
  UnsubscribedAt: string;
  UnsubscribedBy: string;
}

export interface MailjetSubscription {
  IsUnsub: boolean;
  ListID: number;
  SubscribedAt: string;
}

interface RequestOptions {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch';
  body?: any;
  null404?: boolean;
}

async function _request<T>(options: RequestOptions): Promise<T> {
  const { url, method, body, null404 } = options;
  const fullUrl = `${DOMAIN}${url}`;
  const res = await fetch(fullUrl, {
    method: method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'content-type': 'application/json',
      Authorization: 'Basic ' + auth,
    },
    // @ts-ignore
    agent: agent,
  });
  if (res.status === 404 && null404) {
    return null!;
  }
  const text = await res.text();
  if (res.status < 200 || res.status > 299) {
    throw new Error(
      `${method} ${fullUrl}. Failed to perform mailjet action. Status: ${res.status}. Text: ${text}`
    );
  }
  if (!text) {
    return null!;
  }
  try {
    return JSON.parse(text) as any;
  } catch (e) {
    throw new Error(`Failed to parse JSON from mailjet: ${text}`);
  }
}

interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
}

export async function sendMailjetEmail(options: SendEmailOptions) {
  const { template, to } = options;
  await _request({
    method: 'post',
    url: '/v3.1/send',
    body: {
      Messages: [
        {
          From: {
            Email: config.mailjet.senderEmail,
            Name: config.mailjet.senderName,
          },
          To: [
            {
              Email: to,
            },
          ],
          TemplateID: config.mailjet.templates[template.type],
          TemplateLanguage: true,
          Variables: template.variables,
        },
      ],
    },
  });
}

export async function getContact(email: string) {
  const ret = await _request<MailjetList<MailjetContact>>({
    method: 'get',
    url: '/v3/REST/contact/' + email,
    null404: true,
  });
  if (!ret) {
    return null;
  }
  return ret.Data[0];
}

export async function ensureContractExist(email: string) {
  const existing = await getContact(email);
  if (!existing) {
    await createContact({ email });
  }
}

interface CreateContactValues {
  email: string;
  name?: string;
  isExcludedFromCampaigns?: boolean;
}

export async function createContact(values: CreateContactValues) {
  const ret = await _request<MailjetList<MailjetContact>>({
    method: 'post',
    url: '/v3/REST/contact',
    body: values,
  });
  return ret.Data[0];
}

export async function getContactList(email: string) {
  const ret = await _request<MailjetList<MailjetSubscription>>({
    method: 'get',
    url: '/v3/REST/contact/' + email + '/getcontactslists',
  });
  return ret.Data;
}

export async function updateListSubscription(
  email: string,
  listId: number,
  action: 'addforce' | 'addnoforce' | 'remove' | 'unsub'
) {
  const ret = await _request<MailjetList<MailjetSubscription>>({
    method: 'post',
    url: '/v3/REST/contact/' + email + '/managecontactslists',
    body: {
      ContactsLists: [
        {
          ListID: listId,
          Action: action,
        },
      ],
    },
  });
  return ret.Data;
}
