import { config } from 'config';
import { S } from 'schema';
import {
  ensureContractExist,
  updateListSubscription,
} from '../../common/mailjet';
import { createContract, createTaskBinding } from '../../lib';

export const updateNewsletterSettings = createContract(
  'mailjet.updateNewsletterSettings'
)
  .params('email', 'subscribe')
  .schema({
    email: S.string(),
    subscribe: S.boolean(),
  })
  .returns<void>()
  .fn(async (email, subscribe) => {
    await ensureContractExist(email);
    await updateListSubscription(
      email,
      config.mailjet.lists.newsletter,
      subscribe ? 'addforce' : 'unsub'
    );
  });

export const updateNewsletterSettingsTask = createTaskBinding({
  type: 'UpdateNewsletterSettings',
  handler: async (_, event) => {
    await updateNewsletterSettings(event.email, event.subscribe);
  },
});
