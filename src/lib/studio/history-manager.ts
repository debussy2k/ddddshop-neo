import { produceWithPatches, applyPatches, enablePatches, type Patch } from 'immer';

// Immer patches 기능을 활성화
enablePatches();

/**
 * 히스토리 기록 모드
 */
enum HistoryMode {
	/** 모든 변경사항을 히스토리에 기록 */
	RECORD = 'record',
	/** 변경사항을 히스토리에 기록하지 않음 (실시간 업데이트만) */
	SILENT = 'silent',
	/** 배치 모드 - 시작점을 저장하고 종료 시 한 번에 히스토리에 기록 */
	BATCH = 'batch'
}

interface HistoryState<T> {
	past: Array<{ patches: Patch[]; inversePatches: Patch[] }>;
	present: T;
	future: Array<{ patches: Patch[]; inversePatches: Patch[] }>;
}

class HistoryManager<T extends Record<string, any>> {
	private history: HistoryState<T>;
	private maxHistorySize: number;
	private listeners: Set<(state: T) => void> = new Set();
	private currentMode: HistoryMode = HistoryMode.RECORD;
	private batchStartState: T | null = null;

	constructor(initialState: T, maxHistorySize: number = 300) {
		this.history = {
			past: [],
			present: initialState,
			future: []
		};
		this.maxHistorySize = maxHistorySize;
	}

	/**
	 * 새로운 상태를 적용하고 현재 기록 모드에 따라 히스토리 처리
	 */
	execute(producer: (draft: T) => void | T): T {
		const [nextState, patches, inversePatches] = produceWithPatches(
			this.history.present,
			producer
		);

		// 변경사항이 있는 경우에만 처리
		if (patches.length > 0) {
			this.history.present = nextState;
			this.notifyListeners();

			// 현재 기록 모드에 따른 히스토리 처리
			switch (this.currentMode) {
				case HistoryMode.RECORD:
					// 즉시 히스토리에 기록
					this.history.future = [];
					this.history.past.push({ patches, inversePatches });
					
					if (this.history.past.length > this.maxHistorySize) {
						this.history.past.shift();
					}
					break;

				case HistoryMode.SILENT:
					// 히스토리에 기록하지 않음 (상태만 업데이트)
					break;

				case HistoryMode.BATCH:
					// 배치 모드에서는 즉시 기록하지 않음 (commitBatch()에서 처리)
					break;
			}
		}

		return this.history.present;
	}

	/**
	 * 이전 상태로 되돌리기 (Undo)
	 */
	undo(): T | null {
		if (this.history.past.length === 0) {
			return null;
		}

		const { inversePatches } = this.history.past.pop()!;
		const previousState = applyPatches(this.history.present, inversePatches);
		
		// 현재 상태를 future에 저장
		const [_, patches, inversePatches2] = produceWithPatches(
			previousState,
			() => this.history.present
		);
		
		this.history.future.unshift({ patches, inversePatches: inversePatches2 });
		this.history.present = previousState;
		
		this.notifyListeners();
		return this.history.present;
	}

	/**
	 * 다음 상태로 되돌리기 (Redo)
	 */
	redo(): T | null {
		if (this.history.future.length === 0) {
			return null;
		}

		const { patches } = this.history.future.shift()!;
		const nextState = applyPatches(this.history.present, patches);
		
		// 현재 상태를 past에 저장
		const [_, patches2, inversePatches] = produceWithPatches(
			this.history.present,
			() => nextState
		);
		
		this.history.past.push({ patches: patches2, inversePatches });
		this.history.present = nextState;
		
		this.notifyListeners();
		return this.history.present;
	}

	/**
	 * 현재 상태 반환
	 */
	getCurrentState(): T {
		return this.history.present;
	}

	/**
	 * Undo 가능 여부 확인
	 */
	canUndo(): boolean {
		return this.history.past.length > 0;
	}

	/**
	 * Redo 가능 여부 확인
	 */
	canRedo(): boolean {
		return this.history.future.length > 0;
	}

	/**
	 * 히스토리 정보 반환
	 */
	getHistoryInfo() {
		return {
			pastCount: this.history.past.length,
			futureCount: this.history.future.length,
			canUndo: this.canUndo(),
			canRedo: this.canRedo()
		};
	}

	/**
	 * 히스토리 초기화
	 */
	clear(): void {
		this.history.past = [];
		this.history.future = [];
		this.notifyListeners();
	}

