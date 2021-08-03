import { S } from 'schema';
import { ObjectID } from 'mongodb2';
import { createContract, createTaskBinding } from '../../lib';

export const cloneWorkspaceFiles = createContract(
  'submission.cloneWorkspaceFiles'
)
  .params('submissionId')
  .schema({
    submissionId: S.string().objectId(),
  })
  .fn(async submissionId => {
    //
  });

export const cloneWorkspaceFilesTask = createTaskBinding({
  type: 'CloneWorkspaceFiles',
  handler: async (_, task) => {
    await cloneWorkspaceFiles(ObjectID.createFromHexString(task.submissionId));
  },
});
