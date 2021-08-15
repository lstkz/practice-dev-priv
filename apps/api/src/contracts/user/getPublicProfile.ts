import { S } from 'schema';
import { UserPublicProfile } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import { SubmissionCollection } from '../../collections/Submission';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';

export const getPublicProfile = createContract('user.getPublicProfile')
  .params('user', 'username')
  .schema({
    user: S.object().appUser().optional(),
    username: S.string(),
  })
  .returns<UserPublicProfile>()
  .fn(async (user, username) => {
    const viewUser = await UserCollection.findOneByUsername(username);
    if (!viewUser) {
      throw new AppError('User not found');
    }
    const [submissions, solutions] = await Promise.all([
      SubmissionCollection.countDocuments({
        userId: viewUser._id,
      }),
      SolutionCollection.countDocuments({
        userId: viewUser._id,
      }),
    ]);

    return {
      id: viewUser._id.toHexString(),
      username: viewUser.username,
      name: viewUser.profile?.name ?? '',
      avatarId: viewUser.avatarId,
      rank: 0,
      crypto: 0,
      solutions,
      submissions,
      followers: 0,
      following: 0,
      memberSince: viewUser.registeredAt.toISOString(),
      lastSeen: viewUser.lastSeenAt.toISOString(),
      about: viewUser.profile?.about ?? '',
    };
  });

export const getPublicProfileRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'user.getPublicProfile',
  handler: getPublicProfile,
});
