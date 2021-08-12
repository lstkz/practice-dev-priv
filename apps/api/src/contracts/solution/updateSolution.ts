import { S } from 'schema';
import { Solution } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import {
  createSolutionVoteId,
  SolutionVoteCollection,
} from '../../collections/SolutionVote';
import { UserCollection } from '../../collections/User';
import { mapSolution } from '../../common/mapper';
import { createContract, createRpcBinding } from '../../lib';
import { getSolutionWithAccessCheck } from './_common';

export const updateSolution = createContract('solution.updateSolution')
  .params('user', 'solutionId', 'values')
  .schema({
    user: S.object().appUser(),
    solutionId: S.string().objectId(),
    values: S.object().keys({
      title: S.string().max(100),
    }),
  })
  .returns<Solution>()
  .fn(async (user, solutionId, values) => {
    const solution = await getSolutionWithAccessCheck(solutionId, user);
    solution.title = values.title;
    await SolutionCollection.update(solution, ['title']);
    const solutionUser = await UserCollection.findByIdOrThrow(solution.userId);
    const voteId = createSolutionVoteId({
      userId: user._id,
      solutionId,
    });
    const solutionVote = await SolutionVoteCollection.findById(voteId);
    return mapSolution(solution, solutionUser, solutionVote);
  });

export const updateSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.updateSolution',
  handler: updateSolution,
});
