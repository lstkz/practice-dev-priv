import * as R from 'remeda';
import { S } from 'schema';
import { Module, PaginatedResult } from 'shared';
import { ChallengeSolvedCollection } from '../../collections/ChallengeSolved';
import { ModuleCollection } from '../../collections/Module';
import { createContract, createRpcBinding } from '../../lib';
import { AppUser } from '../../types';
import { ChallengeCollection } from '../../collections/Challenge';
import { ChallengeAttemptCollection } from '../../collections/ChallengeAttempt';

async function _getSolvedStats(user: AppUser | undefined, moduleIds: number[]) {
  const ret: Record<number, number> = {};
  if (!user || !moduleIds.length) {
    return {};
  }
  const aggregateResult = await ChallengeSolvedCollection.aggregate<{
    _id: number;
    count: number;
  }>([
    {
      $match: {
        userId: user._id,
        moduleId: {
          $in: moduleIds,
        },
      },
    },
    {
      $group: {
        _id: '$moduleId',
        count: { $sum: 1 },
      },
    },
  ]).toArray();
  aggregateResult.forEach(item => {
    ret[item._id] = item.count;
  });
  return ret;
}

async function _getChallengeStats(moduleIds: number[]) {
  const ret: Record<
    number,
    {
      practiceTime: number;
      count: number;
    }
  > = {};
  if (!moduleIds.length) {
    return {};
  }
  const aggregateResult = await ChallengeCollection.aggregate<{
    _id: number;
    practiceTime: number;
    count: number;
  }>([
    {
      $match: {
        moduleId: {
          $in: moduleIds,
        },
      },
    },
    {
      $group: {
        _id: '$moduleId',
        practiceTime: { $sum: '$practiceTime' },
        count: { $sum: 1 },
      },
    },
  ]).toArray();
  aggregateResult.forEach(item => {
    ret[item._id] = R.pick(item, ['practiceTime', 'count']);
  });
  return ret;
}

async function _getAttemptedStats(
  user: AppUser | undefined,
  moduleIds: number[]
) {
  const ret: Record<number, boolean> = {};
  moduleIds.forEach(id => {
    ret[id] = false;
  });
  if (!user || !moduleIds.length) {
    return {};
  }
  const aggregateResult = await ChallengeAttemptCollection.aggregate<{
    _id: number;
    count: number;
  }>([
    {
      $match: {
        userId: user._id,
        moduleId: {
          $in: moduleIds,
        },
      },
    },
    {
      $group: {
        _id: '$moduleId',
        count: { $sum: 1 },
      },
    },
  ]).toArray();
  aggregateResult.forEach(item => {
    ret[item._id] = item.count > 0;
  });
  return ret;
}

export const searchModules = createContract('module.searchModules')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser().optional(),
    criteria: S.object().keys({
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
    }),
  })
  .returns<PaginatedResult<Module>>()
  .fn(async (user, criteria) => {
    const filter = {};
    const [items, total] = await Promise.all([
      ModuleCollection.find(filter)
        .sort({
          _id: 1,
        })
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      ModuleCollection.countDocuments(filter),
    ]);
    const moduleIds = items.map(x => x._id);
    const [solvedStatsMap, challengeStatsMap, attemptedStatsMap] =
      await Promise.all([
        _getSolvedStats(user, moduleIds),
        _getChallengeStats(moduleIds),
        _getAttemptedStats(user, moduleIds),
      ]);
    return {
      total,
      items: items.map(item => {
        const solvedStats = solvedStatsMap[item._id];
        const challengeStats = challengeStatsMap[item._id];
        const attemptedStats = attemptedStatsMap[item._id];
        const mapped: Module = {
          id: item._id,
          ...R.omit(item, ['_id']),
          isAttempted: attemptedStats ?? false,
          solvedChallenges: solvedStats ?? 0,
          totalChallenges: challengeStats?.count ?? 0,
          totalTime: challengeStats?.practiceTime ?? 0,
        };
        return mapped;
      }),
    };
  });

export const searchModulesRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'module.searchModules',
  handler: searchModules,
});
