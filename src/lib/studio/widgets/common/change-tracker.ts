/**
 * 객체의 변경 감지를 위한 해시 생성 및 비교 함수
 * @param currentValue 현재 값 (객체, 배열, 원시값 모두 가능)
 * @param prevHash 이전 해시 값
 * @returns 현재 해시 값과 변경 여부
 * 
 * @example
 * let prevHash = '';
 * 
 * $effect(() => {
 *   const { currentHash, changed } = detectChanges(someObject, prevHash);
 *   if (changed) {
 *     console.log('값이 변경되었습니다');
 *     doSomething();
 *     prevHash = currentHash;
 *   }
 * });
 */
export function detectChanges<T>(currentValue: T, prevHash: string) {
	const currentHash = JSON.stringify(currentValue);
	
	return {
		currentHash,
		changed: prevHash !== currentHash
	};
}

/**
 * 객체의 특정 필드만 선택하여 변경 감지
 * @param obj 감지할 객체
 * @param fields 추적할 필드 이름 배열
 * @param prevHash 이전 해시 값
 * @returns 현재 해시 값과 변경 여부
 * 
 * @example
 * let prevHash = '';
 * 
 * $effect(() => {
 *   const { currentHash, changed } = detectFieldChanges(
 *     currentProp, 
 *     ['width', 'height', 'minWidth', 'maxWidth'], 
 *     prevHash
 *   );
 *   if (changed) {
 *     console.log('추적 중인 필드가 변경되었습니다');
 *     prevHash = currentHash;
 *   }
 * });
 */
export function detectFieldChanges<T extends Record<string, any>>(
	obj: T,
	fields: (keyof T)[],
	prevHash: string
) {
	const selectedValues = fields.reduce((acc, field) => {
		acc[field as string] = obj[field];
		return acc;
	}, {} as Record<string, any>);

	return detectChanges(selectedValues, prevHash);
}

/**
 * 여러 변경 추적을 관리하는 클래스
 * 
 * @example
 * const tracker = new ChangeTracker();
 * 
 * $effect(() => {
 *   if (tracker.hasChanged('sizeConstraints', currentProp.sizeConstraints)) {
 *     console.log('사이즈 제약이 변경되었습니다');
 *     setupResizableWidget();
 *   }
 *   
 *   if (tracker.hasChanged('position', { x: currentProp.x, y: currentProp.y })) {
 *     console.log('위치가 변경되었습니다');
 *     updatePosition();
 *   }
 * });
 */
export class ChangeTracker {
	private hashes = new Map<string, string>();

	/**
	 * 특정 키에 대한 값의 변경 여부를 확인하고 해시를 업데이트
	 * @param key 추적할 고유 키
	 * @param value 현재 값
	 * @returns 변경 여부
	 */
	hasChanged<T>(key: string, value: T): boolean {
		const prevHash = this.hashes.get(key) || '';
		const { currentHash, changed } = detectChanges(value, prevHash);
		
		if (changed) {
			this.hashes.set(key, currentHash);
		}
		
		return changed;
	}

	/**
	 * 특정 키의 추적 정보를 초기화
	 * @param key 초기화할 키
	 */
	reset(key: string): void {
		this.hashes.delete(key);
	}

	/**
	 * 모든 추적 정보를 초기화
	 */
	resetAll(): void {
		this.hashes.clear();
	}

	/**
	 * 현재 해시 값을 가져오기 (디버깅용)
	 * @param key 키
	 * @returns 해시 값 또는 undefined
	 */
	getHash(key: string): string | undefined {
		return this.hashes.get(key);
	}
}