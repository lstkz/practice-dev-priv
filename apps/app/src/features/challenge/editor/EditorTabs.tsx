import { useEditorActions, useEditorState } from './EditorModule';
import { FileTab } from './FileTab';

export function EditorTabs() {
  const { tabs, activeFile } = useEditorState();
  const { closeFile, openFile } = useEditorActions();
  return (
    <div tw="flex space-x-0.5 overflow-hidden">
      {tabs.map(tab => (
        <FileTab
          key={tab.id}
          name={tab.name}
          isActive={tab.id === activeFile}
          onOpen={() => openFile(tab.id)}
          onClose={() => closeFile(tab.id)}
        />
      ))}
    </div>
  );
}
