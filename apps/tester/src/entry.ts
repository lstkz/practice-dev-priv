import type { TestSubmissionLambdaInput } from 'shared/src/types';
import fs from 'fs';
import http from 'http';
import fetch from 'cross-fetch';
import path from 'path';
import tcpPortUsed from 'tcp-port-used';
import { runTests } from '@pvd/tester';
import { MultiNotifier } from './MultiNotifier';
import { APINotifier } from './APINotifier';
import { InMemoryNotifier } from './InMemoryNotifier';

async function findFreePort(min: number, max: number) {
  for (let port = min; port <= max; port++) {
    const used = await tcpPortUsed.check(port).catch(() => true);
    if (!used) {
      return port;
    }
  }
  throw new Error('Cannot find port');
}

type CleanupCallback = () => void;

async function startServer(page: string) {
  const port = await findFreePort(5000, 5500);
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(page);
  });
  return new Promise<[string, CleanupCallback]>((resolve, reject) => {
    try {
      server.listen(port, '0.0.0.0', () =>
        resolve([
          'http://localhost:' + port,
          () => {
            server.close();
          },
        ])
      );
    } catch (e) {
      reject(e);
    }
  });
}

export async function testerHandler(event: TestSubmissionLambdaInput) {
  const [testContent, indexContent] = await Promise.all([
    fetch(event.testFileUrl).then(x => x.text()),
    fetch(event.indexUrl).then(x => x.text()),
  ]);
  const testName = path.basename(event.testFileUrl);
  const testPath = path.join('/tmp', testName);
  fs.writeFileSync(testPath, testContent);

  const apiNotifier = new APINotifier();
  const inMemoryNotifier = new InMemoryNotifier();
  const multiNotifier = new MultiNotifier([apiNotifier]);
  const [testUrl, dispose] = await startServer(indexContent);
  try {
    await runTests(
      event.submissionId,
      testUrl,
      require(testPath).default,
      multiNotifier
    );
  } finally {
    dispose();
  }

  return inMemoryNotifier.getTestOutput();
}
