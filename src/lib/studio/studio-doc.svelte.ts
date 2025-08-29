import HistoryManager from "./history-manager";
import type { DocState } from "./types";

export interface HistoryInfo {
    pastCount: number;
    futureCount: number;
    canUndo: boolean;
    canRedo: boolean;
}


class StudioDoc {
    private initialDoc: DocState = {
        sections: [],
    }
    
    private doc = $state<DocState>(this.initialDoc);
    
    historyManager = new HistoryManager(this.initialDoc);
    private unsub: () => void;
    
    // 히스토리 정보를 reactive state로 관리
    private _historyInfo = $state<HistoryInfo>({
        pastCount: 0,
        futureCount: 0,
        canUndo: false,
        canRedo: false
    });

	// 현재 활성화 되어있는 항목 id
	activeId = $state<string | null>(null);

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

    get current(): DocState {
        return this.doc;
    }

    get activeItem() {
        if(!this.activeId) return null;
        
        // Section에서 찾기
        const section = this.doc.sections.find(section => section.id === this.activeId);
        if (section) return section;
        
        // 모든 Section의 children에서 Sandbox 찾기
        for (const section of this.doc.sections) {
            if (section.children) {
                const sandbox = section.children.find(child => child.id === this.activeId);
                if (sandbox) return sandbox;
            }
        }
        
        return null;
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