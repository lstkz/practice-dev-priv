import { S } from 'schema';
import { ObjectID } from 'mongodb2';
import { createContract, createTaskBinding, lambda } from '../../lib';
import { config } from 'config';
import { logger } from '../../common/logger';
import {
  SubmissionStatus,
  TestSubmissionLambdaInput,
  TestSubmissionLambdaOutput,
} from 'shared';
import { dispatchEvent } from '../../dispatch';
import { SubmissionCollection } from '../../collections/Submission';
import { ChallengeCollection } from '../../collections/Challenge';
import { getCDNUrl } from '../../common/helper';

export const testSubmission = createContract('workspace.testSubmission')
  .params('submissionId')
  .schema({
    submissionId: S.string().objectId(),
  })
  .fn(async submissionId => {
    const submission = await SubmissionCollection.findByIdOrThrow(submissionId);
    const challenge = await ChallengeCollection.findByIdOrThrow(
      submission.challengeUniqId
    );
    const payload: TestSubmissionLambdaInput = {
      submissionId: submissionId.toHexString(),
      apiBaseUrl: config.proxyApiBaseUrl ?? config.apiBaseUrl,
      notifyKey: submission.notifyKey,
      testFileUrl: getCDNUrl(challenge.testS3Key),
      indexUrl: getCDNUrl(submission.indexHtmlS3Key),
    };
    const result = await lambda
      .invoke(
        {
          FunctionName: config.aws.testerLambdaName,
          Payload: JSON.stringify(payload),
        },
        undefined
      )
      .promise();
    if (result.StatusCode !== 200) {
      logger.error(result);
      throw new Error('Failed to invoke lambda');
    }
    if (result.FunctionError) {
      logger.error(result);
      throw new Error('Lambda returned an error');
    }
    const output = JSON.parse(
      result.Payload!.toString()
    ) as TestSubmissionLambdaOutput;
    submission.testRun = output.testRun;
    submission.status = output.success
      ? SubmissionStatus.Pass
      : SubmissionStatus.Fail;
    await SubmissionCollection.update(submission, ['testRun', 'status']);
    if (output.success) {
      await dispatchEvent({
        type: 'SubmissionPassed',
        payload: {
          submissionId: submission._id.toHexString(),
        },
      });
    }
  });

export const testSubmissionTask = createTaskBinding({
  type: 'TestSubmission',
  handler: async (_, task) => {
    await testSubmission(ObjectID.createFromHexString(task.submissionId));
  },
});
