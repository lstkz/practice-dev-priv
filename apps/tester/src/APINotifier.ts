import { Notifier } from '@pvd/tester';
import { SocketMessage } from 'shared';

export class APINotifier implements Notifier {
  constructor() {}

  async flush() {}

  async notify(action: SocketMessage) {}
}
