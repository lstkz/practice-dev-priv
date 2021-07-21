import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
export type Monaco = typeof monacoEditor;

export type NodeId = string;

export type NewElementType = 'file' | 'directory';

export interface AddNewElementValues {
  id: NodeId;
  type: NewElementType;
  name: string;
  parentId: string | null;
}

export type TreeNode = FileNode | DirectoryNode;

interface BaseNode {
  id: NodeId;
  name: string;
  parentId?: string | null;
}

export interface FileNode extends BaseNode {
  type: 'file';
}

export interface DirectoryNode extends BaseNode {
  type: 'directory';
}

export type RecTreeNode = FileNode | RecDirectoryNode;

export interface RecDirectoryNode extends DirectoryNode {
  children: RecTreeNode[];
}
