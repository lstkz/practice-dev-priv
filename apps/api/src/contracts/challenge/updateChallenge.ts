import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { createContract, createGraphqlBinding } from '../../lib';
import { getChallengeId } from '../../common/helper';

export const updateChallenge = createContract('challenge.updateChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      challengeId: S.number(),
      moduleId: S.number(),
      title: S.string(),
      description: S.string(),
      difficulty: S.string(),
      practiceTime: S.number(),
      detailsS3Key: S.string(),
      htmlS3Key: S.string(),
      files: S.array().items(
        S.object().keys({
          name: S.string(),
          directory: S.string(),
          s3Key: S.string(),
        })
      ),
    }),
  })
  .fn(async values => {
    const id = getChallengeId(values);
    await ChallengeCollection.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...values,
        },
      },
      {
        upsert: true,
      }
    );
  });

export const updateChallengeGraphql = createGraphqlBinding({
  admin: true,
  resolver: {
    Mutation: {
      updateChallenge: (_, { values }, {}) => updateChallenge(values),
    },
  },
});
