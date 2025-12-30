import HistoryManager, { HistoryMode } from "./history-manager";
import type { DocState, CompositeWidget, Widget, BreakPoint } from "./types";
import * as du from "./widgets/common/doc-util";

export interface HistoryInfo {
    pastCount: number;
    futureCount: number;
    canUndo: boolean;
    canRedo: boolean;
    currentMode: HistoryMode;
}


function  getMockupAssets() {
    return { components: [] };
    // return {
    //     components: [ 
    //         {
    //             id: "1000",
    //             type: "component",
    //             name: "컴포넌트 mockup"
    //         }
    //     ]
    // }
}

class StudioDoc {
    private initialDoc: DocState = {
        assets: getMockupAssets(),
        sections: [],
    }
    
    private doc = $state<DocState>(this.initialDoc);
    
    historyManager = new HistoryManager(this.initialDoc);
    private unsub: (() => void) | null = null;
    
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

	getParentWidget<T extends Widget>(id: string): T | null {
		const parent = du.getParentByChildId(id, this.doc);
		if (!parent) return null;
		return parent as T;
	}

    getElement(id: string, breakPoint: BreakPoint): HTMLElement|null {
        const el = document.getElementById(`${id}-${breakPoint}`);
        // if (!el) 
        //     console.error(`Element with id ${id} not found`);
        return el;
    }

    constructor() {
        this.initialize();
    }

    initialize() {
        if (this.unsub) return;

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
        if (this.unsub) {
            this.unsub();
            this.unsub = null;
        }
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

	setBatchMode = () => {
		this.historyManager.setBatchMode();
	}
	cancelBatch = () => {
		this.historyManager.cancelBatch();
	}
	commitBatch = () => {
		this.historyManager.commitBatch();
	}

    // reactive한 히스토리 정보 getter
    get historyInfo() {
        return this._historyInfo;
    }

    // localStorage 키

    // 문서를 localStorage에 저장
    saveToLocalStorage = (docKey: string) => {
        try {
            const docData = {
                doc: this.doc,
                timestamp: Date.now()
            };
            localStorage.setItem(docKey, JSON.stringify(docData));
            return true;
        } catch (error) {
            console.error('Failed to save document:', error);
            return false;
        }
    }

    // localStorage에서 문서 불러오기
    loadFromLocalStorage = (docKey: string) => {
        try {
            const savedData = localStorage.getItem(docKey);
            if (!savedData) {
                return false;
            }
            
            const { doc } = JSON.parse(savedData);
            
            // 히스토리에 새로운 상태로 실행 (execute 사용) -> setState로 변경하여 강제 업데이트 및 히스토리 초기화
            // 페이지 전환 시 이전 페이지의 히스토리가 남는 것을 방지하고 확실한 렌더링 갱신을 보장함
            this.historyManager.setState(doc);
            this.historyManager.clear();
            this.activeId = null;
            
            return true;
        } catch (error) {
            console.error('Failed to load document:', error);
            return false;
        }
    }

    reset = () => {
        const freshDoc: DocState = {
            assets: getMockupAssets(),
            sections: [],
        };
        
        this.doc = freshDoc;

        // 현재 상태를 초기 상태로 강제 설정 (히스토리 기록 없음)
        this.historyManager.setState(freshDoc);
        // 히스토리 스택(undo/redo) 비우기
        this.historyManager.clear();
        // 선택된 아이템 초기화
        this.activeId = null;
    }

    isEmpty = () => {
        return this.document.sections.length === 0;
    }

    // 저장된 문서가 있는지 확인
    hasSavedDocument = (docKey: string) => {
        try {
            return localStorage.getItem(docKey) !== null;
        } catch {
            return false;
        }
    }

    getParentByChildId(id: string): Readonly<CompositeWidget> | undefined {
        return du.getParentByChildId(id, this.doc);
    }

    hasChild(id: string): boolean {
        return du.hasChild(id, this.doc);
    }

    /**
     * 자식 추가 가능한 부모 id를 반환합니다.
     * @param id 
     * @returns 
     */
    getAddableParentId(id: string): string {
        if (this.hasChild(id)) {
            return id;
        }
        return this.getParentByChildId(id)?.id || '';
    }
}

export const studioDoc = new StudioDoc();