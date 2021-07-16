import { S } from 'schema';
import * as DateFns from 'date-fns';
import { createContract, createGraphqlBinding } from '../../lib';
import { AppError } from '../../common/errors';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { ConfirmEmailCodeCollection } from '../../collections/ConfirmEmailCode';
import { getCurrentDate } from '../../common/helper';
import { dispatchEvent } from '../../dispatch';
import { generateAuthData } from './_common';

export const confirmEmail = createContract('user.confirmEmail')
  .params('code')
  .schema({
    code: S.string(),
  })
  .returns<AuthData>()
  .fn(async code => {
    const confirmCode = await ConfirmEmailCodeCollection.findById(code);
    if (!confirmCode) {
      throw new AppError('Invalid code');
    }
    if (
      confirmCode.usedAt &&
      DateFns.add(confirmCode.usedAt, { hours: 2 }).getTime() < Date.now()
    ) {
      throw new AppError('Account already verified');
    }
    const user = await UserCollection.findByIdOrThrow(confirmCode.userId);
    if (!confirmCode.usedAt) {
      user.isVerified = true;
      confirmCode.usedAt = getCurrentDate();
      await UserCollection.update(user, ['isVerified']);
      await ConfirmEmailCodeCollection.update(confirmCode, ['usedAt']);
      await dispatchEvent({
        type: 'UserEmailVerified',
        payload: {
          userId: user._id.toHexString(),
        },
      });
    }
    return generateAuthData(user);
  });

export const confirmEmailGraphql = createGraphqlBinding({
  public: true,
  resolver: {
    Mutation: {
      confirmEmail: (_, { code }) => {
        return confirmEmail(code);
      },
    },
  },
});
