import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { Solution, SubmissionStatus } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { SolutionCollection, SolutionModel } from '../../collections/Solution';
import { SolutionLimitCollection } from '../../collections/SolutionLimit';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError, ForbiddenError } from '../../common/errors';
import { mapSolution } from '../../common/mapper';
import { withTransaction } from '../../db';
import { createContract, createRpcBinding } from '../../lib';

const MAX_SOLUTIONS = 3;

export const createSolution = createContract('solution.createSolution')
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      submissionId: S.string().objectId(),
      title: S.string().max(100),
    }),
  })
  .returns<Solution>()
  .fn(async (user, values) => {
    const submission = await SubmissionCollection.findById(values.submissionId);
    if (!submission) {
      throw new AppError('Submission not found');
    }
    if (!submission.userId.equals(user._id)) {
      throw new ForbiddenError('No access to submission');
    }
    if (submission.status !== SubmissionStatus.Pass) {
      throw new AppError(
        'You can only create a solution from a passing submission.'
      );
    }
    const challenge = await ChallengeCollection.findByIdOrThrow(
      submission.challengeUniqId
    );
    const solution: SolutionModel = {
      _id: new ObjectID(),
      challengeId: challenge._id,
      submissionId: submission._id,
      title: values.title,
      userId: user._id,
    };
    const solutionLimitId = `${user._id}_${challenge._id}`;
    await withTransaction(async () => {
      let solutionLimit = await SolutionLimitCollection.findById(
        solutionLimitId
      );
      if (!solutionLimit) {
        solutionLimit = {
          _id: solutionLimitId,
          count: 0,
        };
        await SolutionLimitCollection.insertOne(solutionLimit);
      }
      if (solutionLimit.count >= MAX_SOLUTIONS) {
        throw new AppError(
          `You cannot create more solutions. Limit is ${MAX_SOLUTIONS}.`
        );
      }
      solutionLimit.count++;
      await SolutionLimitCollection.update(solutionLimit, ['count']);
      await SolutionCollection.insertOne(solution);
    });
    return mapSolution(solution, user);
  });

export const createSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.createSolution',
  handler: createSolution,
});