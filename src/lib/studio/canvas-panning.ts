import interact from 'interactjs';
import type { DragEvent } from '@interactjs/types';

export type PanningConfig = {
	inputElement: HTMLElement;  // 입력을 받을 엘리먼트
	targetElement: HTMLElement; // transform을 적용할 엘리먼트
	onPanChange?: (x: number, y: number) => void;
    onSpacePressed?: (isPressed: boolean) => void;
};

/**
 * Infinite Canvas 패닝 기능을 설정합니다.
 * Space 키를 누른 상태에서 드래그하면 캔버스가 이동됩니다.
 */
export function setupCanvasPanning(config: PanningConfig) {
	let isSpacePressed = false;
	let panX = 0;
	let panY = 0;
	let isDragging = false;

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
		// targetElement에 transform 적용
		config.targetElement.style.transform = `translate(${panX}px, ${panY}px)`;
	}

	// 이벤트 리스너 등록
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);

	// Cleanup 함수 반환
	return () => {
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
		interactable.unset();
		config.targetElement.style.transform = '';
		config.inputElement.style.cursor = '';
	};
}

/**
 * Canvas 패닝 상태를 리셋합니다.
 */
export function resetPanning(element: HTMLElement) {
	element.style.transform = 'translate(0px, 0px)';
}

