class LeftPanelTabManager {
    activeTab = $state<'pages' | 'layers' | 'assets'>('pages');

    setActiveTab(tab: 'pages' | 'layers' | 'assets') {
        if (this.activeTab !== tab) {
            this.activeTab = tab;
        }
    }
}

export const leftPanelTabManager = new LeftPanelTabManager();