import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createContract, createGraphqlBinding } from '../../lib';
import { sendVerificationEmail } from './_common';

export const resendVerificationCode = createContract(
  'user.resendVerificationCode'
)
  .params('appUser')
  .schema({
    appUser: S.object().appUser(),
  })
  .returns<void>()
  .fn(async appUser => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    if (user.isVerified) {
      throw new AppError('User is already verified');
    }
    await sendVerificationEmail(user);
  });

export const resendVerificationCodeGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      resendVerificationCode: (_, __, { getUser }) =>
        resendVerificationCode(getUser()),
    },
  },
});
