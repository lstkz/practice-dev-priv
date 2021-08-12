import { S } from 'schema';
import { VoteResult } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import {
  createSolutionVoteId,
  SolutionVoteCollection,
} from '../../collections/SolutionVote';
import { AppError } from '../../common/errors';
import { withTransaction } from '../../db';
import { createContract, createRpcBinding } from '../../lib';

const MAX_VOTES = process.env.NODE_ENV === 'test' ? 3 : 1;

export const voteSolution = createContract('solution.voteSolution')
  .params('user', 'solutionId', 'vote')
  .schema({
    user: S.object().appUser(),
    solutionId: S.string().objectId(),
    vote: S.enum().literal('up', 'down'),
  })
  .returns<VoteResult>()
  .fn(async (user, solutionId, vote) => {
    const voteId = createSolutionVoteId({
      userId: user._id,
      solutionId,
    });
    return await withTransaction(async () => {
      let [solution, solutionVote] = await Promise.all([
        SolutionCollection.findById(solutionId),
        SolutionVoteCollection.findById(voteId),
      ]);
      if (!solution) {
        throw new AppError('Solution not found');
      }
      if (!solutionVote) {
        solutionVote = {
          _id: voteId,
          userId: user._id,
          solutionId: solutionId,
          score: 0,
        };
        await SolutionVoteCollection.insertOne(solutionVote);
      }
      const diff = vote === 'up' ? 1 : -1;
      if (Math.abs(solutionVote.score + diff) <= MAX_VOTES) {
        solution.score += diff;
        solutionVote.score += diff;
        await Promise.all([
          SolutionCollection.update(solution, ['score']),
          SolutionVoteCollection.update(solutionVote, ['score']),
        ]);
      }
      return { score: solution.score, myScore: solutionVote.score };
    });
  });

export const voteSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.voteSolution',
  handler: voteSolution,
});
