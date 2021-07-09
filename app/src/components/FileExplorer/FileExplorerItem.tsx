import React from 'react';
import { useFileExplorerActions, useFileExplorerState } from './FileExplorer';
import { FileExplorerItemList } from './FileExplorerItemList';
import { FileIcon } from './icons/FileIcon';
import { FolderIcon } from './icons/FolderIcon';
import { ExpandedIcon } from './icons/ExpandedIcon';
import tw, { styled } from 'twin.macro';
import { TrashIcon } from './icons/TrashIcon';
import { ActionIcon } from './ActionIcon';
import { EditIcon } from './icons/EditIcon';
import { NewDirectoryIcon } from './icons/NewDirectoryIcon';
import { NewFileIcon } from './icons/NewFileIcon';
import { ExplorerItemType } from './types';

interface FileExplorerItemProps {
  item: ExplorerItemType;
  nestedLevel: number;
}

const Wrapper = styled.div`
  ${tw`flex items-center hover:bg-gray-800 cursor-pointer text-gray-300 py-0.5 relative select-none focus:outline-none border border-transparent`}
`;

const Actions = styled.div`
  ${tw`absolute right-0 top-0 bottom-0 text-gray-400 hidden group-hover:flex items-center px-2 space-x-1 bg-gray-800`}
`;

export function FileExplorerItem(props: FileExplorerItemProps) {
  const { item, nestedLevel } = props;
  const {
    activeItemId,
    navigationActiveItemId,
    expandedDirectories,
    hasFocus,
  } = useFileExplorerState();
  const { toggleDirectoryExpanded, setActive } = useFileExplorerActions();
  const style = {
    paddingLeft: nestedLevel + 'rem',
  };
  const isActive = item.id === activeItemId;
  const bgCss = [
    isActive && tw`bg-gray-700 hover:bg-gray-700`,
    isActive && hasFocus && tw`bg-indigo-700 hover:bg-indigo-700`,
  ];
  const wrapperCss = [
    ...bgCss,
    item.id === navigationActiveItemId && tw`border border-blue-600`,
  ];
  if (item.type === 'file') {
    return (
      <Wrapper
        tabIndex={0}
        style={style}
        className="group"
        onClick={() => {
          setActive(item.id);
        }}
        css={wrapperCss}
      >
        <div tw="w-4 h-4 mr-1 ml-4">
          <FileIcon name={item.name} />
        </div>
        {item.name}
        <Actions css={bgCss}>
          <ActionIcon title="Edit">
            <EditIcon />
          </ActionIcon>
          <ActionIcon title="Delete">
            <TrashIcon />
          </ActionIcon>
        </Actions>
      </Wrapper>
    );
  }
  const isExpanded = expandedDirectories[item.id];
  return (
    <>
      <Wrapper
        tabIndex={0}
        style={style}
        className="group"
        onClick={() => {
          toggleDirectoryExpanded(item.id);
          setActive(item.id);
        }}
        css={wrapperCss}
      >
        <div tw="h-4 w-4">
          <ExpandedIcon isExpanded={isExpanded} />
        </div>
        <div tw="w-4 h-4 mr-1">
          <FolderIcon isOpen={isExpanded} />
        </div>
        {item.name}
        <Actions css={bgCss}>
          <ActionIcon title="New File">
            <NewFileIcon />
          </ActionIcon>
          <ActionIcon title="New Directory">
            <NewDirectoryIcon />
          </ActionIcon>
          <ActionIcon title="Edit">
            <EditIcon />
          </ActionIcon>
          <ActionIcon title="Delete">
            <TrashIcon />
          </ActionIcon>
        </Actions>
      </Wrapper>
      {isExpanded && (
        <FileExplorerItemList
          nestedLevel={nestedLevel + 1}
          items={item.content}
        />
      )}
    </>
  );
}
