interface OpenedTab {
  id: string;
  name: string;
}

interface TabsState {
  activeTabId: string | null;
  tabs: OpenedTab[];
}

export class EditorStateService {
  constructor(private challengeId: number) {}

  private getTabsStateKey() {
    return `challenge_tabs_state_${this.challengeId}`;
  }

  updateTabsState(state: TabsState) {
    localStorage[this.getTabsStateKey()] = JSON.stringify(state);
  }

  loadTabsState(): TabsState {
    try {
      return JSON.parse(localStorage[this.getTabsStateKey()]);
    } catch (e) {
      return {
        activeTabId: null,
        tabs: [],
      };
    }
  }
}
