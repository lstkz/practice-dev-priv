import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  WorkspaceCollection,
  WorkspaceModel,
} from '../../collections/Workspace';
import { WorkspaceItemCollection } from '../../collections/WorkspaceItem';
import { AppError } from '../../common/errors';
import { renameId } from '../../common/helper';
import { dispatchTask } from '../../dispatch';
import { Workspace } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';

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
    const existing = await WorkspaceCollection.findOne({ dedupKey });
    if (existing) {
      const files = await WorkspaceItemCollection.findAll({
        workspaceId: existing._id,
      });
      return {
        id: existing._id.toHexString(),
        isReady: existing.isReady,
        items: files.map(renameId),
      };
    }
    const workspace: WorkspaceModel = {
      _id: new ObjectID(),
      challengeUniqId: values.challengeUniqId,
      userId: appUser.id,
      dedupKey,
      isReady: false,
    };
    await WorkspaceCollection.insertOne(workspace);
    await dispatchTask({
      type: 'PrepareWorkspace',
      payload: {
        workspaceId: workspace._id.toHexString(),
      },
    });
    return {
      id: workspace._id.toHexString(),
      isReady: workspace.isReady,
      items: [],
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
