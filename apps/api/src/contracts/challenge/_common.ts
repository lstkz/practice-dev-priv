import * as R from 'remeda';
import { Challenge } from 'shared';
import {
  ChallengeCollection,
  ChallengeModel,
} from '../../collections/Challenge';
import { ChallengeAttemptCollection } from '../../collections/ChallengeAttempt';
import { ChallengeSolvedCollection } from '../../collections/ChallengeSolved';
import { AppError } from '../../common/errors';
import { doFn } from '../../common/helper';
import { AppUser } from '../../types';

async function _getAttemptedStats(
  user: AppUser | undefined,
  challengeIds: string[]
) {
  const ret: Record<string, boolean> = {};
  if (!user || !challengeIds.length) {
    return ret;
  }
  const attempts = await ChallengeAttemptCollection.findAll({
    userId: user._id,
    challengeId: {
      $in: challengeIds,
    },
  });
  attempts.forEach(item => {
    ret[item.challengeId] = true;
  });
  return ret;
}

async function _getSolvedStats(
  user: AppUser | undefined,
  challengeIds: string[]
) {
  const ret: Record<string, boolean> = {};
  if (!user || !challengeIds.length) {
    return ret;
  }
  const attempts = await ChallengeSolvedCollection.findAll({
    userId: user._id,
    challengeId: {
      $in: challengeIds,
    },
  });
  attempts.forEach(item => {
    ret[item.challengeId] = true;
  });
  return ret;
}

export async function populateChallenges(
  user: AppUser | undefined,
  items: ChallengeModel[]
) {
  const challengeIds = items.map(x => x._id);
  const [solvedStatsMap, attemptedStatsMap] = await Promise.all([
    _getSolvedStats(user, challengeIds),
    _getAttemptedStats(user, challengeIds),
  ]);
  return items.map(item => {
    const mapped: Challenge = {
      id: item._id,
      ...R.pick(item, [
        'moduleId',
        'challengeModuleId',
        'title',
        'description',
        'difficulty',
        'practiceTime',
        'stats',
        'slug',
      ]),
      isAttempted: attemptedStatsMap[item._id] ?? false,
      isSolved: solvedStatsMap[item._id] ?? false,
    };
    return mapped;
  });
}

export async function getChallengeByIdOrSlug(values: {
  id?: string;
  slug?: string;
}) {
  if (!values.id && !values.slug) {
    throw new AppError('id or slug required');
  }
  const challenge = await doFn(async () => {
    if (values.id) {
      return ChallengeCollection.findById(values.id);
    }
    return ChallengeCollection.findOne({
      slug: values.slug,
    });
  });
  if (!challenge) {
    throw new AppError('Challenge not found');
  }
  return challenge;
}
