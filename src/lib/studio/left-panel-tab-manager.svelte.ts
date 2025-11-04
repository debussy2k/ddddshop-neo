import type { LeftPanelTab } from "./types";

class LeftPanelTabManager {
    activeTab = $state<LeftPanelTab>('layers');

    setActiveTab(tab: LeftPanelTab) {
        if (this.activeTab !== tab) {
            this.activeTab = tab;
        }
    }
}

export const leftPanelTabManager = new LeftPanelTabManager();