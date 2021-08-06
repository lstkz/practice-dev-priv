import { Notifier } from '@pvd/tester';
import { TesterSocketMessage } from 'shared';

export class MultiNotifier implements Notifier {
  constructor(private notifiers: Notifier[]) {}

  async flush() {
    await Promise.all(this.notifiers.map(notifier => notifier.flush()));
  }

  async notify(action: TesterSocketMessage) {
    await Promise.all(this.notifiers.map(notifier => notifier.notify(action)));
  }
}
