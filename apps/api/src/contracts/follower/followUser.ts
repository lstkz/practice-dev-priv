import { S } from 'schema';
import {
  createFollowerId,
  FollowerCollection,
} from '../../collections/Follower';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { getCurrentDate } from '../../common/helper';
import { withTransaction } from '../../db';
import { createContract, createRpcBinding } from '../../lib';

export const followUser = createContract('follower.followUser')
  .params('user', 'username')
  .schema({
    user: S.object().appUser(),
    username: S.string(),
  })
  .returns<void>()
  .fn(async (user, username) => {
    const targetUser = await UserCollection.findOneByUsername(username);
    if (!targetUser) {
      throw new AppError('User not found');
    }
    if (user._id.equals(targetUser._id)) {
      throw new AppError('Cannot follow yourself');
    }
    await withTransaction(async () => {
      const followerId = createFollowerId({
        targetUserId: targetUser._id,
        fromUserId: user._id,
      });
      const existing = await FollowerCollection.findById(followerId);
      if (existing) {
        throw new AppError('Already following');
      }
      await FollowerCollection.insertOne({
        _id: followerId,
        createdAt: getCurrentDate(),
        fromUserId: user._id,
        targetUserId: targetUser._id,
      });
    });
  });

export const followUserRpc = createRpcBinding({
  injectUser: true,
  signature: 'follower.followUser',
  handler: followUser,
});
