import HistoryManager, { HistoryMode } from "./history-manager";
import type { DocState, CompositeWidget, Widget } from "./types";
import { du } from "./widgets/common/doc-util";

export interface HistoryInfo {
    pastCount: number;
    futureCount: number;
    canUndo: boolean;
    canRedo: boolean;
    currentMode: HistoryMode;
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
        canRedo: false,
        currentMode: HistoryMode.RECORD
    });

	// 현재 활성화 되어있는 항목 id
	activeId = $state<string | null>(null);

	// widgetMap = new Map<string, any>(); // id를 key로 하는 위젯 맵
	widgetMap: Record<string, any> = {};
	getWidget<T>(id: string): T {
		return this.widgetMap[id] as T;
	}
	getParentWidgetComponent<T>(id: string): T {
		let parent = du.getParentByChildId(id, this.doc);
		if (!parent) return null as T;
		return this.widgetMap[parent.id] as T;
	}

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
        this._historyInfo.currentMode = info.currentMode;
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
        
        return du.findById(this.activeId, this.doc);
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

    // localStorage 키
    private readonly STORAGE_KEY = 'studio-doc-state';

    // 문서를 localStorage에 저장
    save = () => {
        try {
            const docData = {
                doc: this.doc,
                timestamp: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(docData));
            return true;
        } catch (error) {
            console.error('Failed to save document:', error);
            return false;
        }
    }

    // localStorage에서 문서 불러오기
    load = () => {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (!savedData) {
                return false;
            }
            
            const { doc } = JSON.parse(savedData);
            
            // 히스토리에 새로운 상태로 실행 (execute 사용)
            this.historyManager.execute(() => doc);
            
            return true;
        } catch (error) {
            console.error('Failed to load document:', error);
            return false;
        }
    }

    // 저장된 문서가 있는지 확인
    hasSavedDocument = () => {
        try {
            return localStorage.getItem(this.STORAGE_KEY) !== null;
        } catch (error) {
            return false;
        }
    }

    getParentByChildId(id: string): Readonly<CompositeWidget> | undefined {
        return du.getParentByChildId(id, this.doc);
    }
}

export const studioDoc = new StudioDoc();