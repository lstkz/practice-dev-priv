import { ChallengeCollection } from '../src/collections/Challenge';
import { ModuleCollection } from '../src/collections/Module';
import { WorkspaceCollection } from '../src/collections/Workspace';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeType,
} from '../src/collections/WorkspaceNode';
import { getWorkspaceNodeWithUniqueKey } from '../src/common/workspace-tree';
import { createToken } from '../src/contracts/user/createToken';
import { createUser } from '../src/contracts/user/_common';
import { getId, getUUID } from './helper';

export async function registerSampleUsers(isVerified = true) {
  await Promise.all([
    createUser({
      userId: getId(1),
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      isVerified: isVerified,
      subscribeNewsletter: true,
    }).then(() => createToken(getId(1), 'user1_token')),
    createUser({
      userId: getId(2),
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      isVerified: isVerified,
    }).then(() => createToken(getId(2), 'user2_token')),
  ]);
}

export async function createSampleChallenges() {
  await Promise.all([
    ModuleCollection.insertMany([
      {
        _id: 1,
        title: 'module1',
        description: 'desc',
        difficulty: 'easy',
        mainTechnology: 'react',
        tags: [],
      },
    ]),
    ChallengeCollection.insertMany([
      {
        _id: '1_2',
        challengeId: 2,
        description: 'desc',
        detailsS3Key: '',
        difficulty: 'easy',
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
      },
    ]),
  ]);
}

export async function createSampleWorkspaces() {
  await WorkspaceCollection.insertMany([
    {
      _id: getId(10),
      challengeUniqId: '1_2',
      isReady: true,
      userId: getId(1),
      s3Auth: null!,
    },
    {
      _id: getId(11),
      challengeUniqId: '1_2',
      isReady: true,
      userId: getId(1),
      s3Auth: null!,
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
    }),
  ]);
}
