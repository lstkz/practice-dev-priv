import { SubmissionStatus, WorkspaceNodeType } from 'shared';
import {
  ChallengeCollection,
  ChallengeModel,
} from '../src/collections/Challenge';
import {
  ChallengeAttemptModel,
  getChallengeAttemptId,
} from '../src/collections/ChallengeAttempt';
import {
  ChallengeSolvedModel,
  getChallengeSolvedId,
} from '../src/collections/ChallengeSolved';
import { createFollowerId, FollowerModel } from '../src/collections/Follower';
import { ModuleCollection, ModuleModel } from '../src/collections/Module';
import { SolutionModel } from '../src/collections/Solution';
import {
  SubmissionCollection,
  SubmissionModel,
} from '../src/collections/Submission';
import { UserModel } from '../src/collections/User';
import { WorkspaceCollection } from '../src/collections/Workspace';
import { WorkspaceNodeCollection } from '../src/collections/WorkspaceNode';
import { getWorkspaceNodeWithUniqueKey } from '../src/common/workspace-tree';
import { createToken } from '../src/contracts/user/createToken';
import { createUser } from '../src/contracts/user/_common';
import { getId, getUUID } from './helper';

export async function registerSampleUsers(isVerified = true) {
  await Promise.all([
    createUser(
      getUserValues(1, {
        isVerified: isVerified,
        registeredAt: new Date(1),
        lastSeenAt: new Date(2),
      })
    ).then(() => createToken(getId(1), 'user1_token')),
    createUser(
      getUserValues(2, {
        isVerified: isVerified,
        registeredAt: new Date(10),
        lastSeenAt: new Date(20),
      })
    ).then(() => createToken(getId(2), 'user2_token')),
  ]);
}

export async function createSampleChallenges() {
  await Promise.all([
    ModuleCollection.insertMany([
      {
        _id: 1,
        slug: 'm1',
        title: 'module1',
        description: 'desc',
        difficulty: 'easy',
        mainTechnology: 'react',
        tags: [],
        stats: {
          enrolledUsers: 0,
        },
      },
    ]),
    ChallengeCollection.insertMany([
      {
        _id: '1_2',
        slug: 'challenge-2',
        challengeModuleId: 2,
        description: 'desc',
        detailsS3Key: '',
        testS3Key: 't',
        difficulty: 'easy',
        solutionUrl: 'sol',
        files: [
          {
            directory: '.',
            name: 'index.tsx',
            s3Key: 'key1',
          },
          {
            directory: 'components',
            name: 'Button.tsx',
            s3Key: 'key2',
          },
          {
            directory: 'components',
            name: 'Tab.tsx',
            s3Key: 'key3',
          },
        ],
        htmlS3Key: '',
        moduleId: 1,
        practiceTime: 10,
        title: 'challenge 2',
        libraries: [],
        tests: [],
        stats: {
          passingSubmissions: 0,
          solutions: 0,
          totalSubmissions: 0,
          uniqueAttempts: 0,
        },
      },
    ]),
  ]);
}

export async function createSampleWorkspaces() {
  await WorkspaceCollection.insertMany([
    {
      _id: getId(10),
      challengeId: '1_2',
      isReady: true,
      userId: getId(1),
      s3Auth: null!,
      libraries: [],
    },
    {
      _id: getId(11),
      challengeId: '1_2',
      isReady: true,
      userId: getId(1),
      s3Auth: null!,
      libraries: [],
    },
  ]);
}

export async function createSampleWorkspaceItems() {
  await WorkspaceNodeCollection.insertMany([
    getWorkspaceNodeWithUniqueKey({
      _id: getUUID(1),
      userId: getId(1),
      workspaceId: getId(10),
      parentId: null,
      hash: '123',
      type: WorkspaceNodeType.File,
      name: 'index.tsx',
      sourceS3Key: 's1',
    }),
    getWorkspaceNodeWithUniqueKey({
      _id: getUUID(2),
      userId: getId(1),
      workspaceId: getId(10),
      parentId: null,
      hash: '123',
      type: WorkspaceNodeType.Directory,
      name: 'components',
    }),
    getWorkspaceNodeWithUniqueKey({
      _id: getUUID(3),
      userId: getId(1),
      workspaceId: getId(10),
      parentId: getUUID(2),
      hash: '123',
      type: WorkspaceNodeType.Directory,
      name: 'forms',
    }),
    getWorkspaceNodeWithUniqueKey({
      _id: getUUID(4),
      userId: getId(1),
      workspaceId: getId(10),
      parentId: getUUID(3),
      hash: '123',
      type: WorkspaceNodeType.File,
      name: 'Button.tsx',
      sourceS3Key: 's2',
    }),
  ]);
}

