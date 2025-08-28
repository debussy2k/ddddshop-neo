import { produceWithPatches, applyPatches, enablePatches, type Patch } from 'immer';

// Immer patches 기능을 활성화
enablePatches();

interface HistoryState<T> {
	past: Array<{ patches: Patch[]; inversePatches: Patch[] }>;
	present: T;
	future: Array<{ patches: Patch[]; inversePatches: Patch[] }>;
}

class HistoryManager<T extends Record<string, any>> {
	private history: HistoryState<T>;
	private maxHistorySize: number;
	private listeners: Set<(state: T) => void> = new Set();

	constructor(initialState: T, maxHistorySize: number = 50) {
		this.history = {
			past: [],
			present: initialState,
			future: []
		};
		this.maxHistorySize = maxHistorySize;
	}

	/**
	 * 새로운 상태를 적용하고 히스토리에 추가
	 */
	execute(producer: (draft: T) => void | T): T {
		const [nextState, patches, inversePatches] = produceWithPatches(
			this.history.present,
			producer
		);

		// 변경사항이 있는 경우에만 히스토리에 추가
		if (patches.length > 0) {
			// 새로운 변경사항이 적용되면 future는 클리어
			this.history.future = [];
			
			// past에 현재 변경사항 추가
			this.history.past.push({ patches, inversePatches });
			
			// 히스토리 크기 제한
			if (this.history.past.length > this.maxHistorySize) {
				this.history.past.shift();
			}
			
			this.history.present = nextState;
			this.notifyListeners();
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