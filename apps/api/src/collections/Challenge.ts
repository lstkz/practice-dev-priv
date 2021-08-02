import { LibraryDefinition } from 'shared';
import { createCollection } from '../db';

export interface ChallengeFile {
  name: string;
  directory: string;
  s3Key: string;
}

export interface ChallengeModel {
  _id: string;
  challengeId: number;
  moduleId: number;
  title: string;
  description: string;
  difficulty: string;
  practiceTime: number;
  detailsS3Key: string;
  htmlS3Key: string;
  files: ChallengeFile[];
  libraries: LibraryDefinition[];
}

export const ChallengeCollection = createCollection<ChallengeModel>(
  'challenge',
  [
    {
      key: {
        challengeId: 1,
        moduleId: 1,
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
