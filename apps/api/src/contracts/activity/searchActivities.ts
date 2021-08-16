import { S } from 'schema';
import * as R from 'remeda';
import {
  Activity,
  ActivityChallengeSolved,
  ActivityRegistered,
  PaginatedResult,
} from 'shared';
import { ActivityCollection, ActivityModel } from '../../collections/Activity';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { ModuleCollection } from '../../collections/Module';
import { ChallengeCollection } from '../../collections/Challenge';

async function _mapActivityRegistered(items: ActivityModel[]) {
  const ret: Record<string, ActivityRegistered> = {};
  items.forEach(item => {
    if (item.data.type === 'registered') {
      ret[item._id.toHexString()] = {
        type: 'registered',
        values: {
          createdAt: item.createdAt.toISOString(),
        },
      };
    }
  });
  return ret;
}

async function _mapChallengeSolved(items: ActivityModel[]) {
  const ret: Record<string, ActivityChallengeSolved> = {};
  const moduleIds: number[] = [];
  const challengeIds: string[] = [];
  items.forEach(item => {
    if (item.data.type === 'challenge-solved') {
      const { values } = item.data;
      moduleIds.push(values.moduleId);
      challengeIds.push(values.challengeId);
    }
  });
  const [modules, challenges] = await Promise.all([
    moduleIds.length === 0
      ? []
      : ModuleCollection.findAll({
          _id: {
            $in: moduleIds,
          },
        }),
    challengeIds.length === 0
      ? []
      : ChallengeCollection.findAll({
          _id: {
            $in: challengeIds,
          },
        }),
  ]);
  const moduleMap = R.indexBy(modules, x => x._id);
  const challengeMap = R.indexBy(challenges, x => x._id);

  items.forEach(item => {
    if (item.data.type === 'challenge-solved') {
      const { values } = item.data;
      const challenge = challengeMap[values.challengeId];
      const module = moduleMap[values.moduleId];
      ret[item._id.toHexString()] = {
        type: 'challenge-solved',
        values: {
          createdAt: item.createdAt.toISOString(),
          challenge: {
            id: challenge._id,
            title: challenge.title,
            moduleId: challenge.moduleId,
            challengeModuleId: challenge.challengeModuleId,
          },
          module: {
            id: module._id,
            title: module.title,
          },
        },
      };
      moduleIds.push(item.data.values.moduleId);
      challengeIds.push(item.data.values.challengeId);
    }
  });
  return ret;
}

export const searchActivities = createContract('activity.searchActivities')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      username: S.string(),
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
    }),
  })
  .returns<PaginatedResult<Activity>>()
  .fn(async criteria => {
    const user = await UserCollection.findOneByUsername(criteria.username);
    if (!user) {
      throw new AppError('User not found');
    }
    const filter = {
      userId: user._id,
    };
    const [items, total] = await Promise.all([
      ActivityCollection.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      ActivityCollection.countDocuments(filter),
    ]);
    const maps = await Promise.all([
      _mapChallengeSolved(items),
      _mapActivityRegistered(items),
    ]);
    const activityMap: Record<string, Activity> = Object.assign({}, ...maps);
    return {
      total,
      items: items.map(item => activityMap[item._id.toHexString()]),
    };
  });

export const searchActivitiesRpc = createRpcBinding({
  public: true,
  signature: 'activity.searchActivities',
  handler: searchActivities,
});
