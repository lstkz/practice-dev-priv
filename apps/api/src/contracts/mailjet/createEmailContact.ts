import { config } from 'config';
import { S } from 'schema';
import {
  ensureContractExist,
  updateListSubscription,
} from '../../common/mailjet';
import { createContract, createTaskBinding } from '../../lib';

export const createEmailContact = createContract('mailjet.createEmailContact')
  .params('email', 'subscribe')
  .schema({
    email: S.string(),
    subscribe: S.boolean(),
  })
  .returns<void>()
  .fn(async (email, subscribe) => {
    await ensureContractExist(email);
    if (subscribe) {
      await updateListSubscription(
        email,
        config.mailjet.lists.newsletter,
        'addforce'
      );
    }
  });

export const createEmailContactTask = createTaskBinding({
  type: 'CreateEmailContact',
  handler: async (_, event) => {
    await createEmailContact(event.email, event.subscribe);
  },
});
