import { UserModel } from '../collections/User';
import { WorkspaceS3Auth } from '../collections/Workspace';
import {
  Solution,
  User,
  WorkspaceS3Auth as MappedWorkspaceS3Auth,
} from 'shared';
import { SolutionModel } from '../collections/Solution';

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
    author: {
      id: user._id.toHexString(),
      username: user.username,
      avatarId: user.avatarId,
    },
  };
}
