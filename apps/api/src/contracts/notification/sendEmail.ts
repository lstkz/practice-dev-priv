import { S } from 'schema';
import { sendMailjetEmail } from '../../common/mailjet';
import { createContract, createTaskBinding } from '../../lib';
import { EmailTemplate } from '../../types';

export const sendEmail = createContract('notification.sendEmail')
  .params('to', 'template')
  .schema({
    to: S.string(),
    template: S.object().keys({
      type: S.enum().literal('actionButton'),
      variables: S.object().unknown(),
    }),
  })
  .returns<void>()
  .fn(async (to, template) => {
    await sendMailjetEmail({
      to,
      template: template as EmailTemplate,
    });
  });

export const sendEmailTask = createTaskBinding({
  type: 'SendEmail',
  async handler(messageId, task) {
    await sendEmail(task.to, task.template);
  },
});
