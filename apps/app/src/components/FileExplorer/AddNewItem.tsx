import React from 'react';
import { ItemPrefixIcons } from './ItemPrefixIcons';
import { NameInput } from './NameInput';
import { NewFileType } from './types';

interface AddNewItemProps {
  nestedLevel: number;
  type: NewFileType;
  onNewAdded: (type: NewFileType, name: string) => void;
  onNewCancelled: () => void;
}

export function AddNewItem(props: AddNewItemProps) {
  const { type, onNewAdded, onNewCancelled, nestedLevel } = props;
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
    <div
      style={{
        paddingLeft: nestedLevel + 'rem',
      }}
      tw="flex items-center text-gray-300 select-none focus:outline-none border border-transparent bg-indigo-700 h-6"
    >
      <ItemPrefixIcons type={type} name={value} />
      <NameInput
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus
        type="text"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            commit();
          }
          if (e.key === 'Escape') {
            onNewCancelled();
          }
          e.stopPropagation();
        }}
        onBlur={commit}
      />
    </div>
  );
}
