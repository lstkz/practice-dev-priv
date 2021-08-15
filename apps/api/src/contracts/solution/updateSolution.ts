import { S } from 'schema';
import { Solution } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import { createContract, createRpcBinding } from '../../lib';
import { getSolution } from './getSolution';
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
    return getSolution(user, solutionId);
  });

export const updateSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.updateSolution',
  handler: updateSolution,
});
