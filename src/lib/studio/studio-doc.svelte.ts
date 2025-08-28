import HistoryManager from "./history-manager";
import type { Section, DocState, HistoryInfo } from "./types";
// import Command from "./command";

class StudioDoc {
    private doc = $state<DocState>({
        sections: [],
    });
    
    historyManager = new HistoryManager(this.doc);
    private unsub: () => void;
    // cmd = new Command(this.historyManager);
    
    // 히스토리 정보를 reactive state로 관리
    private _historyInfo = $state<HistoryInfo>({
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