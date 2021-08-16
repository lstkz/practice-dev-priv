import { S } from 'schema';
import * as R from 'remeda';
import { Follower, PaginatedResult } from 'shared';
import { FollowerCollection } from '../../collections/Follower';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';

export const searchFollowers = createContract('follower.searchFollowers')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser().optional(),
    criteria: S.object().keys({
      username: S.string(),
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
    }),
  })
  .returns<PaginatedResult<Follower>>()
  .fn(async (user, criteria) => {
    const filter: Record<string, any> = {};
    const targetUser = await UserCollection.findOneByUsername(
      criteria.username
    );
    if (!targetUser) {
      throw new AppError('User not found');
    }
    filter.targetUserId = targetUser._id;
    const [items, total] = await Promise.all([
      FollowerCollection.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      FollowerCollection.countDocuments(filter),
    ]);
    const [currentUserFollowers, users] = await Promise.all([
      !user
        ? []
        : FollowerCollection.findAll({
            targetUserId: {
              $in: items.map(x => x.fromUserId),
            },
            fromUserId: user._id,
          }),
      UserCollection.findAll({
        _id: {
          $in: items.map(x => x.fromUserId),
        },
      }),
    ]);
    const currentFollowerMap = R.indexBy(
      currentUserFollowers,
      x => x.targetUserId
    );
    const userMap = R.indexBy(users, x => x._id);
    return {
      items: items.map(item => {
        const userId = item.fromUserId.toHexString();
        const user = userMap[userId];
        const follower = currentFollowerMap[userId];
        return {
          id: userId,
          isFollowing: follower != null,
          name: user.profile?.name ?? '',
          username: user.username,
          avatarId: user.avatarId,
        };
      }),
      total,
    };
  });

export const searchFollowersRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'follower.searchFollowers',
  handler: searchFollowers,
});
