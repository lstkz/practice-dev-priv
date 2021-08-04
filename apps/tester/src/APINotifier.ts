import { Notifier } from '@pvd/tester';
import { SocketMessage } from 'shared';
import { notifyTestProgress } from './notifyTestProgress';

export class APINotifier implements Notifier {
  private lastNotify = 0;
  private pendingData: any[] = [];

  constructor(private apiBaseUrl: string, private notifyKey: string) {}

  async flush() {
    if (this.pendingData.length) {
      await this.notifySocket([], true);
    }
  }

  async notify(action: SocketMessage) {
    await this.notifySocket(action);
  }

  private async notifySocket(data: object, force = false) {
    if (!force && Date.now() - this.lastNotify < 500) {
      this.pendingData.push(data);
      return;
    }

    const combined = [
      ...this.pendingData,
      ...(Array.isArray(data) ? data : [data]),
    ];
    this.pendingData = [];
    await notifyTestProgress(this.apiBaseUrl, this.notifyKey, combined);
    this.lastNotify = Date.now();
  }
}
