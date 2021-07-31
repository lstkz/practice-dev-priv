/* eslint-disable @typescript-eslint/no-namespace */
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { editor as editorBase } from 'monaco-editor';

declare module 'monaco-editor' {
  export namespace editor {
    export interface StandaloneKeybindingService {
      // from: https://github.com/microsoft/vscode/blob/df6d78a/src/vs/editor/standalone/browser/simpleServices.ts#L337
      // Passing undefined with `-` prefixing the commandId, will unset the existing keybinding.
      // eg `addDynamicKeybinding('-fooCommand', undefined, () => {})`
      // this is technically not defined in the source types, but still works. We can't pass `0`
      // because then the underlying method exits early.
      // See: https://github.com/microsoft/vscode/blob/df6d78a/src/vs/base/common/keyCodes.ts#L414
      addDynamicKeybinding(
        commandId: string,
        keybinding: number | undefined,
        handler: editorBase.ICommandHandler,
        when?: any // ContextKeyExpression
      ): IDisposable;
    }

    export interface ICodeEditor {
      _standaloneKeybindingService: StandaloneKeybindingService;
    }
  }
}

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

export type TreeNodeType = TreeNode['type'];

export type RecTreeNode = FileNode | RecDirectoryNode;

export interface RecDirectoryNode extends DirectoryNode {
  children: RecTreeNode[];
}

export interface LibraryDep {
  name: string;
  types: string;
  source: string;
}

export type HighlighterAction = {
  type: 'highlight';
  payload: {
    lang: string;
    code: string;
    version: number;
  };
};

export type HighlighterCallbackAction = {
  type: 'highlight';
  payload: {
    classifications: Classification[];
    version: number;
  };
};

export type FormatterAction = {
  type: 'format';
  payload: {
    lang: string;
    code: string;
    version: number;
  };
};

export type FormatterCallbackAction =
  | {
      type: 'highlight';
      payload: {
        code: string;
        version: number;
      };
    }
  | {
      type: 'error';
      payload: {
        error: any;
        version: number;
      };
    };

export interface Classification {
  startLine: number;
  endLine: number;
  start: number;
  end: number;
  scope: string;
}

export interface SourceCode {
  code: string;
}

export interface BundlerAction {
  type: 'bundle';
  payload: {
    input: string;
    modules: Record<string, SourceCode>;
    version: number;
  };
}

export type BundlerCallbackAction =
  | {
      type: 'bundled';
      payload: {
        code: string;
        version: number;
      };
    }
  | {
      type: 'error';
      payload: {
        error: string;
        version: number;
      };
    };

export interface CreateWorkspaceNodeInput {
  id: string;
  workspaceId: string;
  name: string;
  parentId?: string | null;
  hash: string;
  type: 'file' | 'directory';
}

export interface UpdateWorkspaceNodeInput {
  id: string;
  name?: string | null;
  parentId?: string | null;
  hash?: string | null;
}

export interface IAPIService {
  getFileContent(options: {
    workspaceId: string;
    fileId: string;
    hash: string;
  }): Promise<string>;

  addNode(values: CreateWorkspaceNodeInput): Promise<void>;

  deleteNode(nodeId: string): Promise<void>;

  updateNode(
    values: UpdateWorkspaceNodeInput & { content?: string }
  ): Promise<void>;
}

export interface InitWorkspaceOptions {
  workspaceId: string;
  nodes: TreeNode[];
  fileHashMap: Map<string, string>;
}