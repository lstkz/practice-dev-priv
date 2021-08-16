import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { createContract, createRpcBinding } from '../../lib';
import { getChallengeId } from '../../common/helper';
import { ModuleCollection } from '../../collections/Module';
import { AppError } from '../../common/errors';

export const updateChallenge = createContract('challenge.updateChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      moduleId: S.number(),
      challengeModuleId: S.number(),
      title: S.string(),
      description: S.string(),
      difficulty: S.string(),
      practiceTime: S.number(),
      detailsS3Key: S.string(),
      htmlS3Key: S.string(),
      testS3Key: S.string(),
      solutionUrl: S.string(),
      files: S.array().items(
        S.object().keys({
          name: S.string(),
          directory: S.string(),
          s3Key: S.string(),
          isLocked: S.boolean().optional().nullable(),
        })
      ),
      libraries: S.array().items(
        S.object().keys({
          name: S.string(),
          types: S.string(),
          source: S.string(),
        })
      ),
      tests: S.array().items(S.string()),
    }),
  })
  .returns<void>()
  .fn(async values => {
    const module = await ModuleCollection.findById(values.moduleId);
    if (!module) {
      throw new AppError('Module not found');
    }
    const id = getChallengeId(values);
    await ChallengeCollection.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...values,
        },
        $setOnInsert: {
          stats: {
            uniqueAttempts: 0,
            passingSubmissions: 0,
            totalSubmissions: 0,
            solutions: 0,
          },
        },
      },
      {
        upsert: true,
      }
    );
  });

export const updateChallengeRpc = createRpcBinding({
  admin: true,
  signature: 'challenge.updateChallenge',
  handler: updateChallenge,
});
