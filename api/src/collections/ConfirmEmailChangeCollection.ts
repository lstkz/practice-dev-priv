import { createCollection } from '../db';

export interface ConfirmEmailChangeCollectionModel {
  foo: string;
}

export const ConfirmEmailChangeCollectionCollection = createCollection<ConfirmEmailChangeCollectionModel>(
  'confirmEmailChangeCollection'
);
