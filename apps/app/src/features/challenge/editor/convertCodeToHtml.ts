import { LibraryDefinition } from 'shared';

export function convertCodeToHtml(
  code: string,
  libraries: LibraryDefinition[]
) {
  const importMap: Record<string, string> = {};
  libraries.forEach(lib => {
    importMap[lib.name] = lib.source;
  });
  const escape = (str: string) => str.replace(/</g, '\\u003c');
  return `
<!DOCTYPE html>
<html>
    <head>
      <meta charset="utf-8" />
      <title>Your awesome app</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script type="importmap">
      ${escape(
        JSON.stringify(
          {
            imports: importMap,
          },
          null,
          2
        )
      )}
      </script>
      <script type="module" id="__app">
        ${escape(code)}
      </script> 
    </head>
    <body>
      <div id="root"></div>
    </body>
</html
`.trimStart();
}
