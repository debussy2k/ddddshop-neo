import HistoryManager from "./history-manager";


interface Section {
    id: number;
    name: string;
    type: string;
    content?: any;
}

interface DocState {
    sections: Section[];
    metadata?: {
        title?: string;
        author?: string;
        createdAt?: Date;
        updatedAt?: Date;
    };
}

class StudioDoc {
    private doc = $state<DocState>({
        sections: [],
        metadata: {
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    
    private sampleCount = 0;
    private historyManager = new HistoryManager(this.doc);
    private unsub: () => void;

    constructor() {
        this.unsub =this.historyManager.subscribe((state) => {
            this.doc = state;
            console.log('state changed', state);
        });
    }

    // 반드시 어디에선가의 onDestory에서 호출되어야 함.
    destroy() {
        this.unsub();
    }

    get document(): DocState {
        return this.doc;
    }

    get sections(): Section[] {
        return this.doc.sections;
    }

    addSampleSection(): DocState {
        this.sampleCount++;
        
        const section: Section = {
            id: this.sampleCount,
            name: `Section ${this.sampleCount}`,
            type: 'section'
        };

        return this.historyManager.execute((draft) => {
            draft.sections.push(section);
            draft.metadata!.updatedAt = new Date();
        });
    }

    addSection(section: Omit<Section, 'id'>): DocState {
        const newSection: Section = {
            ...section,
            id: Date.now() // 또는 UUID 사용
        };

        return this.historyManager.execute((draft) => {
            draft.sections.push(newSection);
            draft.metadata!.updatedAt = new Date();
        });
    }

    removeSection(id: number): DocState {
        return this.historyManager.execute((draft) => {
            draft.sections = draft.sections.filter(s => s.id !== id);
            draft.metadata!.updatedAt = new Date();
        });
    }

    // 편의 메서드들
    undo() {
        return this.historyManager.undo();
    }

    redo() {
        return this.historyManager.redo();
    }

    getHistoryInfo() {
        return this.historyManager.getHistoryInfo();
    }
}

export const studioDoc = new StudioDoc();