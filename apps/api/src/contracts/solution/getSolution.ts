import { S } from 'schema';
import { Solution } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import {
  createSolutionVoteId,
  SolutionVoteCollection,
} from '../../collections/SolutionVote';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { doFn } from '../../common/helper';
import { mapSolution } from '../../common/mapper';
import { createContract, createRpcBinding } from '../../lib';

export const getSolution = createContract('solution.getSolution')
  .params('user', 'id')
  .schema({
    user: S.object().appUser().optional(),
    id: S.string().objectId(),
  })
  .returns<Solution>()
  .fn(async (user, id) => {
    const [solution, solutionVote] = await Promise.all([
      SolutionCollection.findById(id),
      doFn(async () => {
        if (!user) {
          return null;
        }
        const voteId = createSolutionVoteId({
          userId: user._id,
          solutionId: id,
        });
        const ret = await SolutionVoteCollection.findById(voteId);
        return ret;
      }),
    ]);
    if (!solution) {
      throw new AppError('Solution not found');
    }
    const solutionUser = await UserCollection.findByIdOrThrow(solution.userId);
    return mapSolution(solution, solutionUser, solutionVote);
  });

export const getSolutionRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'solution.getSolution',
  handler: getSolution,
});
