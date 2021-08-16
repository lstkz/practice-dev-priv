import * as R from 'remeda';
import { S } from 'schema';
import { ChallengeDetails } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { ModuleCollection } from '../../collections/Module';
import { AppError } from '../../common/errors';
import { doFn } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';

export const getChallenge = createContract('challenge.getChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.string().optional(),
      moduleSlug: S.string().optional(),
      slug: S.string().optional(),
    }),
  })
  .returns<ChallengeDetails>()
  .fn(async values => {
    const challenge = await doFn(async () => {
      if (values.id) {
        return ChallengeCollection.findById(values.id);
      }
      if (!values.moduleSlug || !values.slug) {
        throw new AppError('Both moduleSlug and slug are required');
      }
      const module = await ModuleCollection.findOne({
        slug: values.moduleSlug,
      });
      if (!module) {
        throw new AppError('Module not found');
      }
      return ChallengeCollection.findOne({
        moduleId: module._id,
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
        'moduleId',
        'title',
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
