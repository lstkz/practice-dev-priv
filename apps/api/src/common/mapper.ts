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
import {
  createSolutionVoteId,
  SolutionVoteModel,
} from '../collections/SolutionVote';
import { ChallengeModel } from '../collections/Challenge';

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
  user: UserModel,
  challenge: ChallengeModel,
  solutionVote?: SolutionVoteModel | null
): Solution {
  return {
    id: solution._id.toHexString(),
    title: solution.title,
    createdAt: solution.createdAt.toISOString(),
    score: solution.score,
    myScore: solutionVote?.score ?? 0,
    author: {
      id: user._id.toHexString(),
      username: user.username,
      avatarId: user.avatarId,
    },
    challenge: {
      id: challenge._id,
      title: challenge.title,
      slug: challenge.slug,
    },
  };
}

export function mapSolutions(
  solutions: SolutionModel[],
  users: UserModel[],
  challenges: ChallengeModel[],
  solutionVotes: SolutionVoteModel[]
): Solution[] {
  const userMap = R.indexBy(users, x => x._id);
  const challengeMap = R.indexBy(challenges, x => x._id);
  const voteMap = R.indexBy(solutionVotes, x => x._id);
  return solutions.map(solution => {
    const user = userMap[solution.userId.toHexString()];
    const challenge = challengeMap[solution.challengeId];
    const voteId = createSolutionVoteId({
      userId: user._id,
      solutionId: solution._id,
    });
    return mapSolution(solution, user, challenge, voteMap[voteId]);
  });
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
