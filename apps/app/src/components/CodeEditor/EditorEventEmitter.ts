export interface CallbackMap {
  modified: (data: { fileId: string; hasChanges: boolean }) => void;
  saved: (data: { fileId: string; content: string }) => void;
}
type FirstArg<T> = T extends (arg: infer U) => any ? U : never;

export class EditorEventEmitter {
  private callbacks: Array<{ type: string; callback: (arg: any) => void }> = [];

  addEventListener<T extends keyof CallbackMap>(
    type: T,
    callback: CallbackMap[T]
  ) {
    const data = { type, callback };
    this.callbacks.push(data);
    return () => {
      this.callbacks.splice(this.callbacks.indexOf(data), 1);
    };
  }

  emit<T extends keyof CallbackMap>(type: T, arg: FirstArg<CallbackMap[T]>) {
    this.callbacks.forEach(data => {
      if (data.type === type) {
        data.callback(arg);
      }
    });
  }
}
