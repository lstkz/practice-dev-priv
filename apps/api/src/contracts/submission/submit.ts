import { ForbiddenError } from 'apollo-server';
import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { SubmissionStatus } from 'shared';
import {
  SubmissionCollection,
  SubmissionModel,
} from '../../collections/Submission';
import { WorkspaceCollection } from '../../collections/Workspace';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { getCurrentDate, randomUniqString } from '../../common/helper';
import { dispatchTask } from '../../dispatch';
import { createContract, createRpcBinding } from '../../lib';

export const submit = createContract('submission.submit')
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      workspaceId: S.string().objectId(),
      indexHtmlS3Key: S.string(),
    }),
  })
  .returns<string>()
  .fn(async (user, values) => {
    const workspace = await WorkspaceCollection.findById(values.workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found');
    }
    if (!workspace.userId.equals(user._id)) {
      throw new ForbiddenError('Not permission to access this workspace');
    }
    const workspaceNodes = await WorkspaceNodeCollection.findAll({
      workspaceId: values.workspaceId,
    });
    const nodes = await Promise.all(
      workspaceNodes.map(async node => {
        return {
          _id: node._id,
          name: node.name,
          parentId: node.parentId,
          type: node.type,
          s3Key: null,
          sourceS3Key: node.sourceS3Key,
        };
      })
    );
    const submission: SubmissionModel = {
      _id: new ObjectID(),
      userId: user._id,
      workspaceId: workspace._id,
      challengeUniqId: workspace.challengeUniqId,
      indexHtmlS3Key: values.indexHtmlS3Key,
      nodes,
      createdAt: getCurrentDate(),
      status: SubmissionStatus.Queued,
      notifyKey: randomUniqString(),
    };
    await SubmissionCollection.insertOne(submission);
    await dispatchTask({
      type: 'TestSubmission',
      payload: {
        submissionId: submission._id.toHexString(),
      },
    });
    await dispatchTask({
      type: 'CloneWorkspaceFiles',
      payload: {
        submissionId: submission._id.toHexString(),
      },
    });
    return submission._id.toHexString();
  });

export const submitRpc = createRpcBinding({
  injectUser: true,
  signature: 'submission.submit',
  handler: submit,
});
