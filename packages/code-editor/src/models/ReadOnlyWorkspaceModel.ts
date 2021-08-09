import { CodeEditor } from '../CodeEditor';
import { ModelState, ModelStateUpdater } from '../lib/ModelState';
import { FileTreeHelper, findFileByPath } from '../lib/tree';
import { BundlerService } from '../services/BundlerService';
import {
  IAPIService,
  InitReadOnlyWorkspaceOptions,
  IWorkspaceModel,
  WorkspaceState,
} from '../types';

function getDefaultState(): WorkspaceState {
  return {
    activeTabId: null,
    tabs: [],
    dirtyMap: {},
    nodes: [],
    nodeState: {},
  };
}

export class ReadOnlyWorkspaceModel implements IWorkspaceModel {
  private modelState: ModelState<WorkspaceState> = null!;

  constructor(
    private codeEditor: CodeEditor,
    private apiService: IAPIService,
    private bundlerService: BundlerService
  ) {
    this.modelState = new ModelState(getDefaultState(), 'WorkspaceTreeModel');
  }

  private get state() {
    return this.modelState.state;
  }

  public getModelState() {
    return this.modelState;
  }

  async init(options: InitReadOnlyWorkspaceOptions) {
    const { defaultOpenFiles, nodes } = options;
    this.codeEditor.setReadOnly(true);
    this.setState(_ => getDefaultState());
    const pathHelper = new FileTreeHelper(nodes);
    const tree = pathHelper.buildRecTree();
    const tabs = defaultOpenFiles
      .map(path => findFileByPath(tree, path))
      .map(node => ({
        id: node.id,
        name: node.name,
      }));
    this.setState(draft => {
      draft.activeTabId = tabs[0].id;
      draft.tabs = tabs;
      draft.nodes = nodes;
    });
    await Promise.all(
      this.state.nodes.map(async node => {
        if (node.type === 'file') {
          this.codeEditor.addFile({
            id: node.id,
            path: pathHelper.getPath(node.id),
            source: await this.apiService.getFileContent(node.contentUrl!),
          });
        }
      })
    );
    if (this.state.activeTabId) {
      this.codeEditor.openFile(this.state.activeTabId);
    }

    this.bundlerService.init();
    this.bundlerService.setInputFile('./index.tsx');
    this.bundlerService.loadCode();
  }

  async removeNode() {
    throw new Error('Not supported');
  }
  async renameNode() {
    throw new Error('Not supported');
  }

  openFile(id: string) {
    this._openTab(id);
    this.codeEditor.openFile(id);
  }

  closeFile(id: string) {
    let newActiveId: string | null | -1 = -1;
    this.setState(draft => {
      draft.tabs = draft.tabs.filter(x => x.id !== id);
      if (draft.activeTabId === id) {
        draft.activeTabId = draft.tabs[0]?.id ?? null;
        newActiveId = draft.activeTabId;
      }
    });
    if (newActiveId !== -1) {
      this.codeEditor.openFile(newActiveId);
    }
    const { dirtyMap } = this.state;
    if (dirtyMap[id]) {
      this.setState(draft => {
        delete draft.dirtyMap[id];
      });
      this.codeEditor.revertDirty(id);
    }
  }

  addNew() {
    throw new Error('Not supported');
  }

  ////

  private setState(updater: ModelStateUpdater<WorkspaceState>) {
    this.modelState.update(updater);
  }

  private _openTab(id: string) {
    const file = this._getNodeById(id);
    this.setState(draft => {
      draft.activeTabId = id;
      if (!draft.tabs.some(x => x.id === id)) {
        draft.tabs.push({
          id: id,
          name: file.name,
        });
      }
    });
  }

  private _getNodeById(id: string) {
    const { nodes } = this.state;
    return nodes.find(x => x.id === id)!;
  }
}
