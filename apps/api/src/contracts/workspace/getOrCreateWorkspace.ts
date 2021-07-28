import { config } from 'config';
import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  WorkspaceCollection,
  WorkspaceModel,
} from '../../collections/Workspace';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { renameId } from '../../common/helper';
import { mapWorkspaceS3Auth } from '../../common/mapper';
import { dispatchTask } from '../../dispatch';
import { Workspace } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';
import { AppUser } from '../../types';
import { renewWorkspaceAuth } from './_common';

async function _getOrCreate(
  appUser: AppUser,
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
    userId: appUser.id,
    dedupKey,
    isReady: false,
    s3Auth: null!,
  };
  await WorkspaceCollection.insertOne(workspace);
  await dispatchTask({
    type: 'PrepareWorkspace',
    payload: {
      workspaceId: workspace._id.toHexString(),
    },
  });
  return workspace;
}

export const getOrCreateWorkspace = createContract(
  'workspace.getOrCreateWorkspace'
)
  .params('appUser', 'values')
  .schema({
    appUser: S.object().appUser(),
    values: S.object().keys({
      challengeUniqId: S.string(),
    }),
  })
  .returns<Workspace>()
  .fn(async (appUser, values) => {
    const challenge = await ChallengeCollection.findById(
      values.challengeUniqId
    );
    if (!challenge) {
      throw new AppError('Challenge not found: ' + values.challengeUniqId);
    }
    const dedupKey = `${values.challengeUniqId}_${appUser.id}_default`;
    const workspace = await _getOrCreate(appUser, {
      dedupKey,
      challengeUniqId: values.challengeUniqId,
    });
    await renewWorkspaceAuth(workspace);
    const files = await WorkspaceNodeCollection.findAll({
      workspaceId: workspace._id,
    });

    return {
      id: workspace._id.toHexString(),
      isReady: workspace.isReady,
      items: files.map(file => {
        const item = renameId(file);
        return {
          ...renameId(file),
          url: config.cdnBaseUrl + item.s3Key!.replace(/^cdn\//, '/'),
        };
      }),
      s3Auth: mapWorkspaceS3Auth(workspace.s3Auth),
    };
  });

export const getOrCreateWorkspaceGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      getOrCreateWorkspace: (_, { values }, { getUser }) =>
        getOrCreateWorkspace(getUser(), values),
    },
  },
});
