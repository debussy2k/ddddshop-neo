import { produceWithPatches, applyPatches, enablePatches, type Patch } from 'immer';

enablePatches();

export enum HistoryMode {
	/** 모든 변경사항을 히스토리에 기록 */
	RECORD = 'record',
	/** 변경사항을 히스토리에 기록하지 않음 (실시간 업데이트만) */
	SILENT = 'silent',
	/** 배치 모드 - 시작점을 저장하고 종료 시 한 번에 히스토리에 기록 */
	BATCH = 'batch'
}

interface PatchEntry {
	patches: Patch[];
	inversePatches: Patch[];
}

interface HistoryState<T> {
	past: PatchEntry[];
	present: T;
	future: PatchEntry[];
}

export interface HistoryInfo {
	pastCount: number;
	futureCount: number;
	canUndo: boolean;
	canRedo: boolean;
	currentMode: HistoryMode;
}

/**
 * Immer 기반 Undo/Redo 히스토리 매니저
 *
 * 제네릭 타입 T는 관리할 상태 객체의 타입입니다.
 * Immer의 structural sharing과 patches를 활용하여 메모리 효율적인
 * undo/redo를 구현합니다.
 *
 * @example
 * ```ts
 * interface AppState { items: { id: string; name: string }[] }
 * const manager = new HistoryManager<AppState>({ items: [] });
 *
 * manager.execute(draft => { draft.items.push({ id: '1', name: 'Item 1' }); });
 * manager.undo();
 * manager.redo();
 * ```
 */
export class HistoryManager<T extends Record<string, any>> {
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
	 *
	 * @param producer - Immer의 produce 함수에 전달할 콜백.
	 *                   draft 객체를 직접 수정하면 됩니다.
	 * @returns 변경 적용 후의 상태
	 */
	execute(producer: (draft: T) => void | T): T {
		const [nextState, patches, inversePatches] = produceWithPatches(
			this.history.present,
			producer
		);

		if (patches.length > 0) {
			this.history.present = nextState;
			this.history.future = [];
			this.notifyListeners();

			switch (this.currentMode) {
				case HistoryMode.RECORD:
					this.history.past.push({ patches, inversePatches });
					if (this.history.past.length > this.maxHistorySize) {
						this.history.past.shift();
					}
					break;
				case HistoryMode.SILENT:
					break;
				case HistoryMode.BATCH:
					break;
			}
		}

		return this.history.present;
	}

