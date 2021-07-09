import React from 'react';
import { ExpandedIcon } from './icons/ExpandedIcon';
import { FileIcon } from './icons/FileIcon';
import { FolderIcon } from './icons/FolderIcon';
import { NewFileType } from './types';

interface AddNewItemProps {
  type: NewFileType;
  onNewAdded: (type: NewFileType, name: string) => void;
  onNewCancelled: () => void;
}

export function AddNewItem(props: AddNewItemProps) {
  const { type, onNewAdded, onNewCancelled } = props;
  const [value, setValue] = React.useState('');
  const commit = () => {
    const name = value.trim();
    if (name) {
      onNewAdded(type, name);
    } else {
      onNewCancelled();
    }
  };
  return (
    <div tw="flex items-center text-gray-300 select-none focus:outline-none border border-transparent bg-indigo-700 ">
      <div tw=" flex">
        {type === 'directory' && (
          <>
            <div tw="h-4 w-4">
              <ExpandedIcon isExpanded={false} />
            </div>
            <div tw="w-4 h-4 mr-1">
              <FolderIcon isOpen={false} />
            </div>
          </>
        )}
        {type === 'file' && (
          <>
            <div tw="w-4 h-4 mr-1 ml-4">
              <FileIcon name={value} />
            </div>
          </>
        )}
      </div>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus
        type="text"
        tw="px-0 h-auto w-auto min-w-0 bg-indigo-800 border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-500 text-sm text-gray-300 flex-1"
        style={{
          marginLeft: -1,
          paddingTop: 1 / 16 + 'rem',
          paddingBottom: 1 / 16 + 'rem',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            commit();
          }
          if (e.key === 'Escape') {
            onNewCancelled();
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}
