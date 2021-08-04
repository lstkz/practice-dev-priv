import { notifyTestProgress } from '../src/notifyTestProgress';
import { mocked } from 'ts-jest/utils';
import { APINotifier } from '../src/APINotifier';
import { SocketMessage } from 'shared';

jest.mock('../src/notifyTestProgress');

const notifyTestProgress_mocked = mocked(notifyTestProgress);

let notifier: APINotifier = null!;

beforeEach(() => {
  notifier = new APINotifier('http://example.org', '1234');
  notifyTestProgress_mocked.mockReset();
  Date.now = () => new Date(2000, 1, 1).getTime();
});

function getMsg(nr: number): SocketMessage {
  return {
    type: 'STARTING_TEST',
    meta: { id: 'mock' },
    payload: { testId: nr },
  };
}

function assertInvokes(...nr: number[]) {
  expect(notifyTestProgress_mocked).toHaveBeenCalledWith(
    'http://example.org',
    '1234',
    nr.map(getMsg)
  );
}

it('first message should be send immediately', async () => {
  const msg = getMsg(1);
  await notifier.notify(msg);
  assertInvokes(1);
});

it('second msg should be queued and send after flush', async () => {
  const msg1 = getMsg(1);
  const msg2 = getMsg(2);
  await notifier.notify(msg1);
  await notifier.notify(msg2);
  assertInvokes(1);
  notifyTestProgress_mocked.mockClear();
  await notifier.flush();
  assertInvokes(2);
});

it('second msg should be not be queued if 500ms elapsed', async () => {
  const msg1 = getMsg(1);
  const msg2 = getMsg(2);
  await notifier.notify(msg1);
  Date.now = () => new Date(3000, 1, 1).getTime();
  await notifier.notify(msg2);
  assertInvokes(1);
  assertInvokes(2);
});

it('queue multiple messages and flush', async () => {
  await notifier.notify(getMsg(1));
  assertInvokes(1);
  notifyTestProgress_mocked.mockClear();
  await notifier.notify(getMsg(2));
  await notifier.notify(getMsg(3));
  await notifier.notify(getMsg(4));
  await notifier.flush();
  assertInvokes(2, 3, 4);
});

it('queue multiple messages flush if 500 elapsed', async () => {
  await notifier.notify(getMsg(1));
  assertInvokes(1);
  notifyTestProgress_mocked.mockClear();
  await notifier.notify(getMsg(2));
  await notifier.notify(getMsg(3));
  Date.now = () => new Date(3000, 1, 1).getTime();
  await notifier.notify(getMsg(4));
  assertInvokes(2, 3, 4);
});