export async function createSampleSubmissions() {
  await SubmissionCollection.insertMany([
    {
      _id: getId(100),
      challengeId: '1_2',
      createdAt: new Date(1),
      indexHtmlS3Key: 'index',
      isCloned: true,
      nodes: [
        {
          _id: '1',
          name: '1.txt',
          parentId: null,
          type: WorkspaceNodeType.File,
          sourceS3Key: 's1',
          s3Key: 'file-key',
          hash: 'h1',
        },
      ],
      notifyKey: '123',
      status: SubmissionStatus.Pass,
      userId: getId(1),
      workspaceId: getId(10),
      libraries: [],
    },
    {
      _id: getId(101),
      challengeId: '1_2',
      createdAt: new Date(2),
      indexHtmlS3Key: 'index',
      isCloned: true,
      nodes: [
        {
          _id: '1',
          name: '1.txt',
          parentId: null,
          type: WorkspaceNodeType.File,
          sourceS3Key: 's1',
          s3Key: 'file-key',
          hash: 'h1',
        },
      ],
      notifyKey: '1234',
      status: SubmissionStatus.Fail,
      userId: getId(1),
      workspaceId: getId(10),
      libraries: [],
    },
  ]);
}

export function getSampleSubmissionValues(
  id: number,
  values: Partial<SubmissionModel> = {}
): SubmissionModel {
  const base = {
    challengeId: '1_2',
    createdAt: new Date(1),
    indexHtmlS3Key: 'index',
    isCloned: true,
    nodes: [],
    status: SubmissionStatus.Pass,
    userId: getId(1),
    workspaceId: getId(10),
    libraries: [],
  };
  return {
    _id: getId(id),
    notifyKey: id.toString(),
    ...base,
    ...values,
  };
}

export function getSampleSolutionValues(
  id: number,
  values: Partial<SolutionModel> = {}
): SolutionModel {
  const base = {
    challengeId: '1_2',
    createdAt: new Date(1),
    score: 1,
    submissionId: getId(1000),
    title: 's1',
    userId: getId(1),
  };
  return {
    _id: getId(id),
    ...base,
    ...values,
  };
}

export function getSampleModuleValues(
  id: number,
  values: Partial<ModuleModel> = {}
): ModuleModel {
  return {
    _id: id,
    title: 'module' + id,
    slug: 'm-' + id,
    description: 'desc',
    difficulty: 'easy',
    mainTechnology: 'react',
    tags: [],
    stats: {
      enrolledUsers: 0,
    },
    ...values,
  };
}

export function getSampleChallengeValues(
  moduleId: number,
  challengeModuleId: number,
  values: Partial<ChallengeModel> = {}
): ChallengeModel {
  return {
    _id: moduleId + '_' + challengeModuleId,
    challengeModuleId: challengeModuleId,
    description: 'desc',
    detailsS3Key: '',
    testS3Key: 't',
    difficulty: 'easy',
    solutionUrl: 'sol',
    files: [],
    htmlS3Key: '',
    moduleId: moduleId,
    practiceTime: 10,
    title: 'challenge ' + challengeModuleId,
    slug: moduleId + '/challenge-' + challengeModuleId,
    libraries: [],
    tests: [],
    stats: {
      passingSubmissions: 0,
      solutions: 0,
      totalSubmissions: 0,
      uniqueAttempts: 0,
    },
    ...values,
  };
}

export function getSampleChallengeSolvedValues(
  moduleId: number,
  challengeModuleId: number,
  userId: number,
  values: Partial<ChallengeSolvedModel> = {}
) {
  const userId2 = getId(userId);
  const challengeId = moduleId + '_' + challengeModuleId;
  return {
    _id: getChallengeSolvedId({
      userId: userId2,
      challengeId: challengeId,
    }),
    userId: userId2,
    challengeId: challengeId,
    moduleId,
    ...values,
  };
}

export function getChallengeAttemptValues(
  moduleId: number,
  challengeModuleId: number,
  userId: number,
  values: Partial<ChallengeAttemptModel> = {}
) {
  const challengeStrId = moduleId + '_' + challengeModuleId;
  return {
    _id: getChallengeAttemptId({
      challengeId: challengeStrId,
      userId: getId(userId),
    }),
    challengeId: challengeStrId,
    moduleId: moduleId,
    userId: getId(userId),
    ...values,
  };
}

export function getFollowerValues(
  fromUserId: number,
  targetUserId: number,
  values: Partial<FollowerModel> = {}
) {
  return {
    _id: createFollowerId({
      targetUserId: getId(targetUserId),
      fromUserId: getId(fromUserId),
    }),
    targetUserId: getId(targetUserId),
    fromUserId: getId(fromUserId),
    createdAt: new Date(1),
    ...values,
  };
}

export function getUserValues(id: number, values: Partial<UserModel> = {}) {
  return {
    userId: getId(id),
    username: 'user' + id,
    email: `user${id}@example.com`,
    password: 'password' + id,
    isVerified: true,
    registeredAt: new Date(1),
    lastSeenAt: new Date(2),
    ...values,
  };
}
