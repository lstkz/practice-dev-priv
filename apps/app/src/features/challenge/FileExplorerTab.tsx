import React from 'react';
import * as R from 'remeda';
import {
  DirectoryItemType,
  ExplorerItemType,
} from 'src/components/FileExplorer/types';
import { FileExplorer } from '../../components/FileExplorer/FileExplorer';
import { useEditorActions, useEditorState } from './editor/EditorModule';

export function FileExplorerTab() {
  const { nodes, isLoaded } = useEditorState();
  const { openFile, addNew, removeNode, renameNode } = useEditorActions();
  const items = React.useMemo(() => {
    if (!isLoaded) {
      return [];
    }
    const mapped: ExplorerItemType[] = nodes.map(node => {
      if (node.type === 'file') {
        return {
          id: node.id,
          type: 'file',
          name: node.name,
        };
      }
      return {
        id: node.id,
        type: 'directory',
        name: node.name,
        content: [],
      };
    });
    const nodeMap = R.indexBy(nodes, x => x.id);
    const mappedMap = R.indexBy(mapped, x => x.id);
    mapped.forEach(item => {
      const element = nodeMap[item.id];
      if (element.parentId) {
        (mappedMap[element.parentId] as DirectoryItemType).content.push(item);
      }
    });
    return mapped.filter(item => !nodeMap[item.id].parentId);
  }, [isLoaded]);
  if (!isLoaded) {
    return null;
  }
  return (
    <FileExplorer
      items={items}
      onOpenFile={openFile}
      onNewFile={addNew}
      onRemoved={removeNode}
      onRename={renameNode}
    />
  );
}
