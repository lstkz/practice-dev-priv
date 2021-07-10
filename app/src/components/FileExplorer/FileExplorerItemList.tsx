import React from 'react';
import { AddNewItem } from './AddNewItem';
import { FileExplorerItem } from './FileExplorerItem';
import { ExplorerItemType, NewFileType } from './types';

interface FileExplorerItemListProps {
  items: ExplorerItemType[];
  nestedLevel: number;
  isAdding?: NewFileType | null;
  onNewAdded?: (type: NewFileType, name: string) => void;
  onNewCancelled?: () => void;
}

export function FileExplorerItemList(props: FileExplorerItemListProps) {
  const { items, nestedLevel, isAdding, onNewAdded, onNewCancelled } = props;
  const fileItems: ExplorerItemType[] = [];
  const directoryItems: ExplorerItemType[] = [];
  items.forEach(item => {
    if (item.type === 'file') {
      fileItems.push(item);
    } else {
      directoryItems.push(item);
    }
  });
  const renderItem = (item: ExplorerItemType) => (
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
