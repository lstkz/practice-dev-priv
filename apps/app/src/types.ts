import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
export type Monaco = typeof monacoEditor;

export type NewElementType = 'file' | 'directory';

export interface AddNewElementValues {
  id: string;
  type: NewElementType;
  name: string;
  parentId: string | null;
}
