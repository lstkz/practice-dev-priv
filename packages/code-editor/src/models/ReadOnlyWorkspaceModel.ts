import { CodeEditor } from '../CodeEditor';
import { ModelState, ModelStateUpdater } from '../lib/ModelState';
import { FileTreeHelper, findFileByPath } from '../lib/tree';
import { BundlerService } from '../services/BundlerService';
import {
  IAPIService,
  InitReadOnlyWorkspaceOptions,
  WorkspaceState,
} from '../types';

export class ReadOnlyWorkspaceModel {
  private modelState: ModelState<WorkspaceState> = null!;

  constructor(
    private codeEditor: CodeEditor,
    private apiService: IAPIService,
    private bundlerService: BundlerService
  ) {
    this.modelState = new ModelState(
      {
        activeTabId: null,
        tabs: [],
        dirtyMap: {},
        nodes: [],
        nodeState: {},
      },
      'WorkspaceTreeModel'
    );
  }

  private get state() {
    return this.modelState.state;
  }

  async init(options: InitReadOnlyWorkspaceOptions) {
    const { defaultOpenFiles, nodes } = options;
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

    this.bundlerService.init();
    this.bundlerService.setInputFile('./index.tsx');
    this.bundlerService.loadCode();
  }

  private setState(updater: ModelStateUpdater<WorkspaceState>) {
    this.modelState.update(updater);
  }
}
