import HistoryManager from "./history-manager";


interface Section {
    id: number;
    name: string;
    type: string;
    content?: any;
}

interface DocState {
    sections: Section[];
}

class StudioDoc {
    private doc = $state<DocState>({
        sections: [],
    });
    
    private sampleCount = 0;
    private historyManager = new HistoryManager(this.doc);
    private unsub: () => void;
    
    // 히스토리 정보를 reactive state로 관리
    private _historyInfo = $state({
        pastCount: 0,
        futureCount: 0,
        canUndo: false,
        canRedo: false
    });

    constructor() {
        this.unsub = this.historyManager.subscribe((state) => {
            this.doc = state;
            // 히스토리 정보도 함께 업데이트
            this.updateHistoryInfo();
        });
        
        // 초기 히스토리 정보 설정
        this.updateHistoryInfo();
    }
    
    // 히스토리 정보 업데이트 메서드
    private updateHistoryInfo() {
        const info = this.historyManager.getHistoryInfo();
        this._historyInfo.pastCount = info.pastCount;
        this._historyInfo.futureCount = info.futureCount;
        this._historyInfo.canUndo = info.canUndo;
        this._historyInfo.canRedo = info.canRedo;
    }

    // 반드시 어디에선가의 onDestory에서 호출되어야 함.
    destroy() {
        this.unsub();
    }

    get document(): DocState {
        return this.doc;
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
        });
    }

    addSection(section: Omit<Section, 'id'>): DocState {
        const newSection: Section = {
            ...section,
            id: Date.now() // 또는 UUID 사용
        };

        return this.historyManager.execute((draft) => {
            draft.sections.push(newSection);
        });
    }

    removeSection(id: number): DocState {
        return this.historyManager.execute((draft) => {
            draft.sections = draft.sections.filter(s => s.id !== id);
        });
    }

    // 편의 메서드들 (화살표 함수로 this 바인딩)
    undo = () => {
        return this.historyManager.undo();
    }

    redo = () => {
        return this.historyManager.redo();
    }

    // reactive한 히스토리 정보 getter
    get historyInfo() {
        return this._historyInfo;
    }
}

export const studioDoc = new StudioDoc();