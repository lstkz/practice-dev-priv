import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import {
  ChallengeCollection,
  ChallengeModel,
} from '../../collections/Challenge';
import {
  WorkspaceCollection,
  WorkspaceModel,
} from '../../collections/Workspace';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { renameId } from '../../common/helper';
import { mapWorkspaceS3Auth } from '../../common/mapper';
import { DUPLICATED_UNIQUE_VALUE_ERROR_CODE } from '../../common/mongo';
import { Workspace } from '../../generated';
import { createContract, createRpcBinding } from '../../lib';
import { AppUser } from '../../types';
import { prepareWorkspace } from './prepareWorkspace';
import { renewWorkspaceAuth } from './_common';

async function _getOrCreate(
  appUser: AppUser,
  challenge: ChallengeModel,
  {
    dedupKey,
    challengeUniqId,
  }: {
    dedupKey: string;
    challengeUniqId: string;
  }
) {
  const existing = await WorkspaceCollection.findOne({ dedupKey });
  if (existing) {
    return existing;
  }
  const workspace: WorkspaceModel = {
    _id: new ObjectID(),
    challengeUniqId: challengeUniqId,
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
  return workspace;
}

export const getOrCreateWorkspace = createContract(
  'workspace.getOrCreateWorkspace'
)
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      challengeUniqId: S.string(),
    }),
  })
  .returns<Workspace>()
  .fn(async (user, values) => {
    const challenge = await ChallengeCollection.findById(
      values.challengeUniqId
    );
    if (!challenge) {
      throw new AppError('Challenge not found: ' + values.challengeUniqId);
    }
    const dedupKey = `${values.challengeUniqId}_${user._id}_default`;
    const workspace = await _getOrCreate(user, challenge, {
      dedupKey,
      challengeUniqId: values.challengeUniqId,
    });
    if (!workspace.isReady) {
      await prepareWorkspace(workspace._id);
    }
    await renewWorkspaceAuth(workspace);
    const files = await WorkspaceNodeCollection.findAll({
      workspaceId: workspace._id,
    });

    return {
      id: workspace._id.toHexString(),
      items: files.map(file => renameId(file)),
      s3Auth: mapWorkspaceS3Auth(workspace.s3Auth),
      libraries: workspace.libraries,
    };
  });

export const getOrCreateWorkspaceRpc = createRpcBinding({
  injectUser: true,
  signature: 'workspace.getOrCreateWorkspace',
  handler: getOrCreateWorkspace,
});