	/**
	 * 이전 상태로 되돌리기 (Undo)
	 * @returns 되돌린 상태 또는 불가능한 경우 null
	 */
	undo(): T | null {
		if (this.history.past.length === 0) return null;

		const { inversePatches } = this.history.past.pop()!;
		const previousState = applyPatches(this.history.present, inversePatches);

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
	 * 다음 상태로 복원하기 (Redo)
	 * @returns 복원한 상태 또는 불가능한 경우 null
	 */
	redo(): T | null {
		if (this.history.future.length === 0) return null;

		const { patches } = this.history.future.shift()!;
		const nextState = applyPatches(this.history.present, patches);

		const [_, patches2, inversePatches] = produceWithPatches(
			this.history.present,
			() => nextState
		);

		this.history.past.push({ patches: patches2, inversePatches });
		this.history.present = nextState;

		this.notifyListeners();
		return this.history.present;
	}

	getCurrentState(): T {
		return this.history.present;
	}

	canUndo(): boolean {
		return this.history.past.length > 0;
	}

	canRedo(): boolean {
		return this.history.future.length > 0;
	}

	getHistoryInfo(): HistoryInfo {
		return {
			pastCount: this.history.past.length,
			futureCount: this.history.future.length,
			canUndo: this.canUndo(),
			canRedo: this.canRedo(),
			currentMode: this.currentMode
		};
	}

	/** 히스토리(past/future) 초기화. present는 유지됩니다. */
	clear(): void {
		this.history.past = [];
		this.history.future = [];
		this.notifyListeners();
	}

	/**
	 * 상태 변경 리스너 등록
	 * @returns 구독 해제 함수
	 */
	subscribe(listener: (state: T) => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notifyListeners(): void {
		this.listeners.forEach(listener => listener(this.history.present));
	}

	/** 히스토리에 기록하지 않고 상태를 직접 교체 */
	setState(newState: T): void {
		this.history.present = newState;
		this.notifyListeners();
	}

	// ─── 기록 모드 관련 ──────────────────────────────

	setHistoryMode(mode: HistoryMode, options?: { commitOnModeChange?: boolean }): void {
		const shouldCommit = options?.commitOnModeChange !== false;

		if (this.currentMode === HistoryMode.BATCH && this.batchStartState !== null) {
			if (shouldCommit) {
				this.commitBatch();
			} else {
				this.batchStartState = null;
			}
		}

		this.currentMode = mode;

		if (mode === HistoryMode.BATCH) {
			this.startBatch();
		}
	}

	getHistoryMode(): HistoryMode {
		return this.currentMode;
	}

	/** SILENT 모드 전환 - 배치 커밋 없이 히스토리 기록 중단 */
	setSilentMode(): void {
		this.setHistoryMode(HistoryMode.SILENT, { commitOnModeChange: false });
	}

	/** RECORD 모드 전환 - 기본 모드 */
	setRecordMode(): void {
		this.setHistoryMode(HistoryMode.RECORD);
	}

	/** BATCH 모드 전환 - 여러 변경을 하나의 undo 단위로 묶음 */
	setBatchMode(): void {
		this.setHistoryMode(HistoryMode.BATCH);
	}

	private startBatch(): void {
		this.batchStartState = structuredClone(this.history.present);
	}

	/**
	 * 배치 모드 커밋 - 배치 시작점과 현재 상태를 비교하여 히스토리에 저장.
	 * 커밋 후 RECORD 모드로 자동 전환됩니다.
	 */
	commitBatch(): T {
		if (this.currentMode !== HistoryMode.BATCH || !this.batchStartState) {
			return this.history.present;
		}

		const startState = this.batchStartState;
		const endState = this.history.present;

		const [_, patches, inversePatches] = produceWithPatches(
			startState,
			() => endState
		);

		if (patches.length > 0) {
			this.history.future = [];
			this.history.past.push({ patches, inversePatches });
			if (this.history.past.length > this.maxHistorySize) {
				this.history.past.shift();
			}
		}

		this.batchStartState = null;
		this.currentMode = HistoryMode.RECORD;
		this.notifyListeners();

		return this.history.present;
	}

	/**
	 * 배치 모드 취소 - 배치 시작점으로 상태를 되돌림.
	 * 취소 후 RECORD 모드로 자동 전환됩니다.
	 */
	cancelBatch(): T {
		if (this.currentMode !== HistoryMode.BATCH || !this.batchStartState) {
			return this.history.present;
		}

		this.history.present = this.batchStartState;
		this.batchStartState = null;
		this.currentMode = HistoryMode.RECORD;
		this.notifyListeners();

		return this.history.present;
	}

	/**
	 * 지정한 스텝만큼 이동 (음수: 과거, 양수: 미래)
	 * @returns 이동 후 상태 또는 불가능한 경우 null
	 */
	jumpTo(steps: number): T | null {
		if (steps === 0) return this.history.present;

		if (steps < 0) {
			const targetSteps = Math.abs(steps);
			if (targetSteps > this.history.past.length) return null;
			for (let i = 0; i < targetSteps; i++) {
				if (!this.undo()) break;
			}
		} else {
			if (steps > this.history.future.length) return null;
			for (let i = 0; i < steps; i++) {
				if (!this.redo()) break;
			}
		}

		this.notifyListeners();
		return this.history.present;
	}
}

export default HistoryManager;
