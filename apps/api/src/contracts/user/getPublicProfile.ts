import { S } from 'schema';
import { UserPublicProfile } from 'shared';
import {
  createFollowerId,
  FollowerCollection,
} from '../../collections/Follower';
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
    const [submissions, solutions, currentFollower, followers, following] =
      await Promise.all([
        SubmissionCollection.countDocuments({
          userId: viewUser._id,
        }),
        SolutionCollection.countDocuments({
          userId: viewUser._id,
        }),
        !user
          ? null
          : FollowerCollection.findById(
              createFollowerId({
                fromUserId: user._id,
                targetUserId: viewUser._id,
              })
            ),
        FollowerCollection.countDocuments({
          targetUserId: viewUser._id,
        }),
        FollowerCollection.countDocuments({
          fromUserId: viewUser._id,
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
      followers,
      following,
      memberSince: viewUser.registeredAt.toISOString(),
      lastSeen: viewUser.lastSeenAt.toISOString(),
      about: viewUser.profile?.about ?? '',
      isFollowing: currentFollower != null,
    };
  });

export const getPublicProfileRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'user.getPublicProfile',
  handler: getPublicProfile,
});
