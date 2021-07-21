import React from 'react';
import {
  FileNode,
  RecDirectoryNode,
  RecTreeNode,
  TreeNodeType,
} from 'src/types';
import { AddNewItem } from './AddNewItem';
import { FileExplorerItem } from './FileExplorerItem';

interface FileExplorerItemListProps {
  items: RecTreeNode[];
  nestedLevel: number;
  isAdding?: TreeNodeType | null;
  onNewAdded?: (type: TreeNodeType, name: string) => void;
  onNewCancelled?: () => void;
}

export function FileExplorerItemList(props: FileExplorerItemListProps) {
  const { items, nestedLevel, isAdding, onNewAdded, onNewCancelled } = props;
  const fileItems: FileNode[] = [];
  const directoryItems: RecDirectoryNode[] = [];
  items.forEach(item => {
    if (item.type === 'file') {
      fileItems.push(item);
    } else {
      directoryItems.push(item);
    }
  });
  const renderItem = (item: RecTreeNode) => (
    <FileExplorerItem nestedLevel={nestedLevel} item={item} key={item.id} />
  );
  return (
    <>
      {isAdding === 'directory' && (
        <AddNewItem
          nestedLevel={nestedLevel}
          type={isAdding}
          onNewAdded={onNewAdded!}
          onNewCancelled={onNewCancelled!}
        />
      )}
      {directoryItems.map(renderItem)}
      {isAdding === 'file' && (
        <AddNewItem
          nestedLevel={nestedLevel}
          type={isAdding}
          onNewAdded={onNewAdded!}
          onNewCancelled={onNewCancelled!}
        />
      )}
      {fileItems.map(renderItem)}
    </>
  );
}
