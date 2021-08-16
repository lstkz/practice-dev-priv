import * as R from 'remeda';
import { S } from 'schema';
import { ChallengeDetails } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { AppError } from '../../common/errors';
import { doFn } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';

export const getChallenge = createContract('challenge.getChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.string().optional(),
      slug: S.string().optional(),
    }),
  })
  .returns<ChallengeDetails>()
  .fn(async values => {
    if (!values.id && !values.slug) {
      throw new AppError('id or slug required');
    }
    const challenge = await doFn(async () => {
      if (values.id) {
        return ChallengeCollection.findById(values.id);
      }
      return ChallengeCollection.findOne({
        slug: values.slug,
      });
    });
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    return {
      id: challenge._id,
      ...R.pick(challenge, [
        'challengeModuleId',
        'title',
        'slug',
        'moduleId',
        'description',
        'difficulty',
        'practiceTime',
        'detailsS3Key',
        'htmlS3Key',
        'solutionUrl',
        'tests',
      ]),
    };
  });

export const getChallengeRpc = createRpcBinding({
  public: true,
  signature: 'challenge.getChallenge',
  handler: getChallenge,
});
