<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { setupMouseDetection, setupDragResize, toPixelValue } from "$lib/utils/drag-resize";
	import { onMount } from "svelte";

	interface Props {
		class?: ClassValue;
		/** 리사이즈할 대상 요소 */
		targetElement: HTMLElement;
		/** 리사이즈 방향 */
		direction?: 'horizontal' | 'vertical';
		/** 마우스 감지 임계값 (px) */
		threshold?: number;
		/** 감지 방향 */
		detectionDirection?: 'top' | 'bottom' | 'left' | 'right';
		/** 최소 크기 */
		minSize?: number;
		/** 최대 크기 */
		maxSize?: number;
		/** 리사이즈 시작 콜백 */
		onStart?: (initialSize: number) => void;
		/** 리사이즈 중 콜백 */
		onResize?: (newSize: number) => void;
		/** 리사이즈 완료 콜백 */
		onEnd?: (finalSize: number) => void;
	}

	let { 
		class: className,
		targetElement,
		direction = 'vertical',
		threshold = 10,
		detectionDirection = 'bottom',
		minSize = 50,
		maxSize = 800,
		onStart,
		onResize,
		onEnd
	}: Props = $props();

	let resizeHandle = $state<HTMLElement>();
	let showResizeHandle = $state(false);
	let isDragging = $state(false);

	// 드래그 리사이즈 클린업 함수
	let cleanupDragResize: (() => void) | null = null;
	let cleanupMouseDetection: (() => void) | null = null;

	// targetElement가 변경될 때 마우스 감지 설정
	$effect(() => {
		// 기존 마우스 감지 정리
		cleanupMouseDetection?.();
		cleanupMouseDetection = null;

		if (!targetElement) return;

		// 마우스 감지 설정
		cleanupMouseDetection = setupMouseDetection({
			element: targetElement,
			threshold,
			direction: detectionDirection,
			onEnter: () => {
				showResizeHandle = true;
			},
			onLeave: () => {
				// 드래그 중이 아닐 때만 핸들 숨김
				if (!isDragging) {
					showResizeHandle = false;
				}
			}
		});
	});

	// 리사이즈 핸들에 마우스 이벤트 추가
	function handleResizeHandleMouseEnter() {
		showResizeHandle = true;
	}

	function handleResizeHandleMouseLeave() {
		if (!isDragging) {
			showResizeHandle = false;
		}
	}

	onMount(() => {
		return () => {
			cleanupMouseDetection?.();
			cleanupDragResize?.();
		};
	});

	// resizeHandle이 생성되면 드래그 기능 설정
	$effect(() => {
		if (resizeHandle && targetElement) {
			// 기존 리스너 정리
			cleanupDragResize?.();
			
			cleanupDragResize = setupDragResize({
				element: targetElement,
				handle: resizeHandle,
				direction,
				minSize,
				maxSize,
				onStart: (initialSize) => {
					isDragging = true;
					onStart?.(initialSize);
				},
				onResize: (newSize) => {
					onResize?.(newSize);
				},
				onEnd: (finalSize) => {
					isDragging = false;
					onEnd?.(finalSize);
				}
			});
		} else {
			// resizeHandle이 없으면 클린업
			cleanupDragResize?.();
			cleanupDragResize = null;
		}
	});

	// 위치 및 스타일 클래스 계산
	let positionClasses = $derived(() => {
		switch (detectionDirection) {
			case 'bottom':
				return 'absolute bottom-0 left-2/3 w-[180px] h-3'; // 수평 위치 2/3 지점에 표시
			case 'top':
				return 'absolute top-0 left-2/3 w-20 h-3';
			case 'right':
				return 'absolute right-0 top-2/3 w-3 h-20';
			case 'left':
				return 'absolute left-0 top-2/3 w-3 h-20';
			default:
				return 'absolute bottom-0 left-2/3 w-20 h-3';
		}
	});

	let cursorClass = $derived(() => {
		return direction === 'horizontal' ? 'cursor-ew-resize' : 'cursor-ns-resize';
	});

	let positionStyle = $derived((): string => {
		switch (detectionDirection) {
			case 'bottom':
				return 'transform: translateY(50%);'; // 핸들의 절반이 바닥라인 아래로 나오도록
			case 'top':
				return 'transform: translateY(-50%);'; // 핸들의 절반이 상단라인 위로 나오도록
			case 'right':
				return 'transform: translateX(50%);';
			case 'left':
				return 'transform: translateX(-50%);';
			default:
				return 'transform: translateY(50%);';
		}
	});

	// 아이콘 방향 계산
	let iconRotation = $derived(() => {
		return direction === 'horizontal' ? 'rotate(90deg)' : 'rotate(0deg)';
	});
</script>

<!-- 리사이즈 핸들 -->
{#if showResizeHandle || isDragging}
	<div 
		bind:this={resizeHandle}
		class={cn(
			positionClasses(),
			'bg-blue-600 flex items-center justify-center group z-50',
			cursorClass(),
			className
		)}
		style={positionStyle()}
		role="button"
		tabindex="0"
		aria-label="크기 조절 핸들"
		onmouseenter={handleResizeHandleMouseEnter}
		onmouseleave={handleResizeHandleMouseLeave}
	>
		<!-- 리사이즈 아이콘 -->
		<div class="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 ">
			<span>크기조절</span>
		</div>
	</div>
{/if}
