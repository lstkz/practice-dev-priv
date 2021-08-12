import { S } from 'schema';
import { SolutionCollection } from '../../collections/Solution';
import { SolutionLimitCollection } from '../../collections/SolutionLimit';
import { withTransaction } from '../../db';
import { dispatchEvent } from '../../dispatch';
import { createContract, createRpcBinding } from '../../lib';
import { getSolutionWithAccessCheck } from './_common';

export const deleteSolution = createContract('solution.deleteSolution')
  .params('user', 'solutionId')
  .schema({
    user: S.object().appUser(),
    solutionId: S.string().objectId(),
  })
  .returns<void>()
  .fn(async (user, solutionId) => {
    const solution = await getSolutionWithAccessCheck(solutionId, user);

    const solutionLimitId = `${user._id}_${solution.challengeId}`;
    await withTransaction(async () => {
      const solutionLimit = await SolutionLimitCollection.findByIdOrThrow(
        solutionLimitId
      );
      solutionLimit.count--;
      await SolutionLimitCollection.update(solutionLimit, ['count']);
      await SolutionCollection.deleteById(solutionId);
    });
    await dispatchEvent({
      type: 'SolutionDeleted',
      payload: {
        solutionId: solution._id.toHexString(),
      },
    });
  });

export const deleteSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.deleteSolution',
  handler: deleteSolution,
});
