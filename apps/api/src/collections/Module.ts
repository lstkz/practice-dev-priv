import { ModuleStats } from 'shared';
import { createCollection } from '../db';

export interface ModuleModel {
  _id: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  mainTechnology: string;
  stats: ModuleStats;
}

export const ModuleCollection = createCollection<ModuleModel>('module');
