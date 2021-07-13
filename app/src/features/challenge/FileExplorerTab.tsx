import { FileExplorer } from '../../components/FileExplorer/FileExplorer';

export function FileExplorerTab() {
  return (
    <FileExplorer
      items={[
        { id: '1', type: 'file', name: 'index.tsx' },
        { id: '2', type: 'file', name: 'index.html' },
        { id: '3', type: 'file', name: 'style.css' },
        {
          id: '4',
          type: 'directory',
          name: 'components',
          content: [
            { id: '5', type: 'file', name: 'Button.tsx' },
            { id: '6', type: 'file', name: 'Select.tsx' },
            { id: '7', type: 'file', name: 'Input.tsx' },
          ],
        },
        {
          id: '8',
          type: 'directory',
          name: 'common',
          content: [
            { id: '9', type: 'file', name: 'utils.ts' },
            { id: '10', type: 'file', name: 'helper.ts' },
          ],
        },
      ]}
    />
  );
}
