import { ChallengeFile } from '../collections/Challenge';
import {
  WorkspaceItemModel,
  WorkspaceItemType,
} from '../collections/WorkspaceItem';
import uuid from 'uuid';

export function createWorkspaceItems(
  baseProps: Pick<WorkspaceItemModel, 'workspaceId' | 'userId'>,
  files: ChallengeFile[]
) {
  const items: WorkspaceItemModel[] = [];
  const directoryMap: Record<string, WorkspaceItemModel> = {};
  const getDirectoryParts = (directoryPath: string) =>
    directoryPath.split('/').filter(x => x && x !== '.');
  const createDirectories = (directoryPath: string) => {
    const parts = getDirectoryParts(directoryPath);
    const currentParts: string[] = [];
    let parent: WorkspaceItemModel | null = null;
    parts.forEach(part => {
      currentParts.push(part);
      const path = currentParts.join('/');
      if (!directoryMap[path]) {
        directoryMap[path] = {
          ...baseProps,
          _id: uuid.v4(),
          hash: 'init',
          name: part,
          type: WorkspaceItemType.Directory,
          parentId: parent?._id ?? null,
        };
      }
      parent = directoryMap[path];
    });
  };
  const getParentId = (directoryPath: string) => {
    if (!directoryPath || directoryPath === '.') {
      return null;
    }
    const normalizedPath = getDirectoryParts(directoryPath).join('/');
    if (!directoryMap[normalizedPath]) {
      createDirectories(directoryPath);
    }
    return directoryMap[normalizedPath]._id;
  };
  files.forEach(file => {
    items.push({
      ...baseProps,
      _id: uuid.v4(),
      hash: 'init',
      name: file.name,
      type: WorkspaceItemType.File,
      parentId: getParentId(file.directory),
      sourceS3Key: file.s3Key,
    });
  });
  items.push(...Object.values(directoryMap));
  return items;
}
