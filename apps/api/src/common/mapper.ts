import * as R from 'remeda';
import { UserModel } from '../collections/User';
import { WorkspaceS3Auth } from '../collections/Workspace';
import {
  ReadOnlyWorkspace,
  Solution,
  User,
  WorkspaceS3Auth as MappedWorkspaceS3Auth,
} from 'shared';
import { SolutionModel } from '../collections/Solution';
import { SubmissionModel } from '../collections/Submission';

export function mapUser(user: UserModel): User {
  return {
    id: user._id.toHexString(),
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
    avatarId: user.avatarId,
  };
}

export function mapWorkspaceS3Auth(
  auth: WorkspaceS3Auth
): MappedWorkspaceS3Auth {
  return {
    bucketName: auth.bucketName,
    credentials: auth.credentials,
  };
}

export function mapSolution(
  solution: SolutionModel,
  user: UserModel
): Solution {
  return {
    id: solution._id.toHexString(),
    title: solution.title,
    createdAt: solution.createdAt.toISOString(),
    score: solution.score,
    author: {
      id: user._id.toHexString(),
      username: user.username,
      avatarId: user.avatarId,
    },
  };
}

export function mapSolutions(
  solutions: SolutionModel[],
  users: UserModel[]
): Solution[] {
  const userMap = R.indexBy(users, x => x._id);
  return solutions.map(solution =>
    mapSolution(solution, userMap[solution.userId.toHexString()])
  );
}

export function mapSubmissionToWorkspace(
  submission: SubmissionModel
): ReadOnlyWorkspace {
  return {
    id: submission._id.toHexString(),
    libraries: submission.libraries,
    items: submission.nodes.map(node => {
      const mapped = {
        id: node._id.toString(),
        name: node.name,
        hash: 'init',
        parentId: node.parentId,
        type: node.type,
      };
      return mapped;
    }),
  };
}
