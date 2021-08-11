import { ObjectID } from 'mongodb2';
import { SolutionCollection } from '../../collections/Solution';
import { AppError, ForbiddenError } from '../../common/errors';
import { AppUser } from '../../types';

export async function getSolutionWithAccessCheck(
  solutionId: ObjectID,
  user: AppUser
) {
  const solution = await SolutionCollection.findById(solutionId);
  if (!solution) {
    throw new AppError('Solution not found');
  }
  if (!solution.userId.equals(user._id) && !user.isAdmin) {
    throw new ForbiddenError('No access to solution');
  }
  return solution;
}
