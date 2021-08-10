import { ChallengeFile } from '../collections/Challenge';
import * as R from 'remeda';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeModel,
} from '../collections/WorkspaceNode';
import * as uuid from 'uuid';
import { WorkspaceNodeType } from 'shared';
import { SubmissionNodeModel } from '../collections/Submission';

export function getNodeUniqueKey(
  node: Pick<WorkspaceNodeModel, 'workspaceId' | 'parentId' | 'type' | 'name'>
) {
  const parts = [
    node.workspaceId,
    node.parentId ?? '',
    node.type,
    node.name.toLowerCase(),
  ];
  return parts.join('_');
}

export function getWorkspaceNodeWithUniqueKey(
  node: Omit<WorkspaceNodeModel, 'uniqueKey'>
) {
  const ret: WorkspaceNodeModel = {
    ...node,
    uniqueKey: getNodeUniqueKey(node),
  };
  return ret;
}

export function createWorkspaceNodes(
  baseProps: Pick<WorkspaceNodeModel, 'workspaceId' | 'userId'>,
  files: ChallengeFile[]
) {
  const items: WorkspaceNodeModel[] = [];
  const directoryMap: Record<string, WorkspaceNodeModel> = {};
  const getDirectoryParts = (directoryPath: string) =>
    directoryPath.split('/').filter(x => x && x !== '.');
  const createDirectories = (directoryPath: string) => {
    const parts = getDirectoryParts(directoryPath);
    const currentParts: string[] = [];
    let parent: WorkspaceNodeModel | null = null;
    parts.forEach(part => {
      currentParts.push(part);
      const path = currentParts.join('/');
      if (!directoryMap[path]) {
        directoryMap[path] = {
          ...baseProps,
          _id: uuid.v4(),
          hash: 'init',
          name: part,
          type: WorkspaceNodeType.Directory,
          parentId: parent?._id ?? null,
          uniqueKey: '',
        };
        directoryMap[path].uniqueKey = getNodeUniqueKey(directoryMap[path]);
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
    const node = {
      ...baseProps,
      _id: uuid.v4(),
      hash: 'init',
      name: file.name,
      type: WorkspaceNodeType.File,
      parentId: getParentId(file.directory),
      sourceS3Key: file.s3Key,
      uniqueKey: '',
      isLocked: file.isLocked,
    };
    node.uniqueKey = getNodeUniqueKey(node);
    items.push(node);
  });
  items.push(...Object.values(directoryMap));
  return items;
}

export async function findNodeAllChildren(parentId: string) {
  const ret: WorkspaceNodeModel[] = [];
  const travel = async (parentId: string) => {
    const children = await WorkspaceNodeCollection.findAll({ parentId });
    ret.push(...children);
    await Promise.all(children.map(child => travel(child._id)));
  };
  await travel(parentId);
  return ret;
}

export function createWorkspaceNodesFromSubmission(
  baseProps: Pick<WorkspaceNodeModel, 'workspaceId' | 'userId'>,
  files: ChallengeFile[],
  submissionNodes: SubmissionNodeModel[]
) {
  const getFullPath = (directory: string, name: string) =>
    directory + '/' + name;
  const fileMap = R.indexBy(files, x => getFullPath(x.directory, x.name));
  const getDirectoryPath = (node: SubmissionNodeModel) => {
    const path = [];
    while (node.parentId) {
      node = nodeMap[node.parentId];
      path.unshift(node.name);
    }
    path.unshift('.');
    return path.join('/');
  };
  const nodeMap = R.indexBy(submissionNodes, x => x._id);
  const mockedFiles = submissionNodes
    .filter(x => x.type === WorkspaceNodeType.File)
    .map(node => {
      const directory = getDirectoryPath(node);
      const file: ChallengeFile = {
        s3Key: node.s3Key!,
        name: node.name,
        directory,
        isLocked: fileMap[getFullPath(directory, node.name)]?.isLocked,
      };
      return file;
    });
  return createWorkspaceNodes(baseProps, mockedFiles);
}
