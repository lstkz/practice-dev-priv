import { config } from 'config';
import * as Mailjet from 'node-mailjet';
import { EmailTemplate } from '../types';

const mailjet = Mailjet.connect(
  config.mailjet.publicKey,
  config.mailjet.privateKey
);

interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
}

export async function sendMailjetEmail(options: SendEmailOptions) {
  const { template, to } = options;
  await mailjet.post('send', { version: 'v3.1' }).request({
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
  });
}
