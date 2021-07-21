import React from 'react';
import { CSSProp } from 'styled-components';
import { ActionIcon } from './ActionIcon';
import { useFileExplorerActions, useFileExplorerState } from './FileExplorer';
import { EditIcon } from './icons/EditIcon';
import { NewDirectoryIcon } from './icons/NewDirectoryIcon';
import { TrashIcon } from './icons/TrashIcon';
import { NewFileIcon } from './icons/NewFileIcon';
import { RecTreeNode, TreeNodeType } from 'src/types';

interface ItemActionsProps {
  css?: CSSProp;
  className?: string;
  item: RecTreeNode;
  setIsAdding: (type: TreeNodeType) => void;
  onEdit: () => void;
}

export function confirmItemDelete(item: RecTreeNode) {
  return confirm(`Are you sure you want to delete "${item.name}"?`);
}

export function ItemActions(props: ItemActionsProps) {
  const { item, className, setIsAdding, onEdit } = props;
  const { toggleDirectoryExpanded, removeItem } = useFileExplorerActions();
  const { expandedDirectories } = useFileExplorerState();
  const isExpanded = expandedDirectories[item.id];

  return (
    <div
      tw="absolute right-0 top-0 bottom-0 text-gray-400 hidden group-hover:flex items-center px-2 space-x-1 bg-gray-800"
      className={className}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {item.type === 'directory' && (
        <>
          <ActionIcon
            title="New File"
            onClick={() => {
              if (!isExpanded) {
                toggleDirectoryExpanded(item.id);
              }
              setIsAdding('file');
            }}
          >
            <NewFileIcon />
          </ActionIcon>
          <ActionIcon
            title="New Directory"
            onClick={() => {
              if (!isExpanded) {
                toggleDirectoryExpanded(item.id);
              }
              setIsAdding('directory');
            }}
          >
            <NewDirectoryIcon />
          </ActionIcon>
        </>
      )}
      <ActionIcon title="Edit" onClick={onEdit}>
        <EditIcon />
      </ActionIcon>
      <ActionIcon
        title="Delete"
        onClick={() => {
          if (confirmItemDelete(item)) {
            removeItem(item.id);
          }
        }}
      >
        <TrashIcon />
      </ActionIcon>
    </div>
  );
}
