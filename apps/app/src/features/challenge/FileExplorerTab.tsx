import React from 'react';
import * as R from 'remeda';
import { TreeNode } from 'src/types';
import { FileExplorer } from '../../components/FileExplorer/FileExplorer';
import {
  useEditorState,
  useIsEditorLoaded,
  useWorkspaceModel,
  useWorkspaceState,
} from './editor/EditorModule';

export function FileExplorerTab() {
  const isLoaded = useIsEditorLoaded();
  const { nodes, nodeState } = useWorkspaceState();
  const { workspace } = useEditorState();
  const workspaceModel = useWorkspaceModel();
  const lockedNodesMap = React.useMemo(() => {
    const lockedNodesMap: Record<string, boolean> = {};
    const nodeMap = R.indexBy(nodes, x => x.id);
    const travel = (node: TreeNode) => {
      lockedNodesMap[node.id] = true;
      if (node.parentId) {
        travel(nodeMap[node.parentId]);
      }
    };
    workspace.items.filter(x => x.isLocked).forEach(travel);
    return lockedNodesMap;
  }, [workspace]);
  if (!isLoaded) {
    return null;
  }
  return (
    <FileExplorer
      lockedNodesMap={lockedNodesMap}
      nodeState={nodeState}
      items={nodes}
      onOpenFile={id => workspaceModel.openFile(id)}
      onNewFile={values => workspaceModel.addNew(values)}
      onRemoved={id => workspaceModel.removeNode(id)}
      onRename={(id, name) => workspaceModel.renameNode(id, name)}
    />
  );
}
