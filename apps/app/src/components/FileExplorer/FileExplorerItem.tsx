import React from 'react';
import { useFileExplorerActions, useFileExplorerState } from './FileExplorer';
import { FileExplorerItemList } from './FileExplorerItemList';
import tw, { styled } from 'twin.macro';
import { ExplorerItemType, NewFileType } from './types';
import { confirmItemDelete, ItemActions } from './ItemActions';
import { NameInput } from './NameInput';
import { ItemPrefixIcons } from './ItemPrefixIcons';

interface FileExplorerItemProps {
  item: ExplorerItemType;
  nestedLevel: number;
}

const Wrapper = styled.div`
  ${tw`flex h-6 items-center hover:bg-gray-800 cursor-pointer text-gray-300   relative select-none focus:outline-none border border-transparent`}
`;

export function FileExplorerItem(props: FileExplorerItemProps) {
  const { item, nestedLevel } = props;
  const {
    activeItemId,
    navigationActiveItemId,
    expandedDirectories,
    hasFocus,
  } = useFileExplorerState();
  const {
    toggleDirectoryExpanded,
    setActive,
    addNew,
    updateItemName,
    registerItem,
    removeItem,
  } = useFileExplorerActions();
  const style = {
    paddingLeft: nestedLevel + 'rem',
  };
  const [isAdding, setIsAdding] = React.useState<NewFileType | null>(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const isActive = item.id === activeItemId;
  const bgCss = [
    isActive && tw`bg-gray-700 hover:bg-gray-700`,
    isActive && hasFocus && tw`bg-indigo-700 hover:bg-indigo-700`,
  ];
  const wrapperRef = React.useRef<HTMLDivElement>(null!);
  const startEdit = () => {
    setIsEdit(true);
    setEditName(item.name);
  };
  const hideEdit = () => {
    setIsEdit(false);
    requestAnimationFrame(() => {
      wrapperRef.current.focus();
    });
  };
  React.useEffect(() => {
    registerItem(item.id, {
      confirmDelete: () => {
        if (confirmItemDelete(item)) {
          removeItem(item.id);
        }
      },
      rename: () => {
        startEdit();
      },
    });
    return () => {
      registerItem(item.id, null);
    };
  }, []);

  const isExpanded = expandedDirectories[item.id];
  const commitEdit = () => {
    const name = editName.trim();
    if (name) {
      updateItemName(item.id, name);
    }
    hideEdit();
  };

  return (
    <>
      <Wrapper
        ref={wrapperRef}
        tabIndex={0}
        style={style}
        className="group"
        onClick={() => {
          if (item.type === 'directory') {
            toggleDirectoryExpanded(item.id);
          }
          setActive(item.id);
        }}
        css={[
          ...bgCss,
          isEdit && tw`border-t-0 border-b-0`,
          item.id === navigationActiveItemId && tw`border border-blue-600`,
        ]}
      >
        <ItemPrefixIcons
          type={item.type}
          name={item.name}
          isExpanded={isExpanded}
        />
        {isEdit ? (
          <NameInput
            value={editName}
            onChange={e => setEditName(e.target.value)}
            autoFocus
            type="text"
            onFocus={e => {
              const dotIdx = editName.lastIndexOf('.');
              e.target.setSelectionRange(
                0,
                dotIdx === -1 ? editName.length : dotIdx
              );
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                commitEdit();
              }
              if (e.key === 'Escape') {
                hideEdit();
              }
              e.stopPropagation();
            }}
            onBlur={commitEdit}
          />
        ) : (
          item.name
        )}
        {!isEdit && (
          <ItemActions
            css={bgCss}
            item={item}
            setIsAdding={setIsAdding}
            onEdit={startEdit}
          />
        )}
      </Wrapper>
      {isExpanded && item.type === 'directory' && (
        <FileExplorerItemList
          isAdding={isAdding}
          nestedLevel={nestedLevel + 1}
          items={item.content}
          onNewAdded={(type, name) => {
            addNew(type, name, item.id);
            setIsAdding(null);
          }}
          onNewCancelled={() => {
            setIsAdding(null);
          }}
        />
      )}
    </>
  );
}
