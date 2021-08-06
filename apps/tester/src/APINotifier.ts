import { Notifier } from '@pvd/tester';
import https from 'https';
import { APIClient, TesterSocketMessage } from 'shared';

const agent = new https.Agent({ keepAlive: true });

export class APINotifier implements Notifier {
  private lastNotify = 0;
  private pendingData: any[] = [];
  private api: APIClient;

  constructor(apiBaseUrl: string, private notifyKey: string) {
    this.api = new APIClient(apiBaseUrl, () => null, agent);
  }

  async flush() {
    if (this.pendingData.length) {
      await this.notifySocket([], true);
    }
  }

  async notify(action: TesterSocketMessage) {
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
    try {
      await this.api.submission_notifyTestProgress(this.notifyKey, combined);
    } catch (e) {
      console.error('failed to notify result', e);
    }
    this.lastNotify = Date.now();
  }
}
