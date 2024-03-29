import { ChallengeStats, LibraryDefinition } from 'shared';
import { createCollection } from '../db';

export interface ChallengeFile {
  name: string;
  isLocked?: boolean | null;
  directory: string;
  s3Key: string;
}

export interface ChallengeModel {
  _id: string;
  moduleId: number;
  challengeModuleId: number;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  practiceTime: number;
  detailsS3Key: string;
  htmlS3Key: string;
  testS3Key: string;
  solutionUrl: string;
  files: ChallengeFile[];
  libraries: LibraryDefinition[];
  tests: string[];
  stats: ChallengeStats;
}

export const ChallengeCollection = createCollection<ChallengeModel>(
  'challenge',
  [
    {
      key: {
        challengeModuleId: 1,
        moduleId: 1,
      },
      unique: true,
    },
    {
      key: {
        slug: 1,
      },
      unique: true,
    },
    {
      key: {
        moduleId: 1,
      },
    },
  ]
);
