// import { S } from 'schema';
// import { SubmissionStatus, TestInfo } from 'shared';
// import { SubmissionCollection } from '../../collections/Submission';
// import { AppError } from '../../common/errors';
// import { safeAssign, safeKeys } from '../../common/helper';
// import { createContract, createGraphqlBinding } from '../../lib';

// export const updateSubmissionProgress = createContract(
//   'submission.updateSubmissionProgress'
// )
//   .params('notifyKey', 'values')
//   .schema({
//     notifyKey: S.string(),
//     values: S.object().keys({
//       status: S.enum().literal(...Object.values(SubmissionStatus)),
//       testRun: S.array()
//         .items(S.object().unknown().as<TestInfo>())
//         .optional()
//         .nullable(),
//     }),
//   })
//   .fn(async (notifyKey, values) => {
//     const submission = await SubmissionCollection.findOne({
//       notifyKey,
//     });
//     if (!submission) {
//       throw new AppError('Cannot find submission for key: ' + notifyKey);
//     }
//     if (
//       submission.status === SubmissionStatus.Fail ||
//       submission.status === SubmissionStatus.Pass
//     ) {
//       throw new AppError('Cannot update finished submission');
//     }
//     safeAssign(submission, values);
//     await SubmissionCollection.update(submission, safeKeys(values));
//   });

// export const updateSubmissionProgressGraphql = createGraphqlBinding({
//   resolver: {
//     Mutation: {
//       updateSubmissionProgress: (_, { values }, { getUser }) =>
//         updateSubmissionProgress(getUser(), values),
//     },
//   },
// });
