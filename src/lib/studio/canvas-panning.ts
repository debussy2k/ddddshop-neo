import interact from 'interactjs';
import type { DragEvent } from '@interactjs/types';

export type PanningConfig = {
	inputElement: HTMLElement;  // 입력을 받을 엘리먼트
	targetElement: HTMLElement; // transform을 적용할 엘리먼트
	onPanChange?: (x: number, y: number) => void;
	onSpacePressed?: (isPressed: boolean) => void;
	onScaleChange?: (scale: number, panX: number, panY: number) => void;
};

/**
 * Infinite Canvas 패닝 기능을 설정합니다.
 * Space 키를 누른 상태에서 드래그하면 캔버스가 이동됩니다.
 * Control 키를 누른 상태에서 마우스 휠을 사용하면 줌이 적용됩니다.
 */
export function setupCanvasPanning(config: PanningConfig) {
	let isSpacePressed = false;
	let panX = 0;
	let panY = 0;
	let isDragging = false;
	let scale = 1;
	
	const MIN_SCALE = 0.1;
	const MAX_SCALE = 10;
	const ZOOM_SPEED = 0.001;

	// Space 키 이벤트 리스너
	const handleKeyDown = (e: KeyboardEvent) => {
		// Space 키가 눌렸고, 입력 필드에 포커스가 없을 때만
		if (e.code === 'Space' && !isSpacePressed) {
			const target = e.target as HTMLElement;
			// input, textarea 등에서는 space 키 이벤트를 무시
			if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
				return;
			}
			
			console.log('space key down', e.code);
			isSpacePressed = true;
			e.preventDefault();
			
			// 커서 모양 변경 - inputElement에 적용
			config.inputElement.style.cursor = isDragging ? 'grabbing' : 'grab';
			config.onSpacePressed?.(true);
		}
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		if (e.code === 'Space') {
			isSpacePressed = false;
			config.inputElement.style.cursor = '';
			config.onSpacePressed?.(false);
		}
	};

	// 마우스 휠 이벤트 리스너 (줌 기능)
	const handleWheel = (e: WheelEvent) => {
		// Control 키가 눌린 상태에서만 줌 동작
		if (e.ctrlKey) {
			e.preventDefault();
			
			// 마우스 위치 (inputElement 기준)
			const rect = config.inputElement.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			
			// 줌 전 마우스 위치의 월드 좌표 계산
			const worldX = (mouseX - panX) / scale;
			const worldY = (mouseY - panY) / scale;
			
			// 새로운 scale 계산
			const delta = -e.deltaY * ZOOM_SPEED;
			const newScale = Math.min(Math.max(scale * (1 + delta), MIN_SCALE), MAX_SCALE);
			
			// 같은 월드 좌표가 같은 화면 좌표에 오도록 pan 조정
			panX = mouseX - worldX * newScale;
			panY = mouseY - worldY * newScale;
			scale = newScale;
			
			// Transform 적용
			applyTransform();
			
			config.onScaleChange?.(scale, panX, panY);
		}
	};

	// Draggable 설정 - inputElement에서 입력 받기
	const interactable = interact(config.inputElement)
		.styleCursor(false)  // interact.js가 자동으로 커서를 변경하지 않도록 설정
		.draggable({
		listeners: {
			start: (event: DragEvent) => {
				// Space 키가 눌린 상태에서만 드래그 시작
				if (!isSpacePressed) {
					return;
				}

			isDragging = true;
			config.inputElement.style.cursor = 'grabbing';
				event.stopPropagation();
			},
			move: (event: DragEvent) => {
				if (!isSpacePressed || !isDragging) {
					return;
				}

				// 이동 delta를 누적
				panX += event.dx;
				panY += event.dy;

				// Transform 적용 - targetElement에 적용
				applyTransform();
				
				config.onPanChange?.(panX, panY);
				event.stopPropagation();
			},
			end: (event: DragEvent) => {
				if (!isDragging) {
					return;
				}

				isDragging = false;
				
				config.inputElement.style.cursor = isSpacePressed ? 'grab' : '';
				config.onPanChange?.(panX, panY);
				event.stopPropagation();
			}
		},
		// Space 키를 누른 상태에서만 드래그 가능하도록 조건 설정
		manualStart: false
	});

	function applyTransform() {
		// targetElement에 transform 적용 (pan과 scale 모두 적용)
		config.targetElement.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
	}

	// 이벤트 리스너 등록
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
	config.inputElement.addEventListener('wheel', handleWheel, { passive: false });

	// cleanup과 resetZoom 메서드를 객체로 반환
	return {
		cleanup: () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			config.inputElement.removeEventListener('wheel', handleWheel);
			interactable.unset();
			config.targetElement.style.transform = '';
			config.inputElement.style.cursor = '';
		},
		resetZoom: () => {
			panX = 0;
			panY = 0;
			scale = 1;
			applyTransform();
			config.onScaleChange?.(scale, panX, panY);
		}
	};
}

/**
 * Canvas 패닝 상태를 리셋합니다.
 */
export function resetPanning(element: HTMLElement) {
	element.style.transform = 'translate(0px, 0px) scale(1)';
}

