import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { Workspace } from 'shared';
import {
  ChallengeCollection,
  ChallengeModel,
} from '../../collections/Challenge';
import {
  WorkspaceCollection,
  WorkspaceModel,
} from '../../collections/Workspace';
import { AppError } from '../../common/errors';
import { DUPLICATED_UNIQUE_VALUE_ERROR_CODE } from '../../common/mongo';
import { createContract, createRpcBinding } from '../../lib';
import { AppUser } from '../../types';
import { prepareWorkspace } from './prepareWorkspace';
import { getMappedWorkspace } from './_common';

async function _getOrCreate(
  appUser: AppUser,
  challenge: ChallengeModel,
  {
    dedupKey,
    challengeId,
  }: {
    dedupKey: string;
    challengeId: string;
  }
) {
  const existing = await WorkspaceCollection.findOne({ dedupKey });
  if (existing) {
    return existing;
  }
  const workspace: WorkspaceModel = {
    _id: new ObjectID(),
    challengeId: challengeId,
    userId: appUser._id,
    dedupKey,
    isReady: false,
    s3Auth: null!,
    libraries: challenge.libraries,
  };
  try {
    await WorkspaceCollection.insertOne(workspace);
    return workspace;
  } catch (e: any) {
    if (e.code === DUPLICATED_UNIQUE_VALUE_ERROR_CODE) {
      const existing = await WorkspaceCollection.findOne({ dedupKey });
      if (existing) {
        return existing;
      }
    }
    throw e;
  }
}

export const getOrCreateWorkspace = createContract(
  'workspace.getOrCreateWorkspace'
)
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      challengeId: S.string(),
    }),
  })
  .returns<Workspace>()
  .fn(async (user, values) => {
    const challenge = await ChallengeCollection.findById(values.challengeId);
    if (!challenge) {
      throw new AppError('Challenge not found: ' + values.challengeId);
    }
    const dedupKey = `${values.challengeId}_${user._id}_default`;
    const workspace = await _getOrCreate(user, challenge, {
      dedupKey,
      challengeId: values.challengeId,
    });
    if (!workspace.isReady) {
      await prepareWorkspace(workspace._id);
    }
    return getMappedWorkspace(workspace);
  });

export const getOrCreateWorkspaceRpc = createRpcBinding({
  injectUser: true,
  signature: 'workspace.getOrCreateWorkspace',
  handler: getOrCreateWorkspace,
});