	/**
	 * 상태 변경 리스너 등록
	 */
	subscribe(listener: (state: T) => void): () => void {
		this.listeners.add(listener);
		// 구독 해제 함수 반환
		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * 모든 리스너에게 상태 변경 알림
	 */
	private notifyListeners(): void {
		this.listeners.forEach(listener => listener(this.history.present));
	}

	/**
	 * 상태를 직접 설정 (히스토리에 추가되지 않음)
	 */
	setState(newState: T): void {
		this.history.present = newState;
		this.notifyListeners();
	}


	/**
	 * 히스토리 기록 모드 설정
	 */
	setHistoryMode(mode: HistoryMode, options?: { commitOnModeChange?: boolean }): void {
		const shouldCommit = options?.commitOnModeChange !== false; // 기본값은 true
		
		// 기존 배치 모드가 진행 중이면 종료
		if (this.currentMode === HistoryMode.BATCH && this.batchStartState !== null && shouldCommit) {
			this.commitBatch();
		} else if (this.currentMode === HistoryMode.BATCH && this.batchStartState !== null && !shouldCommit) {
			// 커밋하지 않고 배치 상태만 초기화
			this.batchStartState = null;
		}

		this.currentMode = mode;

		// 새로운 배치 모드 시작
		if (mode === HistoryMode.BATCH) {
			this.startBatch();
		}
	}

	/**
	 * 현재 히스토리 기록 모드 조회
	 */
	getHistoryMode(): HistoryMode {
		return this.currentMode;
	}

	/**
	 * SILENT 모드로 전환 (히스토리에 기록하지 않고 배치도 커밋하지 않음)
	 */
	setSilentMode(): void {
		this.setHistoryMode(HistoryMode.SILENT, { commitOnModeChange: false });
	}

	/**
	 * RECORD 모드로 전환 (기본 모드)
	 */
	setRecordMode(): void {
		this.setHistoryMode(HistoryMode.RECORD);
	}

    /**
     * BATCH 모드로 전환
     */
    setBatchMode(): void {
        this.setHistoryMode(HistoryMode.BATCH);
    }

	/**
	 * 배치 모드 시작
	 */
	private startBatch(): void {
		this.batchStartState = structuredClone(this.history.present);
	}

	/**
	 * 배치 모드 커밋 - 배치 시작점과 현재 상태를 비교하여 히스토리에 저장
	 */
	commitBatch(): T {
		if (this.currentMode !== HistoryMode.BATCH || !this.batchStartState) {
			return this.history.present;
		}

		const startState = this.batchStartState;
		const endState = this.history.present;

		// 배치 시작점과 현재 상태가 다른 경우에만 히스토리에 저장
		const [_, patches, inversePatches] = produceWithPatches(
			startState,
			() => endState
		);

		if (patches.length > 0) {
			// future 클리어
			this.history.future = [];
			
			// past에 변경사항 추가
			this.history.past.push({ patches, inversePatches });
			
			// 히스토리 크기 제한
			if (this.history.past.length > this.maxHistorySize) {
				this.history.past.shift();
			}
		}

		// 배치 상태 초기화
		this.batchStartState = null;

		return this.history.present;
	}

	/**
	 * 배치 모드 취소 - 배치 시작점으로 되돌리기
	 */
	cancelBatch(): T {
		if (this.currentMode !== HistoryMode.BATCH || !this.batchStartState) {
			return this.history.present;
		}

		// 배치 시작점으로 상태 복원
		this.history.present = this.batchStartState;
		this.notifyListeners();

		// 배치 상태 초기화
		this.batchStartState = null;

		return this.history.present;
	}

	/**
	 * 특정 시점으로 이동 (과거 또는 미래)
	 */
	jumpTo(steps: number): T | null {
		if (steps === 0) return this.history.present;
		
		if (steps < 0) {
			// 과거로 이동
			const targetSteps = Math.abs(steps);
			if (targetSteps > this.history.past.length) return null;
			
			for (let i = 0; i < targetSteps; i++) {
				if (!this.undo()) break;
			}
		} else {
			// 미래로 이동
			if (steps > this.history.future.length) return null;
			
			for (let i = 0; i < steps; i++) {
				if (!this.redo()) break;
			}
		}
		
		return this.history.present;
	}
}

export default HistoryManager;
export { HistoryMode };