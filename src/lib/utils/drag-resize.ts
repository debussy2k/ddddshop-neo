/**
 * 드래그를 통한 리사이즈 기능을 제공하는 유틸리티
 */

export interface DragResizeOptions {
	/** 리사이즈할 요소 */
	element: HTMLElement;
	/** 리사이즈 핸들 요소 */
	handle: HTMLElement;
	/** 리사이즈 방향 */
	direction: 'horizontal' | 'vertical';
	/** 최소 크기 */
	minSize?: number;
	/** 최대 크기 */
	maxSize?: number;
	/** 리사이즈 시작 시 콜백 */
	onStart?: (initialSize: number) => void;
	/** 리사이즈 중 콜백 */
	onResize?: (newSize: number) => void;
	/** 리사이즈 완료 시 콜백 */
	onEnd?: (finalSize: number) => void;
}

export interface MouseDetectionOptions {
	/** 감지할 요소 */
	element: HTMLElement;
	/** 감지 영역 두께 (px) */
	threshold: number;
	/** 감지 방향 */
	direction: 'top' | 'bottom' | 'left' | 'right';
	/** 마우스 진입 시 콜백 */
	onEnter?: () => void;
	/** 마우스 벗어날 시 콜백 */
	onLeave?: () => void;
}

/**
 * 드래그 리사이즈 기능을 설정합니다
 */
export function setupDragResize(options: DragResizeOptions): () => void {
	const { element, handle, direction, minSize = 50, maxSize = 1000, onStart, onResize, onEnd } = options;
	
	let isDragging = false;
	let startPos = 0;
	let startSize = 0;

	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		
		isDragging = true;
		startPos = direction === 'horizontal' ? e.clientX : e.clientY;
		
		const rect = element.getBoundingClientRect();
		startSize = direction === 'horizontal' ? rect.width : rect.height;
		
		onStart?.(startSize);
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		// 윈도우 포커스를 잃었을 때도 드래그 중단
		window.addEventListener('blur', handleMouseUp);
		document.body.style.cursor = direction === 'horizontal' ? 'ew-resize' : 'ns-resize';
		document.body.style.userSelect = 'none';
	}

	let animationFrameId: number | null = null;

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		
		// requestAnimationFrame을 사용하여 성능 최적화
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		
		animationFrameId = requestAnimationFrame(() => {
			const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
			const delta = currentPos - startPos;
			const newSize = Math.max(minSize, Math.min(maxSize, startSize + delta));
			
			onResize?.(newSize);
			animationFrameId = null;
		});
	}

	function handleMouseUp() {
		if (!isDragging) return;
		
		// 진행 중인 애니메이션 프레임 취소
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
		
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		window.removeEventListener('blur', handleMouseUp);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
		
		const rect = element.getBoundingClientRect();
		const finalSize = direction === 'horizontal' ? rect.width : rect.height;
		onEnd?.(finalSize);
	}

	handle.addEventListener('mousedown', handleMouseDown);
	
	// 클린업 함수 반환
	return () => {
		// 진행 중인 애니메이션 프레임 취소
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
		
		handle.removeEventListener('mousedown', handleMouseDown);
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		window.removeEventListener('blur', handleMouseUp);
		
		// 드래그 상태 초기화
		isDragging = false;
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	};
}

/**
 * 요소 경계 근처의 마우스 감지 기능을 설정합니다
 */
export function setupMouseDetection(options: MouseDetectionOptions): () => void {
	const { element, threshold, direction, onEnter, onLeave } = options;
	
	let isInZone = false;
	let throttleId: number | null = null;

	function handleMouseMove(e: MouseEvent) {
		// throttle을 사용하여 성능 최적화
		if (throttleId) return;
		
		throttleId = requestAnimationFrame(() => {
			const rect = element.getBoundingClientRect();
			let inDetectionZone = false;

			switch (direction) {
				case 'bottom':
					inDetectionZone = e.clientY >= rect.bottom - threshold && e.clientY <= rect.bottom + threshold;
					break;
				case 'top':
					inDetectionZone = e.clientY >= rect.top - threshold && e.clientY <= rect.top + threshold;
					break;
				case 'right':
					inDetectionZone = e.clientX >= rect.right - threshold && e.clientX <= rect.right + threshold;
					break;
				case 'left':
					inDetectionZone = e.clientX >= rect.left - threshold && e.clientX <= rect.left + threshold;
					break;
			}

			// 마우스가 감지 영역에 있고 요소 내부에도 있는지 확인
			const isInsideElement = e.clientX >= rect.left && e.clientX <= rect.right && 
								   e.clientY >= rect.top && e.clientY <= rect.bottom;

			const shouldBeInZone = inDetectionZone && isInsideElement;

			if (shouldBeInZone && !isInZone) {
				isInZone = true;
				onEnter?.();
			} else if (!shouldBeInZone && isInZone) {
				isInZone = false;
				onLeave?.();
			}
			
			throttleId = null;
		});
	}

	function handleMouseLeave() {
		if (throttleId) {
			cancelAnimationFrame(throttleId);
			throttleId = null;
		}
		if (isInZone) {
			isInZone = false;
			onLeave?.();
		}
	}

	element.addEventListener('mousemove', handleMouseMove);
	element.addEventListener('mouseleave', handleMouseLeave);
	
	// 클린업 함수 반환
	return () => {
		if (throttleId) {
			cancelAnimationFrame(throttleId);
			throttleId = null;
		}
		element.removeEventListener('mousemove', handleMouseMove);
		element.removeEventListener('mouseleave', handleMouseLeave);
	};
}

/**
 * 픽셀 값에서 숫자 추출
 */
export function parsePixelValue(value: string): number {
	return parseInt(value.replace('px', ''), 10) || 0;
}

/**
 * 숫자를 픽셀 값으로 변환
 */
export function toPixelValue(value: number): string {
	return `${value}px`;
}
